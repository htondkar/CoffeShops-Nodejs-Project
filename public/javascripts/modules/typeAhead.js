import axios from 'axios'
import dompurify from 'dompurify'

const storeLink = store => `
<a href="/stores/${store.slug}" class="search__result"><strong>${store.name}</strong></a>
`
const searchResultHTML = stores => stores.map(storeLink).join('')

function typeAhead(searchBox) {
  if (!searchBox) {
    return
  } else {
    const input = searchBox.querySelector('input[name=search]')
    const resultContainer = searchBox.querySelector('.search__results')

    // using blink methods
    input.on('input', function() {
      if (!this.value) {
        resultContainer.style.display = 'none'
        return
      } else {
        resultContainer.style.display = 'block'
        resultContainer.innerHTML = ''

        axios
          .get('/api/search', { params: { q: this.value } })
          .then(res => {
            if (res.data.length > 0) {
              resultContainer.innerHTML = dompurify.sanitize(
                searchResultHTML(res.data)
              )
            } else {
              resultContainer.innerHTML = dompurify.sanitize(`
              <div class="search__result">
               Nothing was found for ${this.value}.
              </div>
              `)
            }
          })
          .catch(err => console.log(err))
      }
    })
  }
}

export default typeAhead
