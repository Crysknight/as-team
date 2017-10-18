import stretchAndCenter from '../utils/stretch-and-center';

window.addEventListener('load', () => {
	if ($('.astb-screens-slider').length > 0) {
		const stretchAndCenterScreens = () => {
			stretchAndCenter($('.aste-frame'), '.aste-frame-texture');
			stretchAndCenter($('.aste-screen'), '.aste-screen-image');
		};
		class ScreensSlider {
			constructor({ screensSlider, screens }) {
				this.screensSlider = $(screensSlider);
				this.screensSelector = screens;
				this.screens = this.screensSlider.find(this.screensSelector);
				this.screensMargin = +this.screens.css('margin-left').replace(/px/, '');
				this.screenSpace = -(this.screens.outerWidth() + this.screensMargin);
				if (this.screens.length <= 8 && this.screens.length > 3) {
					for (let i = 0; i < this.screens.length; i++) {
						let fillerScreen = this.screens.eq(i).clone();
						this.screensSlider.append(fillerScreen);
					}
				} else if (this.screens.length <= 3) {
					for (let i = 0; i < this.screens.length * 3; i++) {
						let fillerScreen = this.screens.eq(i).clone();
						this.screensSlider.append(fillerScreen);
					}
				}
				this.steepIsThePath();
			}
			steepIsThePath() {
				this.screens.eq(0).animate({
					'margin-left': this.screenSpace
				}, 10000, 'linear', () => {
					let outtake = this.screens.eq(0);
					outtake.remove();
					this.screens = this.screensSlider.find(this.screensSelector);
					outtake.css({ 'margin-left': this.screensMargin });
					this.screensSlider.append(outtake);
					stretchAndCenterScreens();
					this.steepIsThePath();
				});
			}
		}
		stretchAndCenterScreens();
		const screensSlider = new ScreensSlider({
			screensSlider: '.astb-screens-slider .aste-slider-track',
			screens: '.aste-screen-wrapper'
		});
	}
});