const stretchAndCenter = (containers, innerSelector, video) => {
	containers.each(function() {
		let container = $(this);
		let containerRatio = container.outerWidth() / container.outerHeight();
		let inner = container.find(innerSelector);
		let innerRatio = video ? 
			inner.get(0).videoWidth / inner.get(0).videoHeight : 
			inner.width() / inner.height();

		// console.log(inner.attr('src'));
		// console.log('width: ', inner.width());
		// console.log('height: ', inner.height());
		// console.log('containerRatio: ', containerRatio);
		// console.log('innerRatio: ', innerRatio);
		// console.log(containerRatio > innerRatio);
		// console.log('\n');

		if (containerRatio > innerRatio) {
			inner.removeAttr('style');
			inner.width(container.outerWidth());
			let topOffset = -((inner.height() - container.outerHeight()) / 2);
			inner.css({ "margin-top": topOffset + "px" });
		} else if (containerRatio < innerRatio) {
			inner.removeAttr('style');
			inner.height(container.outerHeight());
			let leftOffset = -((inner.width() - container.outerWidth()) / 2);
			inner.css({ "margin-left": leftOffset + "px" });
		} else {
			inner.removeAttr('style');
			inner.width(container.outerWidth());
		}
	});
};

export default stretchAndCenter;