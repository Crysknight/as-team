import $script from 'scriptjs';

import stretchAndCenter from '../utils/stretch-and-center';

const locations = [];
			
let chooseLocation = $.Event('CHOOSE_LOCATION');
let unchooseLocation = $.Event('UNCHOOSE_LOCATION');

$(document).ready(() => {
	if ($('.astb-locations').length > 0) {
		$script('https://maps.googleapis.com/maps/api/js?key=AIzaSyCWgWiXe4fdVDjYj6-APt80DhtH2o05w8U&amp', function() {

			let map = new google.maps.Map(document.querySelector('.aste-locations-map'), {
				center: { lat: 55.755246, lng: 37.622088 },
				zoom: 10,
				disableDefaultUI: true
			});

			let CustomMarker = function(latlng, map, args) {
				this.latlng = latlng;	
				this.args = args;	
				this.setMap(map);	
			};

			CustomMarker.prototype = new google.maps.OverlayView();

			CustomMarker.prototype.draw = function() {

				let panes = this.getPanes();
				let div = this.div;
				if (!div) {
					div = this.div = $(`
						<div class="astb-map-marker">
							<div class="aste-marker-flag">
								${this.args.number}
							</div>
							<div class="aste-marker-point"></div>
						</div>
					`).css({ "position": "absolute" });
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
					div.css({ "left": `${point.x - 15}px`, "top": `${point.y - 15}px` });
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

			let locationsListWrapper = $('.astb-locations .aste-locations-list-wrapper');

			let locationsList = $('.astb-locations ul.aste-locations-list');

			let loader = $(`
				<div class="astb-loader">
					<div class="aste-loader-circle">
						<div class="aste-loader-inner-circle"></div>
						<div class="aste-loader-square-wrapper">
							<div class="aste-loader-square">
						</div>
					</div>
				</div>
			`);

			let submitLocations = $('.aste-locations-submit');

			let submitForm = () => {
				return $(`
					<form class="astb-form astm-locations">
						<div class="aste-form-title">Заказать размещение</div>
						<div class="aste-form-close">&plus;</div>
						<input name="name" class="aste-form-name">
						<input name="phone" class="aste-form-phone">
						<div class="aste-form-locations">
							${locations.filter((location) => location.chosen).map((location) => {
								return `
									<div class="aste-form-location">
										<div class="aste-location-title">
											${location.title}
										</div>
										<div class="aste-location-delete">&plus;</div>
									</div>
								`;
							}).join('')}
							<div class="aste-location-add">&plus;</div>
						</div>
					</form>
				`);
			};

			let popup = $('.astb-popup');
			popup.click(function(e) {
				if ($(e.target).is('.astb-popup')) {
					popup
						.removeClass('astm-show astm-form')
						.removeAttr('style')
						.find('.aste-popup-inner').empty();
				}
			});

			let subpopup = popup.find('.aste-subpopup');

			let gotLocations = (resLocations) => {
				let locationsHtml = '';
				let locationNumber = 1;
				for (let location of resLocations) {
					location.number = locationNumber;
					locationNumber++;
					locationsHtml += `
						<li class="aste-locations-item">
							<div class="astb-location">
								<div class="aste-location-number">${location.number}</div>
								<div class="aste-location-title">${location.title}</div>
								<div class="aste-location-address">${location.address}</div>
								<div class="aste-location-additional">${location.additional}</div>
								<div class="aste-location-links">
									<div class="aste-location-link">Разместить рекламу здесь</div>
									<div class="aste-location-link astm-photos">Фотографии ЖК</div>
								</div>
							</div>
						</li>		
					`;
					location.marker = new CustomMarker(new google.maps.LatLng(location.lat, location.lng), map, { number: location.number });
					locations.push(location);
				}
				locationsList.append(locationsHtml);
				loader.remove();

				for (let i = 0; i < $('.astb-location').length; i++) {
					let item = locations[i].listItem = $('.astb-location').eq(i);
					item.click(() => {
						if (!item.hasClass('astm-chosen')) {
							$(document).trigger(chooseLocation, i + 1);
						} else {
							$(document).trigger(unchooseLocation, i + 1);
						}
					});
					item.find('.aste-location-link.astm-photos').click((e) => {
						e.stopPropagation();
						popup.addClass('astm-show');
						popup.find('.aste-popup-inner').append(loader);
						$.ajax(`/as-team/photos?id=${locations[i].id}`, {
							success: (photos) => {
								loader.remove();
								popup.find('.aste-popup-inner').append(photos);
								popup.find('img').on('load', () => {
									let stretchAndCenterPhotos = () => stretchAndCenter($('.aste-popup-photo-wrapper'), '.aste-popup-photo');
									stretchAndCenterPhotos();
									window.addEventListener('resize', stretchAndCenterPhotos);
								});
								popup.find('.aste-popup-photo-wrapper').click(function() {
									popup.scrollTop(0).css({ 'overflow': 'hidden' });
									subpopup
										.addClass('astm-show')
										.append(`<img class="aste-subpopup-image" src="${$(this).attr('data-src-full')}">`);
									subpopup.click(function(e) {
										if (!$(e.target).is('.aste-subpopup-image')) {
											$(this).stop().animate({
												'opacity': 0
											}, 300, function() {
												$(this)
													.removeClass('astm-show')
													.empty()
													.removeAttr('style');
												popup.removeAttr('style');
											});
										}
									});
								});
							}
						});
					});
				}

				$(document).on(chooseLocation.type, (e, param) => {
					let location = locations[param - 1];
					location.listItem.addClass('astm-chosen');
					location.marker.div.addClass('astm-chosen');
					location.chosen = true;
				});

				$(document).on(unchooseLocation.type, (e, param) => {
					let location = locations[param - 1];
					location.listItem.removeClass('astm-chosen');
					location.listItem.addClass('astm-just-unchosen');
					location.listItem.on('mouseover', (e) => {
						location.listItem.removeClass('astm-just-unchosen');
					});
					location.marker.div.removeClass('astm-chosen');
					location.chosen = false;
				});

				$(document).on(`${chooseLocation.type} ${unchooseLocation.type}`, () => {
					let locationsWrapper = $('.aste-locations-list-wrapper');
					locationsWrapper.addClass('astm-got-changes');
					setTimeout(() => locationsWrapper.removeClass('astm-got-changes'), 300);
					let chosenLocations = locations.filter((location) => location.chosen);
					if (chosenLocations.length > 0) {
						locationsWrapper.addClass('astm-got-locations');
						submitLocations.addClass('astm-got-locations');
					} else {
						locationsWrapper.removeClass('astm-got-locations');
						submitLocations.removeClass('astm-got-locations');
					}
				});

				submitLocations.click(() => {
					if (locations.filter((location) => location.chosen).length === 0) return;
					console.log(popup);
					popup
						.addClass('astm-show astm-form')
						.find('.aste-popup-inner')
						.append(submitForm());
				});

			};

			locationsListWrapper.append(loader);

			$.ajax('/as-team/locations', {
				success: gotLocations,
				error: (err) => {
					loader.remove();
					locationsList.append('<div class="aste-secondary">Что-то пошло не так. Перезагрузите страницу</div>');
				}
			});

		});
	}
});