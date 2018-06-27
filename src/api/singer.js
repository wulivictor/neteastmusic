import jsonp from '../common/js/jsonpHandler'
import {commonParam, options} from './common'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParam, { // 参数：1 需要合并的对象（这里是空对象），2 3参数
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  })
  return jsonp(url, data, options)
}

export function getSingerDetail (singId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?'
  const data = Object.assign({}, commonParam, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 1000,
    songstatus: 1,
    singermid: singId,
    g_tk: 1664029744
  })
  return jsonp(url, data, options)
}
