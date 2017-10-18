
/* =================================================================================================== */
/* < CSS > */
/* =================================================================================================== */

import '../css/index.scss';


/* =================================================================================================== */
/* < LIBRARIES > */
/* =================================================================================================== */

import 'bootstrap/js/dist/collapse';
import { device } from 'device.js';
import '@fancyapps/fancybox';
import 'slick-carousel';


/* =================================================================================================== */
/* < COMPONENTS > */
/* =================================================================================================== */

import './components/bobber';
import './components/header-slider';
import './components/screens-slider';
import './components/screens-info';
import './components/accom-slider';
import './components/company-paging';


device.addClasses(document.documentElement);

if ($('html.ios').length > 0) {
	setTimeout(function() {
		for (let dropdown of document.querySelectorAll('.nav-item.dropdown')) {
			dropdown.addEventListener('click', function() {
				console.log('hello, motherfucker');
			});
		}
	}, 1000);
}