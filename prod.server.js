var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

apiRoutes.get('/api/lyric', function (req, res) {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    if (typeof ret === 'string') {
      let start = ret.indexOf('{')
      let stop = ret.indexOf('}')
      ret = ret.substring(start, stop + 1)
      ret = JSON.parse(ret)
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

// get recommend cd inf
apiRoutes.get('/api/recommendDiss', function (req, res) {
  let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    if (typeof ret === 'string') {
      let start = ret.indexOf('{')
      let stop = ret.indexOf('}')
      ret = ret.substring(start, stop + 1)
      ret = JSON.parse(ret)
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})


// search song or singer
apiRoutes.get('/api/search', function (req, res) {
  let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    debugger
    let ret = response.data
    if (typeof ret === 'string') {
      let start = ret.indexOf('(')
      let stop = ret.indexOf(')')
      ret = ret.substring(start + 1, stop)
      ret = JSON.parse(ret)
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
