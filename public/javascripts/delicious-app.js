import '../sass/style.scss'

import { $, $$ } from './modules/bling'
import autoCompleteSearch from './modules/autoCompleteSearch'
import typeAhead from './modules/typeAhead'

// enable google search 
autoCompleteSearch($('#address'), $('#lat'), $('#lng'))
// enable search 
typeAhead($('.search'))