import {getLyric} from '../../api/song'
import {ERROR_OK} from '../../api/common'

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
    debugger

    getLyric(this.mid).then(res => {
      if (res.ERROR_OK === 0) {
        res = res.data
        return res
      }
    })
  }
}
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

// 处理歌手信息
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
