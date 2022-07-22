// https://github.com/plotly/plotly-webpack
// @ts-ignore
import * as Plotly from 'plotly.js/dist/plotly.min';
import { ANNOTATIONS_LAYOUT, HOVER_LAYOUT, PLOTLY_CONFIG } from './constants';
import { getVolcanoData } from './csvParser';
import { initCard } from './templates/card';
import { bindSearchToPlot } from './search';

const $container = $('#volcanoPlots')!;
let idNum = 0;

type VolcanoOptions = {
	url: string,
	title: string,
}

const VOLCANO_PLOT = 'volcanoPlot';

export class VolcanoPlot {
	private readonly element: HTMLDivElement;
	private readonly options: VolcanoOptions;
	private genes?: string[];
	private genesLowerCase?: string[];
	private castleEffects?: number[];
	private castlePValues?: number[];
	private castlePValuesLog10?: number[];
	readonly initPromise: Promise<void>;

	constructor (options: VolcanoOptions) {
		const card = initCard({
			id: `${VOLCANO_PLOT}${idNum++}`,
			classes: VOLCANO_PLOT,
		});
		$container.append(card);

		this.element = $(card).find('.card-body')?.get(0) as HTMLDivElement;
		this.options = options;
		this.initPromise = this.createPlot();
	}

	private async createPlot() {
		const { element, options }  = this;
		const { url, title } = options;
		const {
			genes,
			genesLowerCase,
			castleEffects,
			castlePValues,
			castlePValuesLog10,
			colors,
		} = await getVolcanoData(url);

		this.genes = genes;
		this.genesLowerCase = genesLowerCase;
		this.castleEffects = castleEffects;
		this.castlePValues = castlePValues,
		this.castlePValuesLog10 = castlePValuesLog10;
		
		const data = [{
			type: "scattergl",
			mode: "markers",
			marker: {
				color: colors,
			},
			x: castleEffects,
			y: castlePValuesLog10,
			text: genes,
			customdata: castlePValues,
			...HOVER_LAYOUT,
			hovertemplate:`
Gene: <b>%{text}</b><br>
p-Value: <b>%{customdata:.3f}</b><br>
Effect Score: <b>%{x:.2f}</b>
<extra></extra>`,
		}];

		const layout = {
			xaxis: {
				type: 'linear',
				autorange: true,
				dtick: 2,
				title: '<span>⭠ KO inhibits differentiation</span>   Effect Score   <span>KO promotes differentiation ➝</span>',
				fixedrange: true,
			},
			yaxis: {
				type: 'linear',
				autorange: true,
				dtick: 2,
				title: '-log<sub>10</sub>(p-Value)',
				fixedrange: true,
			},
			title: {
				text: title,
				y: 0.88,
			},
		};
		
		Plotly.newPlot(element, data as any, layout, PLOTLY_CONFIG);

		bindSearchToPlot(element);
	}

	hideAnnotations () {
		const { element } = this;
		// Remove any existing annotations.
		Plotly.relayout(element, {
			annotations: [],
		});
	}

	annotateGene(gene: string) {
		const {
			element,
			genes,
			genesLowerCase,
			castleEffects,
			castlePValues,
			castlePValuesLog10,
		} = this;
		if (!genes || !genesLowerCase || !castleEffects || !castlePValues || !castlePValuesLog10) {
			throw new Error('Data missing.');
		};

		// Get index of currently searched gene.
		const geneIndex = genesLowerCase.indexOf(gene);

		if (geneIndex < 0) {
			// No gene hit in this dataset.
			this.hideAnnotations();
			return {
				name: this.options.title,
			};;
		}

		const data = {
			castleEffect: castleEffects[geneIndex],
			castlePValue: castlePValues[geneIndex],
			castlePValueLog10: castlePValuesLog10[geneIndex],
			name: this.options.title,
		};

		const layoutUpdate = {
			annotations: [
				{
					...ANNOTATIONS_LAYOUT,
					x: data.castleEffect,
					y: data.castlePValueLog10,
					text: genes[geneIndex],
				},
			],
		};
		Plotly.relayout(element, layoutUpdate);

		return data;
	}
}
