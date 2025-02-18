// https://github.com/plotly/plotly-webpack
// @ts-ignore
import * as Plotly from 'plotly.js/dist/plotly.min';
import { getVolcanoCompareData } from './csvParser';
import { ANNOTATIONS_LAYOUT, PLOTLY_CONFIG, HOVER_LAYOUT } from './constants';
import { initCard } from './templates/card';
import { bindSearchToPlot } from './search';

const $container = $('#volcanoComparePlots')!;
let idNum = 0;

type VolcanoCompareOptions = {
	url1: string,
	title1: string,
	url2: string,
	title2: string,
}

const VOLCANO_COMPARE_PLOT = 'volcanoComparePlot';

export class VolcanoPlotCompare {
	private readonly element: HTMLDivElement;
	private readonly options: VolcanoCompareOptions;
	private genes?: string[];
	private genesLowerCase?: string[];
	private castleEffects1?: number[];
	private castlePValues1Log10?: number[];
	private castleEffects2?: number[];
	private castlePValues2Log10?: number[];
	readonly initPromise: Promise<void>;

	constructor (options: VolcanoCompareOptions) {
		const card = initCard({
			id: `${VOLCANO_COMPARE_PLOT}${idNum++}`,
			classes: VOLCANO_COMPARE_PLOT,
		});
		$container.append(card);

		this.element = $(card).find('.card-body')?.get(0) as HTMLDivElement;
		this.options = options;
		this.initPromise = this.createPlot();
	}

	private async createPlot() {
		const { element, options, } = this;
		const {
			url1, url2, title1, title2,
		} = options;
		const {
			genes,
			genesLowerCase,
			castleEffects1,
			castlePValues1,
			castlePValues1Log10,
			castleEffects2,
			castlePValues2,
			castlePValues2Log10,
			// highlightedIndices,
			// partiallyHighlightedIndices,
		} = await getVolcanoCompareData(url1, url2);

		this.genes = genes;
		this.genesLowerCase = genesLowerCase;
		this.castleEffects1 = castleEffects1;
		this.castlePValues1Log10 = castlePValues1Log10;
		this.castleEffects2 = castleEffects2;
		this.castlePValues2Log10 = castlePValues2Log10;

		const customdata: (string | number)[][] = [];
		for (let i = 0; i < castleEffects1.length; i++) {
			customdata.push([castleEffects1[i], castleEffects2[i], castlePValues1[i], castlePValues2[i]]);
		}

		const hovertemplate =`
Gene: <b>%{text}</b><br>
${title1} p-Value: <b>%{customdata[2]:.3f}</b><br>
${title1} Effect Score: <b>%{customdata[0]:.2f}</b><br>
${title2} p-Value: <b>%{customdata[3]:.3f}</b><br>
${title2} Effect Score: <b>%{customdata[1]:.2f}</b>
<extra></extra>`

		const data = {
			type: "scattergl",
			mode: "markers",
			marker: {
				color: 'rgba(0,0,0,0.2)',
			},
			x: castlePValues1Log10,
			y: castlePValues2Log10,
			text: genes,
			customdata,
			...HOVER_LAYOUT,
			hovertemplate,
		};

		function getHighlightedData(highlightedIndices: number[], color: string) {
			const highlightedPValues1 = [];
			const highlightedPValues2 = [];
			const highlightedGenes = [];
			const highlightedCustomData = [];
			for (let i = 0; i < highlightedIndices.length; i++) {
				const index = highlightedIndices[i];
				highlightedPValues1.push(castlePValues1Log10[index]);
				highlightedPValues2.push(castlePValues2Log10[index]);
				highlightedGenes.push(genes[index]);
				highlightedCustomData.push(customdata[index]);
			}

			return {
				type: "scattergl",
				mode: "markers",
				marker: {
					color,
				},
				x: highlightedPValues1,
				y: highlightedPValues2,
				text: highlightedGenes,
				customdata: highlightedCustomData,
				...HOVER_LAYOUT,
				hovertemplate,
			};
		}

		const layout = {
			xaxis: {
				type: 'linear',
				autorange: true,
				dtick: 2,
				title: `${title1} signed -log<sub>10</sub>(p-Value)`,
				fixedrange: true,
			},
			yaxis: {
				type: 'linear',
				autorange: true,
				dtick: 2,
				title: `${title2} signed -log<sub>10</sub>(p-Value)`,
				scaleanchor: "x",
				scaleratio: 1,
				fixedrange: true,
			},
			title: {
				text: `${title1} vs ${title2}`,
				y: 0.93,
			},
			showlegend: false,
		};

		Plotly.newPlot(element, [
			data,
			// getHighlightedData(highlightedIndices, 'rgb(170, 0, 200)'),
			// getHighlightedData(partiallyHighlightedIndices, 'rgb(230, 180, 255)'),
		], layout, PLOTLY_CONFIG);

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
			castlePValues1Log10,
			castlePValues2Log10,
		} = this;
		if (!genes || !genesLowerCase || !castlePValues1Log10 || !castlePValues2Log10) return;

		// Get index of currently searched gene.
		const geneIndex = genesLowerCase.indexOf(gene);

		if (geneIndex < 0) {
			// No gene hit in this dataset.
			this.hideAnnotations();
			return;
		}

		const layoutUpdate = {
			annotations: [
				{
					...ANNOTATIONS_LAYOUT,
					x: castlePValues1Log10[geneIndex],
					y: castlePValues2Log10[geneIndex],
					text: genes[geneIndex],
				},
			],
		};
		Plotly.relayout(element, layoutUpdate);
	}
}
