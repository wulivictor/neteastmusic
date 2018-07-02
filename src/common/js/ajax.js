// import {commonParam} from '../../api/common'
import axios from 'axios'

export function get (url, data) {
  return new Promise((resolve, reject) => {
    axios.get(url, data).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
