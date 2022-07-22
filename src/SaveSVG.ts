export function saveSVG(svg: SVGElement, filename: string) {
	// Get svg source.
	const serializer = new XMLSerializer();
	let source = serializer.serializeToString(svg);

	// The linear gradient definition gets stripped out, put it back in.
	source = source.replace('<style type="text/css"> ', '<style type="text/css"> #scaleBar{fill: url(#gradient1);} ');

	// Add name spaces.
	if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
		source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	}
	if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
		source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
	}

	// Add xml declaration
	source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

	// Convert svg source to URI data scheme.
	const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
	
	const downloadLink = document.createElement('a');
	downloadLink.className = 'hidden';
	// Set url value to a element's href attribute.
	downloadLink.href = url;
	downloadLink.download = `${filename}.svg`;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}