export default function(element, latInput, longInput) {
  const dropdown = new google.maps.places.Autocomplete(element)
  dropdown.addListener('place_changed', () => {
    const { geometry: { location: { lat, lng } } } = dropdown.getPlace()
    latInput.value = lat()
    longInput.value = lng()
  })
  ;element.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
      event.preventDefault()
    }
  })
}
