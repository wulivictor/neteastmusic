import {commonParam} from './common'
import {get} from '../common/js/ajax'

export function getMusic (songmid) {
  const url = '/api/music'
  const data = Object.assign({}, commonParam, {
    songmid: songmid,
    guid: 1849502645,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    filename: 'C400' + songmid + '.m4a'
  })
  // return jsonp(url, data, options)
  return get(url, data)
}
