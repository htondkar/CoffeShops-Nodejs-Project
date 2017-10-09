import axios from 'axios'
import { $ } from './bling'

function ajaxHeart(event) {
  event.preventDefault()
  // this is the actual form here
  axios
    .post(this.action)
    .then(res => {
      const isHearted = this.heart.classList.toggle('heart__button--hearted') // means form.heart (name)
      $('.heart-count').textContent = res.data.hearts.length
      if (isHearted) {
        this.heart.classList.add('heart__button--float')
        setTimeout(
          () => this.hear.classList.remove('heart__button--float'),
          2500
        )
      }
    })
    .catch(err => console.log(err))
}

export default ajaxHeart
