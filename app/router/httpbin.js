const zlib = require('zlib')
const http = require('http')
const express = require('express')
const router = express.Router()

const brotli = require('iltorb')

const uuid = require('app/util/uuid')
const base64 = require('app/util/base64')

router.get('/ip', function (req, res) {
  res.json({
    origin: req.ctx.ip
  })
})

router.get('/uuid', function (req, res) {
  res.json({
    uuid: uuid()
  })
})

router.get('/user-agent', function (req, res) {
  res.json({
    'user-agent': req.ctx.ua
  })
})

router.get('/headers', function (req, res) {
  res.json({
    headers: req.ctx.headers
  })
})

router.get('/get', function (req, res) {
  res.json({
    args: req.ctx.query,
    headers: req.ctx.headers,
    origin: req.ctx.ip,
    url: req.ctx.url
  })
})

router.post('/post', function (req, res) {
  res.json({
    args: req.ctx.query,
    data: req.ctx.text,
    files: req.ctx.files,
    form: req.ctx.form,
    headers: req.ctx.headers,
    json: req.ctx.body,
    origin: req.ctx.ip,
    url: req.ctx.url
  })
})

router.patch('/patch', function (req, res) {
  res.json({
    args: req.ctx.query,
    data: req.ctx.text,
    files: req.ctx.files,
    form: req.ctx.form,
    headers: req.ctx.headers,
    json: req.ctx.body,
    origin: req.ctx.ip,
    url: req.ctx.url
  })
})

router.put('/put', function (req, res) {
  res.json({
    args: req.ctx.query,
    data: req.ctx.text,
    files: req.ctx.files,
    form: req.ctx.form,
    headers: req.ctx.headers,
    json: req.ctx.body,
    origin: req.ctx.ip,
    url: req.ctx.url
  })
})

router.delete('/delete', function (req, res) {
  res.json({
    args: req.ctx.query,
    data: req.ctx.text,
    files: req.ctx.files,
    form: req.ctx.form,
    headers: req.ctx.headers,
    json: req.ctx.body,
    origin: req.ctx.ip,
    url: req.ctx.url
  })
})

router.all('/anything/:anything?', function (req, res) {
  res.json({
    args: req.ctx.query,
    data: req.ctx.text,
    files: req.ctx.files,
    form: req.ctx.form,
    headers: req.ctx.headers,
    json: req.ctx.body,
    method: req.ctx.method,
    origin: req.ctx.ip,
    url: req.ctx.url
  })
})

router.get('/base64/:encoded', (req, res) => {
  const encoded = req.param('encoded')
  res.send(base64.decode(encoded))
})

router.get('/encoding/utf8', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.sendFile('public/UTF-8-demo.txt', {
    root: '.'
  })
})

router.get('/gzip', (req, res, next) => {
  res.setHeader('Content-Encoding', 'gzip')
  res.removeHeader('Content-Length')
  res.setHeader('Content-Type', 'application/json')

  zlib.gzip(
    JSON.stringify({
      gzipped: true,
      headers: req.ctx.headers,
      method: req.ctx.method,
      origin: req.ctx.ip
    }),
    (err, result) => {
      if (err) {
        return next(err)
      }

      res.end(result)
    }
  )
})

router.get('/deflate', (req, res, next) => {
  res.setHeader('Content-Encoding', 'deflate')
  res.removeHeader('Content-Length')
  res.setHeader('Content-Type', 'application/json')

  zlib.deflate(
    JSON.stringify({
      deflated: true,
      headers: req.ctx.headers,
      method: req.ctx.method,
      origin: req.ctx.ip
    }),
    (err, result) => {
      if (err) {
        return next(err)
      }

      res.end(result)
    }
  )
})

router.get('/brotli', (req, res, next) => {
  res.setHeader('Content-Encoding', 'br')
  res.removeHeader('Content-Length')
  res.setHeader('Content-Type', 'application/json')

  brotli.compress(
    Buffer.from(JSON.stringify({
      brotli: true,
      headers: req.ctx.headers,
      method: req.ctx.method,
      origin: req.ctx.ip
    })),
    (err, result) => {
      if (err) {
        return next(err)
      }

      res.end(result)
    }
  )
})

router.all('/status/:code', (req, res) => {
  const code = req.param('code')

  const isValidCode = !!http.STATUS_CODES[code]
  if (!isValidCode) {
    return res.status(400).end(`invalid statuc code: ${code}`)
  }

  res.status(code).json({
    code,
    message: http.STATUS_CODES[code]
  })
})

router.all('/response-headers', (req, res) => {
  const query = req.ctx.query

  for (let key in query) {
    let val = query[key]
    res.setHeader(key, `${val}`)
  }

  res.json(query)
})

router.get('/cookies', (req, res) => {
  res.json({
    cookies: req.ctx.cookies
  })
})

module.exports = router
