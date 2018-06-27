import $ from 'jquery'
// import {commonParam} from '../../api/common'

export function get (url, data) {
  return new Promise((resovle, reject) => {
    $.ajax({
      'type': 'get',
      'async': true,
      'url': url,
      'data': data,
      'success': res => {
        resovle(res)
      },
      'error': err => {
        reject(err)
      }
    })
  })
}