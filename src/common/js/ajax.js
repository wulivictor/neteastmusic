import $ from 'jquery'
// import {commonParam} from '../../api/common'

export function get (url, data) {
  return Promise((resovle, reject) => {
    $.ajax({
      'type': 'get',
      'async': true,
      'url': url,
      'data': data,
      'success': (res) => {
        resovle(res)
      },
      'error': (res) => {
        reject(res)
      }
    })
  })
}
