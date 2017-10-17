window.addEventListener('load', function() {
	if ($('.astb-screens-info').length > 0) {
		function getScrollbarWidth() {
	    var outer = document.createElement("div");
	    outer.style.visibility = "hidden";
	    outer.style.width = "100px";
	    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

	    document.body.appendChild(outer);

	    var widthNoScroll = outer.offsetWidth;
	    // force scrollbars
	    outer.style.overflow = "scroll";

	    // add innerdiv
	    var inner = document.createElement("div");
	    inner.style.width = "100%";
	    outer.appendChild(inner);        

	    var widthWithScroll = inner.offsetWidth;

	    // remove divs
	    outer.parentNode.removeChild(outer);

	    return widthNoScroll - widthWithScroll;
		}
		class InfoSlider {
			constructor({ infoSlider, infoBlocks }) {
				this.infoSlider = $(infoSlider);
				this.infoBlocks = this.infoSlider.find(infoBlocks);
				this.infoSliderOffset = this.infoSlider.offset().top;
				this.inSlider = false;
				this.scrollAmount = 0;
				this.activeBlock = 0;
				this.scrollBarWidth = getScrollbarWidth();
				this.catchYa();
				this.countScroll();
			}
			catchYa() {
				if ($(window).scrollTop() > this.infoSliderOffset) {
					this.belowSlider = true;
					this.activeBlock = this.infoBlocks.length - 1;
				}
				window.addEventListener('scroll', () => {
					if ($(window).scrollTop() > this.infoSliderOffset && !this.belowSlider) {
						this.lockScreen();
						this.inSlider = true;
					} else if ($(window).scrollTop() < this.infoSliderOffset && this.belowSlider) {
						this.lockScreen();
						this.inSlider = true;
					}
				});
			}
			lockScreen() {
				$('body').css({ 'height': '100%', 'overflow': 'hidden' });
				$(window).scrollTop(this.infoSliderOffset);
				this.infoSlider.css({ 'margin-right': `${this.scrollBarWidth}px` });
			}
			unlockScreen() {
				$('body').removeAttr('style');
				this.infoSlider.removeAttr('style');
			}
			countScroll() {
				let onMouseWheel = (e) => {
					if (this.inSlider && (e.wheelDelta > 0 || e.deltaY < 0)) {
						this.scrollAmount++;
						if (this.scrollAmount >= 5) {
							this.prev();
							this.scrollAmount = 0;
						}
					} else if (this.inSlider && (e.wheelDelta < 0 || e.deltaY > 0)) {
						this.scrollAmount--;
						if (this.scrollAmount <= -5) {
							this.next();
							this.scrollAmount = 0;
						}
					}
				};
				let onTouchStart = (e) => {
					// console.log(e);
					this.touchY = e.touches[0].clientY;
				};
				let onTouchEnd = (e) => {
					// console.dir(e);
					if (this.inSlider && this.touchY < e.changedTouches[0].clientY) {
						this.prev();
					} else if (this.inSlider) {
						this.next();
					}
				};
				window.addEventListener('wheel', onMouseWheel);
				window.addEventListener('touchstart', onTouchStart);
				window.addEventListener('touchend', onTouchEnd)
			}
			set activeBlock(val) {
				this.infoBlocks.removeClass('astm-active');
				this.infoBlocks.eq(val).addClass('astm-active');
			}
			get activeBlock() {
				for (let i = 0; i <= this.infoBlocks.length; i++) {
					if (this.infoBlocks.eq(i).hasClass('astm-active')) return i;
				}
			}
			prev() {
				if (this.activeBlock > 0) {
					this.activeBlock--;
				} else {
					this.unlockScreen();
					this.belowSlider = false;
					this.inSlider = false;
				}
			}
			next() {
				if (this.activeBlock < this.infoBlocks.length - 1) {
					this.activeBlock++;
				} else {
					this.unlockScreen();
					this.belowSlider = true;
					this.inSlider = false;
				}
			}
		}
		const infoSlider = new InfoSlider({
			infoSlider: '.aste-info-blocks',
			infoBlocks: '.aste-info-block'
		});
	}
});