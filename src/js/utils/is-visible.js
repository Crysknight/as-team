const isVisible = (el, callback, handicap = 100) => {
	let offsetTop = el.offset().top;
	let callbackApplied = false;
	let spotVisibility = () => {
		let isElVisible = ($(window).scrollTop() + $(window).height() - handicap) > offsetTop;
		if (isElVisible && !callbackApplied) {
			callbackApplied = true;
			callback();
			window.removeEventListener('scroll', spotVisibility);
		}
	};
	window.addEventListener('scroll', spotVisibility);
	spotVisibility();
};

export default isVisible;