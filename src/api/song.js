import {commonParam, options} from './common'
import {get} from 'common/js/ajax'
import jsonp from '../common/js/jsonpHandler'
import axios from 'axios'
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

export function getSonglist (singerid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, {
    g_tk: 1928093487,
    guid: 1849502645,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerid,
    inCharest: 'utf-8',
    outCharest: 'utf-8',
    notice: 0,
    format: 'json'
  })
  return jsonp(url, data, options)
}

export function getLyric (mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, {
    pcachetime: new Date().getTime(),
    songmid: mid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data) // 这儿我没弄懂 应该是返回一个promise对象 ，然后这个对象中有方法，通过执行方法返回res.data
  })
}
