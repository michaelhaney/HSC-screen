// TODO: https://getuikit.com/v2/docs/autocomplete.html

import { barPlot, treePlot, volcanoComparePlots, volcanoPlots } from './globals';

const searchInput = document.getElementById('geneSearch') as HTMLInputElement;

searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		e.preventDefault();
		const gene = searchInput.value;
		searchGene(gene, true, false);
	}
});

export function searchGene(_gene?: string, searchBar?: boolean, mouseClick?: boolean) {
	if (!_gene || _gene.trim() === '') {
		volcanoPlots.forEach(plot => plot.hideAnnotations());
		volcanoComparePlots.forEach(plot => plot.hideAnnotations());
		barPlot.hide();
		treePlot.hide();
		return;
	}
	const gene = _gene.toLowerCase().trim();

	if (searchBar) {
		// @ts-ignore
		gtag('event', 'geneSearch', {
			'gene': gene,
		});
	}
	if (mouseClick) {
		// @ts-ignore
		gtag('event', 'geneClick', {
			'gene': gene,
		});
	}

	const values = volcanoPlots.map(plot => plot.annotateGene(gene));
	volcanoComparePlots.forEach(plot => plot.annotateGene(gene));
	barPlot.update(values, _gene);
	treePlot.update(values, _gene);
}

export function bindSearchToPlot(element: HTMLDivElement) {
	// @ts-ignore
	element.on('plotly_click', (data: any) => {
		if (!data || !data.points || data.points.length === 0) return;
		const gene = data.points[0].text;
		searchGene(gene, false, true);
	});
}

