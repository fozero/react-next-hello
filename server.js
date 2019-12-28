
// 服务端支持路由遮盖
const express = require('express')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

//   服务器中对 /p/* 开头的路由进行重写，然后重定向到 /post 开头的路由上，最后将内容返回给前端
  server.get('/p/:id', (req, res) => {
    const actualPage = '/post'
    const queryParams = { 
        title: req.params.id 
    } 
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3001, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3001')
  })
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})