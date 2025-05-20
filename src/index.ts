import 'jquery';
import './search';
import { volcanoPlotsCompare, volcanoPlots, volcanoPlotsExpression } from './globals';
import { VolcanoPlot } from './VolcanoPlot';
import { VolcanoPlotCompare } from './VolcanoPlotCompare';
import { searchGene } from './search';
import { VolcanoPlotExpression } from './VolcanoPlotExpression';

// Append current version.
// $('#version').append(`Version ${require('../package.json').version}`);

// Load data.
const HSPC_vs_Tcell = './data/GW_HSPC_vs_Tcell.csv';
const HSPC_vs_Bcell = './data/GW_HSPC_vs_Bcell.csv';
const HSPC_vs_Myeloid = './data/GW_HSPC_vs_Myeloid.csv';
const HSPC_vs_Erythroid = './data/GW_HSPC_vs_Erythroid.csv';
// const HSPC_vs_Lymphoid = './data/ACOC_DTKP_GE_LymphoidvHSPC_1.csv';
// const HSPC_vs_AllMyeloid = './data/ACOC_DTKP_GE_allMyloidvHSPC_1.csv';
// const Expression_Data = './data/HSPCvTells_age_acc_rej.csv';

volcanoPlots.push(new VolcanoPlot({ url: HSPC_vs_Bcell, title: 'HSPC vs Bcell' }));
volcanoPlots.push(new VolcanoPlot({ url: HSPC_vs_Tcell, title: 'HSPC vs Tcell' }));
volcanoPlots.push(new VolcanoPlot({ url: HSPC_vs_Myeloid, title: 'HSPC vs Myeloid' }));
volcanoPlots.push(new VolcanoPlot({ url: HSPC_vs_Erythroid, title: 'HSPC vs Erythroid' }));

volcanoPlotsCompare.push(new VolcanoPlotCompare({
	url1: HSPC_vs_Bcell, title1: 'Bcell',
	url2: HSPC_vs_Tcell, title2: 'Tcell',
}));
volcanoPlotsCompare.push(new VolcanoPlotCompare({
	url1: HSPC_vs_Myeloid, title1: 'Myeloid',
	url2: HSPC_vs_Erythroid, title2: 'Erythroid',
}));
// volcanoPlotsCompare.push(new VolcanoPlotCompare({
// 	url1: HSPC_vs_AllMyeloid, title1: 'Myeloid',
// 	url2: HSPC_vs_Lymphoid, title2: 'Lymphoid',
// }));

// volcanoPlotsExpression.push(new VolcanoPlotExpression({ 
// 	url: Expression_Data,
// 	title: 'Gene Expression Aged',
// 	pName: 'p_age',
// 	effName: 'eff_age',
// }));
// volcanoPlotsExpression.push(new VolcanoPlotExpression({ 
// 	url: Expression_Data,
// 	title: 'Gene Expression Acc',
// 	pName: 'p_acc',
// 	effName: 'eff_acc',
// }));
// volcanoPlotsExpression.push(new VolcanoPlotExpression({ 
// 	url: Expression_Data,
// 	title: 'Gene Expression Rej',
// 	pName: 'p_rej',
// 	effName: 'eff_rej',
// }));

const promises: Promise<void>[] = [];
volcanoPlots.forEach(plot => promises.push(plot.initPromise));
volcanoPlotsCompare.forEach(plot => promises.push(plot.initPromise));
volcanoPlotsExpression.forEach(plot => promises.push(plot.initPromise));

async function initialSearch() {
	await Promise.all(promises);
	searchGene('Runx1', false, false);
}
initialSearch();

