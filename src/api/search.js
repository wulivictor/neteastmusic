import jsonp from '../common/js/jsonpHandler.js'
import axios from 'axios'
import {commonParam, options} from '../api/common.js'

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParam, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function search (query, page, zhida, perpage) { // 这里不能使用jsonp
  const url = '/api/search'

  const data = Object.assign({}, commonParam, {
    w: query,
    p: page,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: data
    }).then((res) => {
      res = res.data
      if (res) {
        resolve(res)
      } else {
        reject(404)
      }
    })
  })
}
