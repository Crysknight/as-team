import $script from 'scriptjs';

const locations = [];

if ($('.astb-locations').length > 0) {
	$script('https://maps.googleapis.com/maps/api/js?key=AIzaSyCWgWiXe4fdVDjYj6-APt80DhtH2o05w8U&amp', function() {

		let chooseLocation = $.Event('CHOOSE_LOCATION');
		let unchooseLocation = $.Event('UNCHOOSE_LOCATION');

		$(document).on(chooseLocation.type, (e, param) => {
			locations[param - 1].listItem.addClass('astm-chosen');
			locations[param - 1].marker.div.addClass('astm-chosen');
		});

		$(document).on(unchooseLocation.type, (e, param) => {
			locations[param - 1].listItem.removeClass('astm-chosen');
			locations[param - 1].marker.div.removeClass('astm-chosen');
		});

		let map = new google.maps.Map(document.querySelector('.aste-locations-map'), {
			center: { lat: 55.755246, lng: 37.622088 },
			zoom: 11,
			disableDefaultUI: true
		});	

		let CustomMarker = function(latlng, map, args) {
			this.latlng = latlng;	
			this.args = args;	
			this.setMap(map);	
		}

		CustomMarker.prototype = new google.maps.OverlayView();

		CustomMarker.prototype.draw = function() {

			let panes = this.getPanes();
			let div = this.div;
			if (!div) {
				div = this.div = $(`<div class="aste-locations-marker">${this.args.number}</div>`).css({ "position": "absolute" });
				div.on('mouseover', (e) => { 
					e.stopPropagation();
					div.addClass('astm-hover');
				});
				div.on('mouseout', (e) => {
					e.stopPropagation();
					div.removeClass('astm-hover');
				});
				div.click((e) => {
					e.stopPropagation();
					if (!div.hasClass('astm-chosen')) {
						$(document).trigger(chooseLocation, this.args.number);
					} else {
						$(document).trigger(unchooseLocation, this.args.number);
					}
				})
				$(panes.overlayImage).append(div);
			}

			let point = this.getProjection().fromLatLngToDivPixel(this.latlng);
			if (point) {
				div.css({ "left": `${point.x - 15}px`, "top": `${point.y - 38}px` });
			}

		};

		CustomMarker.prototype.remove = function() {
			if (this.div) {
				this.div.parentNode.removeChild(this.div);
				this.div = null;
			}	
		};

		CustomMarker.prototype.getPosition = function() {
			return this.latlng;	
		};

		$.get('/as-team/locations', (resLocations) => {
			let locationsHtml = '';
			for (let location of resLocations) {
				locationsHtml += `
					<li class="aste-locations-item" data-number="${location.id}">
						<div class="astb-location">
							<div class="aste-location-number">${location.id + 1}</div>
							<div class="aste-location-title">${location.title}</div>
							<div class="aste-location-address">${location.address}</div>
							<div class="aste-location-additional">${location.additional}</div>
							<div class="aste-location-links">
								<div class="aste-location-link" href="#">Разместить рекламу здесь</div>
								<div class="aste-location-link" href="#">Фотографии ЖК</div>
							</div>
						</div>
					</li>		
				`;
				location.marker = new CustomMarker(new google.maps.LatLng(location.lat, location.lng), map, { number: location.id + 1 });
				locations.push(location);
			}
			$('.astb-locations ul.aste-locations-list').append(locationsHtml);
			for (let i = 0; i < $('.astb-location').length; i++) {
				let item = locations[i].listItem = $('.astb-location').eq(i);
				item.click(() => {
					if (!item.hasClass('astm-chosen')) {
						$(document).trigger(chooseLocation, i + 1);
					} else {
						$(document).trigger(unchooseLocation, i + 1);
					}
				});
			}

		});

	});
}