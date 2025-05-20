// // https://github.com/plotly/plotly-webpack
// // @ts-ignore
// import * as Plotly from 'plotly.js/dist/plotly.min';
// import { ANNOTATIONS_LAYOUT, HOVER_LAYOUT, PLOTLY_CONFIG } from './constants';
// import { getVolcanoExpressionData } from './csvParser';
// import { bindSearchToPlot } from './search';
// import { VolcanoOptions, VolcanoPlot } from './VolcanoPlot';

// interface VolcanoExpressionOptions extends VolcanoOptions{
// 	pName: string,
// 	effName: string,
// }

// export class VolcanoPlotExpression extends VolcanoPlot {
// 	protected readonly options!: VolcanoExpressionOptions;

// 	constructor (options: VolcanoExpressionOptions) {
// 		super(options, $('#geneExpressionPlots')!);
// 	}

// 	protected async createPlot() {
// 		const { element, options }  = this;
// 		const { url, title, pName, effName } = options;
// 		const {
// 			genes,
// 			genesLowerCase,
// 			castleEffects,
// 			castlePValues,
// 			castlePValuesLog10,
// 			colors,
// 		} = await getVolcanoExpressionData(url, pName, effName);
// 		this.genes = genes;
// 		this.genesLowerCase = genesLowerCase;
// 		this.castleEffects = castleEffects;
// 		this.castlePValues = castlePValues;
// 		this.castlePValuesLog10 = castlePValuesLog10;
		
// 		const data = [{
// 			type: "scattergl",
// 			mode: "markers",
// 			marker: {
// 				color: colors,
// 			},
// 			x: castleEffects,
// 			y: castlePValuesLog10,
// 			text: genes,
// 			customdata: castlePValues,
// 			...HOVER_LAYOUT,
// 			hovertemplate:`
// Gene: <b>%{text}</b><br>
// p-Value: <b>%{customdata:.3f}</b><br>
// Effect Score: <b>%{x:.2f}</b>
// <extra></extra>`,
// 		}];

// 		const layout = {
// 			xaxis: {
// 				type: 'linear',
// 				autorange: true,
// 				dtick: 2,
// 				title: 'Effect Score',
// 				fixedrange: true,
// 			},
// 			yaxis: {
// 				type: 'linear',
// 				autorange: true,
// 				dtick: 50,
// 				title: '-log<sub>10</sub>(p-Value)',
// 				fixedrange: true,
// 			},
// 			title: {
// 				text: title,
// 				y: 0.88,
// 			},
// 		};
		
// 		Plotly.newPlot(element, data as any, layout, PLOTLY_CONFIG);

// 		bindSearchToPlot(element);
// 	}
// }
