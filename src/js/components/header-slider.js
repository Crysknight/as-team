import stretchAndCenter from '../utils/stretch-and-center';

window.addEventListener('load', () => {
	if ($('.astb-header-slider').length > 0) {
		class HeaderSlider {
			constructor({
				sliderSelector,
				slideSelector,
				leftArrow,
				rightArrow
			}) {
				this.slider = $(sliderSelector);
				this.slide = this.slider.find(slideSelector);
				this.leftArrow = this.slider.find(leftArrow);
				this.rightArrow = this.slider.find(rightArrow);
				this.activeElement = 0;
				this.leftArrow.click(this.prev.bind(this));
				this.rightArrow.click(this.next.bind(this));
				this.leftArrow.addClass('astm-inactive');
				this.expandArrows();
				window.addEventListener('resize', this.expandArrows.bind(this));
			}
			set activeElement(val) {
				this.slide.removeClass('astm-active');
				this.slide.eq(val).addClass('astm-active');
			}
			get activeElement() {
				for (let i = 0; i <= this.slide.length; i++) {
					if (this.slide.eq(i).hasClass('astm-active')) return i;
				}
			}
			prev() {
				this.rightArrow.removeClass('astm-inactive');
				if (this.activeElement > 0) {
					this.activeElement--;
					if (this.activeElement === 0) {
						this.leftArrow.addClass('astm-inactive');
					}
				}
			}
			next() {
				this.leftArrow.removeClass('astm-inactive');
				if (this.activeElement < this.slide.length - 1) {
					this.activeElement++;
					if (this.activeElement === this.slide.length - 1) {
						this.rightArrow.addClass('astm-inactive');
					}
				}
			}
			expandArrows() {
				let space = this.leftArrow.next('.aste-container-sized-delimiter').offset().left;
				this.leftArrow.width(space + 130).css({
					'background-position': `${space + 15}px center`
				});
				this.rightArrow.width(space + 130).css({
					'background-position': `${100}px center`
				});
			}
		}
		let stretchAndCenterHeaderSlider = () => stretchAndCenter($('.aste-slider-block'), 'img.aste-block-bg');
		stretchAndCenterHeaderSlider();
		window.addEventListener('resize', stretchAndCenterHeaderSlider);
		const headerSlider = new HeaderSlider({ 
			sliderSelector: '.astb-header-slider', 
			slideSelector: '.aste-slider-block',
			leftArrow: '.aste-arrow.astm-left',
			rightArrow: '.aste-arrow.astm-right'
		});
	}
});