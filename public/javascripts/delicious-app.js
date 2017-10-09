import '../sass/style.scss'

import { $, $$ } from './modules/bling'
import autoCompleteSearch from './modules/autoCompleteSearch'
import typeAhead from './modules/typeAhead'
import makeMap from './modules/map'
import ajaxHeart from './modules/heart'

// enable google search
autoCompleteSearch($('#address'), $('#lat'), $('#lng'))
// enable search
typeAhead($('.search'))
// /map page
makeMap($('#map'))

$$('form.heart').on('submit', ajaxHeart)
