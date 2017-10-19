$(document).ready(() => {
	$(document).click(function(e) {
		if (
			$('.navbar-collapse.collapse.show').length > 0 &&
			!$(e.target).is($('.aste-navbar-list'))
		) {
			$('.navbar-toggler').click();
		}
	});
});