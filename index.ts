import { Hono } from 'hono'
import { fetchJWKS, validateToken } from './jwt'

const app = new Hono()

app.get('/', async c => {
  const jwksUri =
    'https://dev-jchgz1qyixkorthf.jp.auth0.com/.well-known/jwks.json'
  const jwks = await fetchJWKS(jwksUri)
  console.log(jwks)
  return c.json({ message: 'Hello from Hono!' })
})

app.get('/auth', async c => {
  console.log(c.req.header)
  const authorization = c.req.header('Authorization')
  if (!authorization) return new Response('Unauthorized', { status: 401 })
  console.log('header exists')

  const token = authorization.split(' ')[1]

  const isValid = await validateToken(token)
  console.log(isValid)
  if (!isValid) return new Response('Invalid token', { status: 401 })

  return c.json({ message: 'You are an authorized user!' })
})

export default app
