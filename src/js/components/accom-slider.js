import stretchAndCenter from '../utils/stretch-and-center';

$(document).ready(() => {
	let accomSlider = $('.aste-accom-slider');
	if (accomSlider.length > 0) {
		accomSlider.slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			prevArrow: '<div class="aste-arrow astm-left"></div>',
			nextArrow: '<div class="aste-arrow astm-right"></div>',
			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 2
					}
				},
				{
					breakpoint: 576,
					settings: {
						slidesToShow: 1
					}
				}
			]
		});
		let stretchAndCenterHeaderSlider = () => stretchAndCenter($('.aste-slide-image-wrapper'), 'img.aste-slide-image');
		stretchAndCenterHeaderSlider();
		window.addEventListener('resize', stretchAndCenterHeaderSlider);
	}
});