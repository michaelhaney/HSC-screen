import { VolcanoPlot } from './VolcanoPlot';
import { VolcanoComparePlot } from './VolcanoComparePlot';
import { PValueBarPlot } from './PValueBarPlot';
import { PValueTreePlot } from './PValueTreePlot';

export const barPlot = new PValueBarPlot();
export const treePlot = new PValueTreePlot();
export const volcanoPlots: VolcanoPlot[] = [];
export const volcanoComparePlots: VolcanoComparePlot[] = [];

