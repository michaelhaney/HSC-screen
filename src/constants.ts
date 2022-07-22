const ANNOTATION_COLOR = '#0a0';
const ANNOTATION_LINE_THICKNESS = 2;

export const ANNOTATIONS_LAYOUT = {
	xref: 'x',
	yref: 'y',
	showarrow: true,
	arrowhead: 2,
	arrowsize: 1,
	arrowwidth: ANNOTATION_LINE_THICKNESS,
	arrowcolor: ANNOTATION_COLOR,
	// How far to offset the label.
	xshift: 2,
	yshift: -2,
	ax: 25,
	ay: 25,
	// Styling.
	borderpad: 3,
	bgcolor: "#fff",
	bordercolor: ANNOTATION_COLOR,
	borderwidth: ANNOTATION_LINE_THICKNESS,
	opacity:0.9,
};

export const HOVER_LAYOUT = {
	hoverlabel: {
		bgcolor: "#fff",
		borderwidth: 0,
		opacity: 0.9,
	},
}

export const PLOTLY_CONFIG = {
	modeBarButtonsToRemove: ['select2d', 'lasso2d', 'resetScale2d', 'zoom2d'],
	displaylogo: false,
	scrollZoom: false,
	toImageButtonOptions: {
		format: 'svg', // one of png, svg, jpeg, webp
		filename: 'custom_image',
		// height: 1000,
		// width: 1000,
		scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
	}
}

export const COLOR_CLIP_VALUE = 4;