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
		if ($('html.desktop').length > 0) {
			class InfoSlider {
				constructor({ infoSlider, infoBlocks }) {
					this.infoSlider = $(infoSlider);
					this.infoBlocks = this.infoSlider.find(infoBlocks);
					this.infoBlocks.css({
						'position': 'absolute',
						'top': 0,
						'left': 0,
						'z-index': 60,
						'opacity': 0
					});
					this.infoSliderOffset = this.infoSlider.offset().top;
					this.inSlider = false;
					this.scrollAmount = 0;
					this.activeBlock = 0;
					this.scrollBarWidth = getScrollbarWidth();
					this.catchYa();
					this.countScroll();
					window.addEventListener('resize', this.onWindowResize.bind(this));
				}
				catchYa() {
					if ($(window).scrollTop() > this.infoSliderOffset) {
						this.belowSlider = true;
						this.activeBlock = 'from below';
					}
					window.addEventListener('scroll', () => {
						if ($(window).scrollTop() > this.infoSliderOffset && !this.belowSlider) {
							if (this.screenLocked) {
								window.scrollTo(0, this.infoSliderOffset);
							} else {
								this.screenLocked = true;
								this.lockScreen();
								this.inSlider = true;
							}
						} else if ($(window).scrollTop() < this.infoSliderOffset && this.belowSlider) {
							this.screenLocked = true;
							this.lockScreen();
							this.inSlider = true;
						}
					});
				}
				lockScreen() {
					$('html').css({ 'height': '100%', 'overflow': 'hidden' });
					$(window).scrollTop(this.infoSliderOffset);
					this.infoSlider.css({ 'margin-right': `${this.scrollBarWidth}px` });
				}
				unlockScreen() {
					$('html').removeAttr('style');
					this.infoSlider.removeAttr('style');
					this.screenLocked = false;
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
					if (!this.onCooldown) {
						this.infoBlocks.removeClass('astm-active');
						this.infoBlocks.eq(val).addClass('astm-active');
						this.onCooldown = true;
						this.cooldown = setTimeout(() => {
							this.onCooldown = false;
						}, 400);
					}
					if (val === 'from below') {
						this.infoBlocks.removeClass('astm-active');
						this.infoBlocks.eq(this.infoBlocks.length - 1).addClass('astm-active');
					}
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
				onWindowResize() {
					this.infoSliderOffset = this.infoSlider.offset().top;
				}
			}
			const infoSlider = new InfoSlider({
				infoSlider: '.aste-info-blocks',
				infoBlocks: '.aste-info-block'
			});
		}
	}
});