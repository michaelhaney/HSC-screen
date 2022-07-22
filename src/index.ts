import 'jquery';
import './search';
import { volcanoComparePlots, volcanoPlots } from './globals';
import { VolcanoPlot } from './VolcanoPlot';
import { VolcanoComparePlot } from './VolcanoComparePlot';

// Append current version.
// $('#version').append(`Version ${require('../package.json').version}`);

// Load data.
const HSPC_vs_Tcell = '../data/Volcano_combined_HSPCvTcells_01_12_22.csv';
const HSPC_vs_Bcell = '../data/Volcano_combined_HSPCvBcells_01_12_22.csv';
const HSPC_vs_Myeloid = '../data/Volcano_combined_HSPCvMyeloid_01_12_22.csv';
const HSPC_vs_Erythroid = '../data/Volcano_combined_HSPCvErythroid_01_12_22.csv';
const HSPC_vs_Lymphoid = '../data/ACOC_DTKP_GE_LymphoidvHSPC_1.csv';
const HSPC_vs_AllMyeloid = '../data/ACOC_DTKP_GE_allMyloidvHSPC_1.csv';
import { searchGene } from './search';

volcanoPlots.push(new VolcanoPlot({ url: HSPC_vs_Bcell, title: 'HSPC vs Bcell' }));
volcanoPlots.push(new VolcanoPlot({ url: HSPC_vs_Tcell, title: 'HSPC vs Tcell' }));
volcanoPlots.push(new VolcanoPlot({ url: HSPC_vs_Myeloid, title: 'HSPC vs Myeloid' }));
volcanoPlots.push(new VolcanoPlot({ url: HSPC_vs_Erythroid, title: 'HSPC vs Erythroid' }));

volcanoComparePlots.push(new VolcanoComparePlot({
	url1: HSPC_vs_Bcell, title1: 'Bcell',
	url2: HSPC_vs_Tcell, title2: 'Tcell',
}));
volcanoComparePlots.push(new VolcanoComparePlot({
	url1: HSPC_vs_Myeloid, title1: 'Myeloid',
	url2: HSPC_vs_Erythroid, title2: 'Erythroid',
}));
volcanoComparePlots.push(new VolcanoComparePlot({
	url1: HSPC_vs_AllMyeloid, title1: 'Myeloid',
	url2: HSPC_vs_Lymphoid, title2: 'Lymphoid',
}));


const promises: Promise<void>[] = [];
volcanoPlots.forEach(plot => promises.push(plot.initPromise));
volcanoComparePlots.forEach(plot => promises.push(plot.initPromise));

async function initialSearch() {
	await Promise.all(promises);
	searchGene('Runx1', false, false);
}
initialSearch();

