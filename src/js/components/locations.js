import $script from 'scriptjs';

import stretchAndCenter from '../utils/stretch-and-center';

$(document).ready(() => {
	if ($('.astb-locations').length > 0) {
		$script('https://maps.googleapis.com/maps/api/js?key=AIzaSyCWgWiXe4fdVDjYj6-APt80DhtH2o05w8U&amp', function() {

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
			let errMessage = '<div class="aste-secondary">Что-то пошло не так. Перезагрузите страницу</div>';

			let locationsMap = new google.maps.Map(document.querySelector('.aste-locations-map'), {
				center: { lat: 55.755246, lng: 37.622088 },
				zoom: 10,
				disableDefaultUI: true
			});

			class CustomMarker extends google.maps.OverlayView {
				constructor(latlng, map, args) {
					super();
					this.latlng = latlng;
					this.args = args;
					this.setMap(map);
				}
				draw() {
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
							div.addClass('astm-hover');
						});
						div.on('mouseout', (e) => {
							div.removeClass('astm-hover');
						});
						div.click(this.args.chooseLocation);
						$(panes.overlayImage).append(div);
					}
					let point = this.getProjection().fromLatLngToDivPixel(this.latlng);
					if (point) {
						div.css({ "left": `${point.x - 15}px`, "top": `${point.y - 15}px` });
					}
				}
				remove() {
					if (this.div) {
						this.div.parentNode.removeChild(this.div);
						this.div = null;
					}
				}
				getPosition() {
					return this.latlng;	
				}
			}

			class PopUp {
				constructor(popup, subpopup, innerSelector) {
					this.popup = popup;
					this.subpopup = subpopup;
					this.inner = this.popup.find(innerSelector);
				}
				renderPopup(html, closers, additionalClass) {
					this.popup.addClass('astm-show');
					if (additionalClass) this.popup.addClass(additionalClass);
					this.inner.html(html);
					this.popup.click((e) => {
						if ($(e.target).is(this.popup)) this.closePopup(additionalClass);
					});
					$(closers).click((e) => {
						if ($(e.target).is($(closers))) this.closePopup(additionalClass);
					});
				}
				renderSubpopup(html) {
					this.popup.scrollTop(0).css({ 'overflow': 'hidden' });
					this.subpopup
						.addClass('astm-show')
						.html(html);
					this.subpopup.click((e) => {
						if ($(e.target).is(this.subpopup)) this.closeSubpopup();
					});
				}
				closePopup(additionalClass) {
					this.popup.removeClass('astm-show');
					if (additionalClass) this.popup.removeClass(additionalClass);
					this.inner.empty();
				}
				closeSubpopup() {
					this.subpopup.removeClass('astm-show').empty();
					this.popup.removeAttr('style');
				}
			}

			let popupEl = $('.astb-popup');
			let subpopupEl = popupEl.find('.aste-subpopup');
			let popup = new PopUp(popupEl, subpopupEl, '.aste-popup-inner');

			class Locations {
				constructor() {
					this.locations = [];
				}
				renderLoc(locations, list, map, wrapper, submit) {
					this.wrapper = wrapper;
					this.submit = submit;
					this.locations = locations;
					let locationHtml = '';
					for (let i = 0; i < this.locations.length; i++) {
						this.locations[i].listItem = $(`
							<li class="aste-locations-item">
								<div class="astb-location">
									<div class="aste-location-number">${i + 1}</div>
									<div class="aste-location-title">${this.locations[i].title}</div>
									<div class="aste-location-address">${this.locations[i].address}</div>
									<div class="aste-location-additional">${this.locations[i].additional}</div>
									<div class="aste-location-links">
										<div class="aste-location-link">Разместить рекламу здесь</div>
										${this.locations[i].photos ? '<div class="aste-location-link astm-photos">Фотографии ЖК</div>' : ''}
									</div>
								</div>
							</li>
						`).click(() => this.chooseLocation(this.locations[i], 'listItem'));
						this.locations[i].listItem
							.find('.aste-location-link.astm-photos')
							.click((e) => {
								this.loadPhotos(this.locations[i]);
								e.stopPropagation();
							});
						this.locations[i].marker = new CustomMarker(
							new google.maps.LatLng(this.locations[i].lat, this.locations[i].lng), 
							map, 
							{ 
								number: this.locations[i].sort_order,
								chooseLocation: () => this.chooseLocation(this.locations[i], 'marker')
							}
						);
						list.append(this.locations[i].listItem);
					}
					this.submit.click(() => {
					if (this.chosen.length === 0) return;
						popup.renderPopup(this.renderSubmitForm(), '.aste-location-add, .aste-form-close');
					});
				}
				get chosen() {
					return this.locations.filter(location => location.chosen);
				}
				chooseLocation(location, emitter) {
					location.chosen = !location.chosen;
					if (emitter === 'marker') {
						this.wrapper.addClass('astm-got-changes');
						setTimeout(() => this.wrapper.removeClass('astm-got-changes'), 300);
					}
					if (location.chosen) {
						location.listItem.find('.astb-location').addClass('astm-chosen');
						location.marker.div.addClass('astm-chosen');
					} else {
						location.listItem.find('.astb-location').removeClass('astm-chosen');
						location.marker.div.removeClass('astm-chosen');
					}
					if (this.chosen.length > 0) {
						this.wrapper.addClass('astm-got-locations');
						this.submit.addClass('astm-got-locations');
					} else {
						this.wrapper.removeClass('astm-got-locations');
						this.submit.removeClass('astm-got-locations');
					}
				}
				loadPhotos(location) {
					popup.renderPopup(loader, '', 'astm-photos');
					$.ajax(`/api/photos/${location.id}`, {
						success: (photos) => {
							let subpopupEmmiter = $(photos).find('')
							popup.renderPopup(photos, '', 'astm-photos');
							popup.popup.find('img').on('load', () => {
								let stretchAndCenterPhotos = () => stretchAndCenter($('.aste-popup-photo-wrapper'), '.aste-popup-photo');
								stretchAndCenterPhotos();
							});
							popup.popup.find('.aste-popup-photo-wrapper').click(function(e) {
								let html = `<img class="aste-subpopup-image" src="${$(this).attr('data-src-full')}">`;
								popup.renderSubpopup(html);
							});
						},
						error: (err) => {
							loader.remove();
							popup.renderPopup('.aste-popup-inner').append(errMessage);
						}
					});
				}
				renderSubmitForm() {
					let form = $(`
						<form class="astb-form astm-locations">
							<div class="aste-form-title">Заказать размещение</div>
							<div class="aste-form-close"></div>
							<input name="name" class="aste-form-input aste-form-name" placeholder="Как к Вам обращаться?">
							<input name="phone" class="aste-form-input aste-form-phone" placeholder="Ваш номер телефона">
							<div class="aste-form-locations">
							</div>
							<button type="submit" class="aste-form-submit">Отправить</button>
						</form>
					`);
					let formLocations = form.find('.aste-form-locations');
					for (let location of this.chosen) {
						let locationHtml = $(`
							<div class="aste-form-location">
								<div class="aste-location-title">
									${location.title}
								</div>
								<div class="aste-location-delete"></div>
							</div>
						`);
						locationHtml.find('.aste-location-delete').click(() => {
							this.chooseLocation(location);
							locationHtml.remove();
							if (this.chosen.length === 0) {
								popup.closePopup();
							}
						});
						formLocations.append(locationHtml);
					}
					let locationAdd = $('<div class="aste-location-add"></div>').click(() => {
						$('.aste-location-number').addClass('astm-green');
						setTimeout(() => $('.aste-location-number').removeClass('astm-green'), 300);
					});
					formLocations.append(locationAdd);
					form.find('.aste-form-phone').mask('+7 (999) 999-99-99');
					form.change(() => {
						let formSubmit = form.find('.aste-form-submit');
						if (formSubmit.hasClass('astm-error')) {
							form.find('.aste-form-submit').removeClass('astm-error').text('Отправить');
							form.find('.aste-form-input').removeClass('astm-error');
						}
					});
					form.submit((e) => {
						e.preventDefault();
						let formContent = {
							name: e.target[0].value,
							phone: e.target[1].value,
							locations: this.chosen.map(location => location.id)
						};
						let error = false;
						let thankYou = $(`
							<div class="astb-form astm-thank-you">
								<div class="aste-form-title">Заказать размещение</div>
								<div class="aste-form-close"></div>
								<p class="aste-form-text">Заявка на размещение успешно отправлена. Мы свяжемся с Вами в ближайшее время для уточнения всех деталей и ответим на все Ваши вопросы.</p>
								<button class="aste-form-submit">Закрыть</button>
							</div>
						`);
						for (let prop in formContent) {
							if (formContent[prop] === '') {
								error = true;
								form.find(`.aste-form-input.aste-form-${prop}`).addClass('astm-error');
							}
						}
						if (error) {
							form.find('.aste-form-submit').addClass('astm-error').text('Все поля обязательны')
						} else {
							popup.renderPopup(loader);
							$.ajax('/api/form', {
								method: 'POST',
								data: formContent,
								success: (res) => {
									popup.renderPopup(thankYou, '.aste-form-close, .aste-form-submit');
								},
								error: (err) => {
									console.log(err);
									popup.renderPopup(errMessage);
								}
							})
						};
					});
					return form;
				}
			}

			let locations = new Locations();
			let locationsListWrapper = $('.astb-locations .aste-locations-list-wrapper');
			let locationsList = $('.astb-locations ul.aste-locations-list');
			let submitLocations = $('.aste-locations-submit');

			let gotLocations = (resLocations) => {

				locations.renderLoc(
					resLocations,
					locationsList,
					locationsMap,
					locationsListWrapper,
					submitLocations
				);

				loader.remove();

			};

			locationsListWrapper.append(loader);

			// TODO
			$.ajax('/api/locations', {
				success: gotLocations,
				error: (err) => {
					loader.remove();
					locationsList.append(errMessage);
				}
			});

		});
	}
});