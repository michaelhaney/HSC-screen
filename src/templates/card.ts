type CardOptions = {
	id?: string,
	classes?: string,
}

const cardHTML = (options: CardOptions) => 
	`<div ${options.id ? `id="${options.id}"` : ''} class="card uk-box-shadow-medium${options.classes ? ' ' + options.classes : ''}">
		<div class="card-body">
			<div class="card-spinner" uk-spinner="ratio: 4"></div>
		</div>
	</div>`;

export function initCard(options: CardOptions) {
	const html = $.parseHTML(cardHTML(options))[0];
	return html;
}