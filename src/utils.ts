import { Notyf } from 'notyf';
import { COLOR_CLIP_VALUE } from './constants';

export function getColorForValue(value: number) {
	let color = [255, 255, 255];
	if (!isNaN(value)) {
		let opacity = Math.abs(value) / COLOR_CLIP_VALUE;
		if (opacity > 1) opacity = 1;
		color = [10, 26, 169];
		if (Math.sign(value) > 0) {
			color = [176, 15, 34];
		}
		// Blend with white based on opacity.
		for (let i = 0; i < 3; i++) {
			const el = color[i];
			const diff = 255 - el;
			color[i] = el + (1 - opacity) * diff;
		}
	}
	return `rgb(${color.join(',')})`;
}

// Create an instance of Notyf
export const notyf = new Notyf({ position: { x: 'right', y: 'top' }, duration: 7000, dismissible: true });