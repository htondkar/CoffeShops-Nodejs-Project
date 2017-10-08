import axios from 'axios'
import { $ } from './bling'

const mapOptions = {
  center: {
    lat: 43.2,
    lng: -79.8
  },
  zoom: 13
}

function loadPlaces(map, lat = 43.2, lng = -79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`).then(res => {
    const places = res.data
    if (!places.length) {
      alert('no place was found')
    } else {
      const bounds = new google.maps.LatLngBounds()
      const infoWindow = new google.maps.InfoWindow()

      const markers = places.map(place => {
        const [lng, lat] = place.location.coordinates
        const position = { lat, lng }
        bounds.extend(position)
        const marker = new google.maps.Marker({
          map,
          position
        })
        marker.place = place
        return marker
      })
      // add infoWindow to markers
      markers.forEach(marker =>
        marker.addListener('click', function() {
          console.log(this.place)
          const HTML = `
            <div> 
              <a href="/stores/${this.place.slug} target="_blank">
                <div> ${this.place.name} - ${this.place.location.address}</div>
                <img src="/uploads/${this.place.photo || 'store.png'}" />
              </a>
            </div>`
          infoWindow.setContent(HTML)
          infoWindow.open(map, this)
        })
      )

      // center map
      map.setCenter(bounds.getCenter())
      map.fitBounds(bounds)
    }
  })
}

function makeMap(containerEl) {
  if (!containerEl) return
  const map = new google.maps.Map(containerEl, mapOptions)
  loadPlaces(map)

  const input = $('[name="geolocate"]')
  const autoComplete = new google.maps.places.Autocomplete(input)
  autoComplete.addListener('place_changed', () => {
    const { geometry: { location: { lat, lng } } } = autoComplete.getPlace()
    loadPlaces(map, lat(), lng())
  })
}

export default makeMap
