import $script from 'scriptjs';

$(document).ready(() => {
	if ($('.astb-contacts').length > 0) {
		$script('https://maps.googleapis.com/maps/api/js?key=AIzaSyCWgWiXe4fdVDjYj6-APt80DhtH2o05w8U&amp', function() {

			let mapEl = $('.aste-map');
			let lat = +mapEl.attr('data-lat');
			let lng = +mapEl.attr('data-lng');

			let contactsMap = new google.maps.Map(document.querySelector('.aste-map'), {
				center: { lat, lng },
				zoom: 14,
				disableDefaultUI: true
			});

      let marker = new google.maps.Marker({
        position: { lat: 55.811600, lng: 37.456668 },
        map: contactsMap
      });

		});
	}
});