import {getLyric} from '../../api/song'
import {ERROR_OK} from '../../api/common'
import {Base64} from 'js-base64'

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getlyric () {
    if (this.lyric) {
      return new Promise((resolve) => {
        resolve(this.lyric)
      })
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.code === ERROR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(404)
        }
      })
    })
  }
}

// the page of singer create song class
export function createSong (musicData, songkey, filename) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`
  })
}

// the page of recommend create song class
export function createRecommend (preSong) {
  return new Song({
    id: preSong.id,
    mid: preSong.mid,
    singer: filterSinger(preSong.singer),
    name: preSong.name,
    album: preSong.album,
    duration: preSong.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${preSong.album.mid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${preSong.mid}.m4a?fromtag=0&guid=126548448`
  })
}

function filterSinger (list) {
  if (!list) {
    return
  }
  let ret = []
  list.forEach((s) => {
    ret.push(s.name)
  })
  if (list.length > 1) {
    return ret.join('/')
  } else {
    return ret[0]
  }
}
