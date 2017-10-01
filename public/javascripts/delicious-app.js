import '../sass/style.scss'

import { $, $$ } from './modules/bling'
import autoCompleteSearch from './modules/autoCompleteSearch'

autoCompleteSearch($('#address'), $('#lat'), $('#lng'))
