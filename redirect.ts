import express from 'express'
import https from 'https'
import fs from 'fs'
import { URLSearchParams } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.get('/', async (req, res) => {
  const code = req.query.code as string
  const state = req.query.state as string

  console.log(`State is: ${state}`)

  if (!code) return res.send('No code provided')

  const params = new URLSearchParams()
  params.append('client_id', process.env.SLACK_CLIENT_ID ?? '')
  params.append('client_secret', process.env.SLACK_CLIENT_SECRET ?? '')
  params.append('code', code)
  params.append('redirect_uri', 'https://localhost:3000')

  try {
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })

    const data = await response.json()

    if (data.ok) {
      console.log(`Access token: ${data.access_token}`)
    } else {
      console.error(`Error: ${data.error}`)
    }
  } catch (error) {
    console.error(`Fetch failed: ${error}`)
  }

  res.send('Done')
})

const options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert'),
}

https.createServer(options, app).listen(3000, () => {
  console.log('Server running on https://localhost:3000')
})
