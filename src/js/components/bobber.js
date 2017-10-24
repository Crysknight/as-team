class NavBobber {
	constructor(navList, navItems, activeMod, ) {
		this.navList = $(navList);
		this.navItemsSelector = navItems;
		this.navItems = this.navList.find(navItems);
		this.activeNav = this.navList.find(activeMod);
		this.hasActiveNav = this.activeNav.length > 0 ? true : false;
		this.bobber = $('<li class="aste-nav-bobber"></li>');
		this.bobberActive = false;
		this.navList.prepend(this.bobber);
		this.navItemPadding = +this.navItems.find('a').css('padding-left').replace(/px/, '');
		this.navItems.on('mouseover', this.mouseOver.bind(this));
		this.navItems.on('mouseout', this.mouseOut.bind(this));
		if (this.hasActiveNav) {
			this.activeNavWidth = this.activeNav.outerWidth() - this.navItemPadding * 2;
			this.activeNavLeft = +(this.activeNav.offset().left - this.navList.offset().left).toFixed(1) + this.navItemPadding;
			this.bobber.css({
				'left': this.activeNavLeft,
				'width': this.activeNavWidth
			});
			this.bobberActive = true;
		}
	}
	mouseOver(e) {
		clearTimeout(this.mouseOutTimeout);
		this.bobber.stop();
		let target = $(e.target);
		let targetLink = target.hasClass(this.navItemsSelector.replace(/\./, '')) ?
			target.find('a') :
			target;
		let targetLinkWidth = targetLink.outerWidth() - this.navItemPadding * 2;
		let targetLinkLeft = +(targetLink.offset().left - this.navList.offset().left).toFixed(1) + this.navItemPadding;
		if (this.bobberActive) {
			this.bobber.animate({
				'left': targetLinkLeft,
				'width': targetLinkWidth
			}, 300);
		} else {
			this.bobber.css({ 'left': `${targetLinkLeft}px` }).animate({
				'width': targetLinkWidth,
			}, 300);
			this.bobberActive = true;
		}
	}
	mouseOut(e) {
		let target = $(e.target);
		let targetLink = target.hasClass(this.navItemsSelector.replace(/\./, '')) ?
			target.find('a') :
			target;
		let targetLinkWidth = targetLink.outerWidth() - this.navItemPadding * 2;
		let targetLinkLeft = +(targetLink.offset().left - this.navList.offset().left).toFixed(1) + this.navItemPadding;
		this.mouseOutTimeout = setTimeout(() => {
			if (this.hasActiveNav) {
				let activeNavWidth = this.activeNav.outerWidth() - this.navItemPadding * 2;
				let activeNavLeft = +(this.activeNav.offset().left - this.navList.offset().left).toFixed(1) + this.navItemPadding;
				this.bobber.animate({
					'left': activeNavLeft,
					'width': activeNavWidth
				}, 300);
			} else {
				this.bobber.animate({ 'width': 0, 'left': targetLinkLeft + targetLinkWidth + this.navItemPadding }, 300);
				this.bobberActive = false;
			}
		}, 300);
	}
}

$(document).ready(() => {
	if ($('html.mobile, html.tablet').length === 0 && $('.astb-navbar').length > 0) {
		const navBobber = new NavBobber('.astb-navbar .aste-navbar-list', '.aste-navitem', '.astm-active');
	}
});

export default NavBobber;