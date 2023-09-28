import { Hono } from 'hono'
import { validateToken } from './jwt'

const app = new Hono()

const jwksUri =
  'https://dev-jchgz1qyixkorthf.jp.auth0.com/.well-known/jwks.json'

app.get('/', async c => {
  return c.json({ message: 'Hello from Hono!' })
})

app.get('/auth', async c => {
  console.log(c.req.header)
  const authorization = c.req.header('Authorization')
  if (!authorization) return new Response('Unauthorized', { status: 401 })

  const token = authorization.split(' ')[1]

  const isValid = await validateToken(token)
  if (!isValid) return new Response('Invalid token', { status: 401 })

  return c.json({ message: 'You are an authorized user!' })
})

export default app
