// https://github.com/plotly/plotly-webpack
// @ts-ignore
import * as Plotly from 'plotly.js/dist/plotly.min';
import { PLOTLY_CONFIG } from './constants';
import { initCard } from './templates/card';
import { getColorForValue } from './utils';

const $container = $('#extraPlots');
const P_VALUE_BAR_PLOT = 'pValueBarPlot';

export class PValueBarPlot {
	private readonly $card: JQuery<Node>;
	private readonly element: HTMLDivElement;

	constructor() {
		const card = initCard({
			id: `${P_VALUE_BAR_PLOT}`,
		});
		$container.append(card);

		this.$card = $(card);
		this.element = this.$card.find('.card-body')?.get(0) as HTMLDivElement;
		// this.hide();
	}

	update(values: {
		castleEffect?: number,
		castlePValue?: number,
		castlePValueLog10?: number,
		name: string,
	}[], gene: string) {
		const { element } = this;

		const x: string[] = [];
		const y: number[] = [];
		const color: string[] = [];
		const customdata: number[][] = [];
		values.forEach(value => {
			if (value.castlePValue === undefined || value.castlePValueLog10 === undefined || value.castleEffect === undefined) return;
			x.push(value.name.split(' ').pop()!);
			y.push(value.castlePValueLog10 * Math.sign(value.castleEffect));
			color.push(getColorForValue(Math.sign(value.castleEffect) * Math.abs(value.castlePValueLog10)));
			customdata.push([
				value.castlePValue, value.castleEffect,
			]);
		});

		const data = [
			{
				x,
				y,
				customdata,
				hovertemplate:`
Cell Type: <b>%{x}</b><br>
p-Value: <b>%{customdata[0]:.3f}</b><br>
Effect Score: <b>%{customdata[1]:.2f}</b>
<extra></extra>`,
				marker: {
					color,
				},
				type: 'bar'
			}
		];

		const layout = {
			xaxis: {
				title: 'Cell Type',
				fixedrange: true,
			},
			yaxis: {
				type: 'linear',
				autorange: true,
				title: 'signed -log<sub>10</sub>(p-Value)',
				fixedrange: true,
			},
			title: {
				text: `${gene} p-Values`,
				y: 0.88,
			},
		};
		
		Plotly.purge(element);
		Plotly.newPlot(element, data as any, layout, PLOTLY_CONFIG);
		this.$card.show();
	}

	hide() {
		this.$card.hide();
	}
}