import * as Papa from 'papaparse';

// Some constants from data table.
export const VOLCANO_GENE = 'Gene_ID';
export const VOLCANO_CASTLE_EFFECT = 'Castle_Effect';
export const VOLCANO_CASTLE_SCORE = 'Castle_Score';
export const VOLCANO_CASTLE_P_VALUE = 'P_value';
// export const VOLCANO_EXPRESSION_GENE = 'gene';

const loadedCSVs: { [key: string]: RowData[] } = {};

const P_VALUE_THRESHOLD = 0.05;

export interface RowData {
    [VOLCANO_GENE]: string;
    [VOLCANO_CASTLE_EFFECT]: number;
    [VOLCANO_CASTLE_SCORE]: number;
    [VOLCANO_CASTLE_P_VALUE]: number;
}

async function parseCSV(url: string) {
    return new Promise<RowData[]>((resolve) => {
        // @ts-ignore
        Papa.parse(url, {
            header: true,
            download: true,
            delimiter: ',',
            linebreak: '\n',
            skipEmptyLines: true,
            dynamicTyping: true,
            // worker: true,
            complete: (results) => {
                resolve(results.data as RowData[]);
            },
            error: (error) => {
                throw error;
            },
        });
    });
}

// export async function getVolcanoExpressionData(url: string, pName: string, effName: string) {
// 	const csv = loadedCSVs[url] ? loadedCSVs[url] : await parseCSV(url);
// 	loadedCSVs[url] = csv;
// 	const genes: string[] = [];
// 	const genesLowerCase: string[] = [];
// 	const castleEffects: number[] = [];
// 	const castlePValuesLog10: number[] = [];
// 	const castlePValues: number[] = [];
// 	// Calculate colors of data points by thresholding all p-values less than 0.05.
// 	const colors: number[] = [];
// 	for (let i = 0; i < csv.length; i++) {
// 		const datum = csv[i] as any as { [key: string]: string | number};
// 		let gene = datum[VOLCANO_EXPRESSION_GENE] as string;
// 		// Fix gene name so only the first letter is capitalized.
// 		gene = gene[0].toUpperCase() + gene.slice(1).toLowerCase();
// 		genes.push(gene);
// 		genesLowerCase.push(gene.toLowerCase());
// 		const effect = datum[effName] as number;
// 		castleEffects.push(effect);
// 		const pValue = datum[pName] as number;
// 		castlePValues.push(pValue);
// 		const log10PValue = -Math.log10(pValue);
// 		castlePValuesLog10.push(log10PValue);
// 		let color = 0;
// 		// if (pValue < P_VALUE_THRESHOLD) {
// 		// 	if (effect < 0) color = -1;
// 		// 	else color = 1;
// 		// }
// 		colors.push(color);
// 	}
// 	return {
// 		genes,
// 		genesLowerCase,
// 		castleEffects,
// 		castlePValues,
// 		castlePValuesLog10,
// 		colors,
// 	};
// }

export async function getVolcanoData(url: string) {
    const csv = await parseCSV(url);
    const genes: string[] = [];
    const genesLowerCase: string[] = [];
    const castleEffects: number[] = [];
    const castleScores: number[] = [];
    // const castlePValuesLog10: number[] = [];
    // const castlePValues: number[] = [];
    // Calculate colors of data points by thresholding all p-values less than 0.05.
    const colors: number[] = [];
    for (let i = 0; i < csv.length; i++) {
        const datum = csv[i];
        let gene = datum[VOLCANO_GENE];
        // Fix gene name so only the first letter is capitalized.
        gene = gene[0].toUpperCase() + gene.slice(1).toLowerCase();
        genes.push(gene);
        genesLowerCase.push(gene.toLowerCase());
        const effect = datum[VOLCANO_CASTLE_EFFECT];
        castleEffects.push(effect);
        const score = datum[VOLCANO_CASTLE_SCORE];
        castleScores.push(score);
        // const pValue = datum[VOLCANO_CASTLE_P_VALUE];
        // castlePValues.push(pValue);
        // const log10PValue = -Math.log10(pValue);
        // castlePValuesLog10.push(log10PValue);
        // let color = 0;
        // if (pValue < P_VALUE_THRESHOLD) {
        // 	if (effect < 0) color = -1;
        // 	else color = 1;
        // }
        // colors.push(color);
    }
    return {
        genes,
        genesLowerCase,
        castleEffects,
        castleScores,
        // castlePValues,
        // castlePValuesLog10,
        colors,
    };
}

export async function getVolcanoCompareData(url1: string, url2: string) {
    const csv1 = await parseCSV(url1);
    const csv2 = await parseCSV(url2);
    const genes: string[] = [];
    const genesLowerCase: string[] = [];
    const castleEffects1: number[] = [];
    const castleScores1: number[] = [];
    // const castlePValues1: number[] = [];
    // const castlePValues1Log10: number[] = [];
    const castleEffects2: number[] = [];
    const castleScores2: number[] = [];
    // const castlePValues2: number[] = [];
    // const castlePValues2Log10: number[] = [];
    const highlightedIndices: number[] = [];
    const partiallyHighlightedIndices: number[] = [];
    // Filter to common genes.
    const genes1Hash: { [key: string]: number } = {};
    for (let i = 0; i < csv1.length; i++) {
        const datum = csv1[i];
        let gene = datum[VOLCANO_GENE];
        // Fix gene name so only the first letter is capitalized.
        gene = gene[0].toUpperCase() + gene.slice(1).toLowerCase();
        genes1Hash[gene] = i;
    }
    const genes2Hash: { [key: string]: number } = {};
    for (let i = 0; i < csv2.length; i++) {
        const datum = csv2[i];
        let gene = datum[VOLCANO_GENE];
        // Fix gene name so only the first letter is capitalized.
        gene = gene[0].toUpperCase() + gene.slice(1).toLowerCase();
        genes2Hash[gene] = i;
        if (genes1Hash[gene] !== undefined) {
            genes.push(gene);
            genesLowerCase.push(gene.toLowerCase());
        }
    }
    for (let i = 0; i < genes.length; i++) {
        const gene = genes[i];
        const index1 = genes1Hash[gene];
        const index2 = genes2Hash[gene];
        const datum1 = csv1[index1];
        const datum2 = csv2[index2];
        const sign1 = Math.sign(datum1[VOLCANO_CASTLE_EFFECT]);
        const sign2 = Math.sign(datum2[VOLCANO_CASTLE_EFFECT]);
        castleEffects1.push(datum1[VOLCANO_CASTLE_EFFECT]);
        castleEffects2.push(datum2[VOLCANO_CASTLE_EFFECT]);
        castleScores1.push(sign1 * datum1[VOLCANO_CASTLE_SCORE]);
        castleScores2.push(sign2 * datum2[VOLCANO_CASTLE_SCORE]);
        // const pValue1 = datum1[VOLCANO_CASTLE_P_VALUE];
        // castlePValues1.push(pValue1);
        // const log10PValue1 = -Math.log10(pValue1);
        // castlePValues1Log10.push(log10PValue1 * sign1);
        // const pValue2 = datum2[VOLCANO_CASTLE_P_VALUE];
        // castlePValues2.push(pValue2);
        // const log10PValue2 = -Math.log10(pValue2);
        // castlePValues2Log10.push(log10PValue2 * sign2);
    }
    // Calculate colors of data points by thresholding all p-values less than 0.05.
    const log10threshold = -Math.log10(P_VALUE_THRESHOLD);
    const colors: number[] = [];
    // for (let i = 0; i < genes.length; i++) {
    // 	const gene = genes[i];
    // 	// const index1 = genes1Hash[gene];
    // 	// const index2 = genes2Hash[gene];
    // 	// const datum1 = csv1[index1];
    // 	// const datum2 = csv2[index2];
    // 	// const pValue1 = datum1[VOLCANO_CASTLE_P_VALUE];
    // 	// const effect1 = datum1[VOLCANO_CASTLE_EFFECT];
    // 	// const pValue2 = datum2[VOLCANO_CASTLE_P_VALUE];
    // 	// const effect2 = datum2[VOLCANO_CASTLE_EFFECT];
    // 	// const pThreshold1 = pValue1 < P_VALUE_THRESHOLD;
    // 	// const pThreshold2 = pValue2 < P_VALUE_THRESHOLD;
    // 	// let color = 0;
    // 	// if (pThreshold1) {
    // 	// 	if (effect1 < 0) color += -0.5;
    // 	// 	else color += 0.5;
    // 	// }
    // 	// if (pThreshold2) {
    // 	// 	if (effect2 < 0) color += -0.5;
    // 	// 	else color += 0.5;
    // 	// }
    // 	// colors.push(color);
    // 	// Check for genes with opposite signed effect scores.
    // 	// if ((pThreshold1 && pThreshold2 && color === 0)) {
    // 	// 	highlightedIndices.push(i);
    // 	// } else if (
    // 	// 	// (Math.sqrt(log10PValue1 * log10PValue1 + log10PValue2 * log10PValue2) > log10threshold && (Math.sign(effect1) === -Math.sign(effect2)))
    // 	// 	(pValue1 < 2 * P_VALUE_THRESHOLD && pValue2 < 2 * P_VALUE_THRESHOLD && (Math.sign(effect1) === -Math.sign(effect2)))
    // 	// ) {
    // 	// 	partiallyHighlightedIndices.push(i);
    // 	// }
    // }
    return {
        genes,
        genesLowerCase,
        castleEffects1,
        castleScores1,
        // castlePValues1,
        // castlePValues1Log10,
        castleEffects2,
        castleScores2,
        // castlePValues2,
        // castlePValues2Log10,
        colors,
        highlightedIndices,
        partiallyHighlightedIndices,
    };
}
