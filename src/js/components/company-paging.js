import NavBobber from './bobber';

$(document).ready(() => {
	class PagingBobber extends NavBobber {
		setActiveNav(nav, page) {
			this.navItems.removeClass('astm-active');
			if (nav === false) {
				if (this.activeNav.length > 0) {
					let activeNavWidth = this.activeNav.outerWidth() - this.navItemPadding * 2;
					let activeNavLeft = +(this.activeNav.offset().left - this.navList.offset().left).toFixed(1) + this.navItemPadding;
					this.bobber.animate({ 'width': 0, 'left': activeNavLeft + activeNavWidth + this.navItemPadding }, 300);
				}
				delete this.activeNav;
				delete this.activePage;
				this.hasActiveNav = false;
				this.bobberActive = false;
				return;
			}
			this.activeNav = nav;
			this.activeNav.addClass('astm-active');
			this.activePage = page;
			let activeNavWidth = this.activeNav.outerWidth() - this.navItemPadding * 2;
			let activeNavLeft = +(this.activeNav.offset().left - this.navList.offset().left).toFixed(1) + this.navItemPadding;
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
		let pagingLinks = pagingNavbar.find('.aste-navlink');
		let pagesArray = [];
		let pages = $('.astb-company-paging .aste-company-page');
		let poppingState = false;
		for (let i = 0; i < pages.length; i++) {
			pagesArray.push({
				page: i,
				pageStart: pages.eq(i).offset().top,
				pageEnd: pages.eq(i).offset().top + pages.eq(i).outerHeight(),
				nav: pagingNavbar.find(`a[href="#page-${i + 1}"]`).parent('.aste-navitem')
			});
		}
		let definePage = () => {
			let scrollAmount = $(window).scrollTop();
			let inPages = false;
			for (let page of pagesArray) {
				if (scrollAmount > page.pageStart && scrollAmount <= page.pageEnd) {
					if (
						!companyPagingBobber.hasActiveNav ||
						companyPagingBobber.activePage !== page.page
					) {
						companyPagingBobber.setActiveNav(page.nav, page.page);
						pagingNavbar.addClass('astm-tied');
						history.pushState(`#page-${page.page + 1}`, document.title, `#page-${page.page + 1}`);
					}
					inPages = true;
				}
			}
			if (!inPages && companyPagingBobber.hasActiveNav) {
				companyPagingBobber.setActiveNav(false);
				pagingNavbar.removeClass('astm-tied');
				history.pushState("", document.title, window.location.pathname);
			}
		};
		let popState = () => {
			window.removeEventListener('scroll', definePage);
			poppingState = true;
			let pageHash = window.location.hash.match(/#page-(\d)/);
			if (pageHash !== null) {
				let page = pagesArray[(+pageHash[1] - 1)];
				companyPagingBobber.setActiveNav(page.nav, page.page);
				pagingNavbar.addClass('astm-tied');
				$('html, body').animate({
					scrollTop: page.pageStart + 2
				}, 300, () => {
					window.addEventListener('scroll', definePage);
				});
				// window.addEventListener('scroll', definePage);
			} else {
				companyPagingBobber.setActiveNav(false);
				pagingNavbar.removeClass('astm-tied');
				$('html, body').animate({
					scrollTop: 0
				}, 300, () => {
					window.addEventListener('scroll', definePage);
				});
				// window.addEventListener('scroll', definePage);
			}
		};
		window.addEventListener('scroll', definePage);
		window.addEventListener('popstate', popState);
		definePage();
		popState();
	}
});