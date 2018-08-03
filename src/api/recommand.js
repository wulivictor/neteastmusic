import jsonp from '../common/js/jsonpHandler'
import {commonParam, options} from './common'
import axios from 'axios'

export function getRecommand () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getRecommendDiss (dissid) {
  const url = '/api/recommendDiss'
  const data = Object.assign({}, commonParam, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    new_format: 1,
    pic: 500,
    disstid: dissid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    picmid: 1,
    nosign: 1,
    song_begin: 0,
    song_num: 15,
    _: new Date().getTime()
  })
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: data
    }).then((res) => {
      if (res) {
        resolve(res)
      }
    })
  })
}
