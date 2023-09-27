import jwt from 'jsonwebtoken'

async function fetchJWKS(jwksUri: string): Promise<{ [key: string]: string }> {
  const response = await fetch(jwksUri)
  const json = await response.json()
  const keys: { [key: string]: string } = {}

  for (const key of json.keys) {
    if (key.kty === 'RSA' && key.alg === 'RS256' && key.use === 'sig') {
      keys[
        key.kid
      ] = `-----BEGIN PUBLIC KEY-----\n${key.x5c[0]}\n-----END PUBLIC KEY-----`
    }
  }

  return keys
}

export async function validateToken(token: string): Promise<boolean> {
  const decodedHeader = jwt.decode(token, { complete: true }) as {
    [key: string]: any
  }
  const kid = decodedHeader?.header?.kid

  if (!kid) {
    return false
  }

  const jwksUri = 'dev-jchgz1qyixkorthf.jp.auth0.com/.well-known/jwks.json'
  const jwks = await fetchJWKS(jwksUri)
  const publicKey = jwks[kid]

  if (!publicKey) {
    return false
  }

  try {
    jwt.verify(token, publicKey, { algorithms: ['RS256'] })
    return true
  } catch (err) {
    return false
  }
}
