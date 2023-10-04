import fs from 'fs'
import https from 'https'
import express from 'express'

const app = express()

// 通常のHTTPリクエストのハンドラー
app.get('/', (req, res) => {
  res.send('Hello HTTPS World\n')
})

// HTTPSサーバーのオプション
const httpsOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert'),
}

https.createServer(httpsOptions, app).listen(8000, () => {
  console.log('Server running at https://localhost:8000/')
})
