import NavBobber from './bobber';

$(document).ready(() => {
	class PagingBobber extends NavBobber {
		setActiveNav(nav, page) {
			this.navItems.removeClass('.astm-active');
			if (nav === false) {
				let activeNavWidth = this.activeNav.outerWidth() - 40;
				let activeNavLeft = +(this.activeNav.offset().left - this.navList.offset().left).toFixed(1) + 20;
				this.bobber.animate({ 'width': 0, 'left': activeNavLeft + activeNavWidth + 20 }, 300);
				delete this.activeNav;
				delete this.activePage;
				this.hasActiveNav = false;
				this.bobberActive = false;
				return;
			}
			this.activeNav = nav;
			this.activeNav.addClass('.astm-active');
			this.activePage = page;
			let activeNavWidth = this.activeNav.outerWidth() - 40;
			let activeNavLeft = +(this.activeNav.offset().left - this.navList.offset().left).toFixed(1) + 20;
			if (this.hasActiveNav === true) {
				this.bobber.animate({
					'left': activeNavLeft,
					'width': activeNavWidth
				});
			} else {
				this.bobber.css({
					'left': activeNavLeft,
					'width': activeNavWidth
				});
			}
			this.hasActiveNav = true;
			this.bobberActive = true;
		}
	}
	if ($('.astb-company-paging').length > 0) {
		const companyPagingBobber = new PagingBobber('.astb-company-paging .aste-navbar-list', '.aste-navitem', '.astm-active');
		let pagingNavbar = $('.astb-company-paging .aste-paging-navbar');
		let pagesArray = [];
		let pages = $('.astb-company-paging .aste-company-page');
		for (let i = 0; i < pages.length; i++) {
			pagesArray.push({
				page: i,
				pageStart: pages.eq(i).offset().top,
				pageEnd: pages.eq(i).offset().top + pages.eq(i).outerHeight(),
				nav: pagingNavbar.find(`a[href="#page-${i + 1}"]`).parent('.aste-navitem')
			});
		}
		window.addEventListener('scroll', () => {
			let scrollAmount = $(window).scrollTop();
			let inPages = false;
			for (let page of pagesArray) {
				if (scrollAmount > page.pageStart && scrollAmount <= page.pageEnd) {
					if (!companyPagingBobber.hasActiveNav || companyPagingBobber.activePage !== page.page) {
						companyPagingBobber.setActiveNav(page.nav, page.page);
						pagingNavbar.addClass('astm-tied');
					}
					inPages = true;
				}
			}
			if (!inPages && companyPagingBobber.hasActiveNav) {
				companyPagingBobber.setActiveNav(false);
				pagingNavbar.removeClass('astm-tied')
			}
		});
	}
});