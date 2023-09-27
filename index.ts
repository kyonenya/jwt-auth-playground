import { Hono } from 'hono'
import { validateToken } from './jwt'

const app = new Hono()

app.get('/', c => c.json({ message: 'Hello from Hono!' }))

app.get('/auth', async c => {
  const authorization = c.req.header('authorization')
  if (!authorization) return new Response('Unauthorized', { status: 401 })

  const token = authorization.split(' ')[1]
  const isValid = await validateToken(token)
  if (!isValid) return new Response('Invalid token', { status: 401 })

  return c.json({ message: 'You are an authorized user!' })
})

export default app
