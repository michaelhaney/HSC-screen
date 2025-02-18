import { saveSVG } from './SaveSVG';
import { initCard } from './templates/card';
import { getColorForValue, notyf } from './utils';
let svg = require('./templates/tree_plot.svg');

// Add gradient to svg.
const gradientDefs = `<defs><linearGradient id="gradient1" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="16.667%" style="stop-color:rgb(255,255,255);stop-opacity:1"></stop>
<stop offset="50%" style="stop-color:rgb(255,255,255);stop-opacity:0"></stop>
<stop offset="83.333%" style="stop-color:rgb(255,255,255);stop-opacity:1"></stop>
</linearGradient></defs>`;

svg = svg.replace(/>\s*</, `>\n${gradientDefs}\n<`);

const $container = $('#extraPlots');
const P_VALUE_TREE_PLOT = 'pValueTreePlot';

export class PValueTreePlot {
	private readonly $card: JQuery<Node>;
	private readonly element: HTMLDivElement;

	constructor() {
		const card = initCard({
			id: `${P_VALUE_TREE_PLOT}`,
		});
		$container.append(card);

		this.$card = $(card);
		this.element = this.$card.find('.card-body')?.get(0) as HTMLDivElement;
		this.element.innerHTML = svg;
		const toolbar = document.createElement('div');
		this.element.id = 'TreePlotContainer';
		this.element.classList.add('js-plotly-plot');
		toolbar.id = 'svgTreeToolbar';
		toolbar.classList.add('plotly');
		toolbar.innerHTML = '<div id="modebar-container" class="modebar-container" style="position: absolute; top: 0px; right: 0px; width: 100%;"><div id="modebar-4377cb" class="modebar modebar--hover ease-bg"><div class="modebar-group watermark"><a rel="tooltip" id="downloadTreePlotSVG" class="modebar-btn" data-title="Download plot" data-toggle="false" data-gravity="n"><svg viewBox="0 0 1000 1000" class="icon" height="1em" width="1em"><path d="m500 450c-83 0-150-67-150-150 0-83 67-150 150-150 83 0 150 67 150 150 0 83-67 150-150 150z m400 150h-120c-16 0-34 13-39 29l-31 93c-6 15-23 28-40 28h-340c-16 0-34-13-39-28l-31-94c-6-15-23-28-40-28h-120c-55 0-100-45-100-100v-450c0-55 45-100 100-100h800c55 0 100 45 100 100v450c0 55-45 100-100 100z m-400-550c-138 0-250 112-250 250 0 138 112 250 250 250 138 0 250-112 250-250 0-138-112-250-250-250z m365 380c-19 0-35 16-35 35 0 19 16 35 35 35 19 0 35-16 35-35 0-19-16-35-35-35z" transform="matrix(1 0 0 -1 0 850)"></path></svg></a></div><div class="modebar-group"></div></div></div>';
		this.element.append(toolbar);

		// this.hide();
	}

	update(values: {
		castleEffect?: number,
		castlePValue?: number,
		castlePValueLog10?: number,
		name: string,
	}[], gene: string) {
		const { element } = this;
		const $element = $(element);
		const self = this;

		$('#svgTreeToolbar').find('#downloadTreePlotSVG').off("click").on('click', () => {
			saveSVG($container.find('#treePlot').get(0) as unknown as SVGElement, `${gene.toUpperCase()}-TreePlot`);
		});

		const data: { [key: string]: number } = {};

		let minVal = Infinity;
		let maxVal = -Infinity;

		values.forEach(value => {
			if (value.castleEffect === undefined || value.castlePValueLog10 === undefined) return;
			const cellName = value.name.split(' ')[2] as string;
			data[cellName] = Math.abs(value.castlePValueLog10) * Math.sign(value.castleEffect);
			// data[cellName] = value.castlePValueLog10;
			// data[cellName] = value.castleEffect;
		});

		// Reset state.
		$element.find(`#Bcell`).css({ fill: 'white' });
		$element.find(`#Tcell`).css({ fill: 'white' });
		$element.find(`#Myeloid`).css({ fill: 'white' });
		$element.find(`ellipse`).css({ fill: 'white' });

		// Throw a warning if there is no match.
		// Display an error notification
		if (Object.keys(data).length === 0) {
			notyf.error({
				message: `"${gene}" is not included in the current screens.<br/><br/>Please check back later, we will update our screening dataset as we complete future screens.`,
				icon: false,
			});
		}
		
		Object.keys(data).forEach(cellName => {
			const value = data[cellName];
			if (value < minVal) minVal = value;
			if (value > maxVal) maxVal = value;
			$element.find(`#${cellName}`).css({ fill: getColorForValue(value) });
			$element.find(`#${cellName}1`).css({ fill: getColorForValue(value) });
			$element.find(`#${cellName}2`).css({ fill: getColorForValue(value) });
			$element.find(`#${cellName}3`).css({ fill: getColorForValue(value) });
		});

		// Add data for progenitors.
		const clpValue = ((data.Tcell || 0) + (data.Bcell || 0)) / 2;
		if (clpValue < minVal) minVal = clpValue;
		if (clpValue > maxVal) maxVal = clpValue;
		$element.find(`#CLP`).css({ fill: getColorForValue(clpValue) });
		const cmpValue = ((data.Erythroid || 0) + (data.Myeloid || 0)) / 2;
		if (cmpValue < minVal) minVal = cmpValue;
		if (cmpValue > maxVal) maxVal = cmpValue;
		$element.find(`#CMP`).css({ fill: getColorForValue(cmpValue) });
		const hscValue = -((data.Tcell || 0) + (data.Bcell || 0) + (data.Erythroid || 0) + (data.Myeloid || 0)) / 4;
		if (hscValue < minVal) minVal = hscValue;
		if (hscValue > maxVal) maxVal = hscValue;
		$element.find(`#HSC`).css({ fill: getColorForValue(hscValue) });
		// console.log('HSCvalue', data, hscValue);

		$element.find('#treePlotTitle').html(`${gene} Tree Plot`);

		const minColor = getColorForValue(minVal);
		const maxColor = getColorForValue(maxVal);
		const offset = Math.abs(minVal) / (maxVal - minVal) * 100;
		// Apply to scalebar.
		const gradient = document.getElementById('gradient1')!;
		(gradient.children[0] as SVGStopElement).style.setProperty('stop-color', getColorForValue(6));
		// (gradient.children[1] as SVGStopElement).setAttribute('offset', `${offset.toFixed(2)}%`);
		(gradient.children[2] as SVGStopElement).style.setProperty('stop-color', getColorForValue(-6));

		this.$card.show();
	}

	hide() {
		this.$card.hide();
	}
}