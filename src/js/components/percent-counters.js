import isVisible from '../utils/is-visible';

$(document).ready(() => {
	let animateNumbers = (el, max, unit) => {
		let current = 0;
		let interval = setInterval(() => {
			el.text(current + unit);
			current++;
			if (current > max) clearInterval(interval);
		}, 10);
	};
	let percentages = $('.aste-percentages');
	let numbers = percentages.find('.aste-number');
	let percValues = [];
	for (let i = 0; i < numbers.length; i++) {
		percValues.push(+numbers.eq(i).text().replace('%', ''));
	}
	percentages.find('.aste-number').text('0%');
	isVisible($('.aste-percentages'), () => {
		for (let i = 0; i < numbers.length; i++) {
			animateNumbers(numbers.eq(i), percValues[i], '%');
		}
	});
});