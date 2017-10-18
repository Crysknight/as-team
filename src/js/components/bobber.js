class NavBobber {
	constructor(navList, navItems, activeMod) {
		this.navList = $(navList);
		this.navItemsSelector = navItems;
		this.navItems = this.navList.find(navItems);
		this.activeNav = this.navList.find(activeMod);
		this.hasActiveNav = this.activeNav.length > 0 ? true : false;
		this.bobber = $('<li class="aste-nav-bobber"></li>');
		this.bobberActive = false;
		this.navList.prepend(this.bobber);
		this.navItems.on('mouseover', this.mouseOver.bind(this));
		this.navItems.on('mouseout', this.mouseOut.bind(this));
		if (this.hasActiveNav) {
			this.activeNavWidth = this.activeNav.outerWidth() - 40;
			this.activeNavLeft = +(this.activeNav.offset().left - this.navList.offset().left).toFixed(1) + 20;
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
		let targetLinkWidth = targetLink.outerWidth() - 40;
		let targetLinkLeft = +(targetLink.offset().left - this.navList.offset().left).toFixed(1) + 20;
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
		let targetLinkWidth = targetLink.outerWidth() - 40;
		let targetLinkLeft = +(targetLink.offset().left - this.navList.offset().left).toFixed(1) + 20;
		this.mouseOutTimeout = setTimeout(() => {
			if (this.hasActiveNav) {
				this.bobber.animate({
					'left': this.activeNavLeft,
					'width': this.activeNavWidth
				}, 300);
			} else {
				this.bobber.animate({ 'width': 0, 'left': targetLinkLeft + targetLinkWidth + 20 }, 300);
				this.bobberActive = false;
			}
		}, 300);
	}
}

$(document).ready(() => {
	if ($('html.mobile, html.tablet').length === 0) {
		const navBobber = new NavBobber('.astb-navbar .aste-navbar-list', '.aste-navitem', '.astm-active');
	}
});

export default NavBobber;