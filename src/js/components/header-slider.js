import stretchAndCenter from '../utils/stretch-and-center';

window.addEventListener('load', () => {
	let stretchAndCenterHeaderSlider = () => stretchAndCenter($('.aste-slider-block'), 'img.aste-block-bg');
	stretchAndCenterHeaderSlider();
	window.addEventListener('resize', stretchAndCenterHeaderSlider);
});