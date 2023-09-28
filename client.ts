import dotenv from 'dotenv'

dotenv.config()

async function fetchApiWithAccessToken() {
  const token = await fetchAuth0Token()

  const apiResponse = await fetch('http://localhost:8787/auth', {
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log(apiResponse)

  const data = await apiResponse.json()
  console.log(data)
}

export async function fetchAuth0Token(): Promise<string> {
  const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`

  const payload = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
    grant_type: 'client_credentials',
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  console.log(data.access_token)
  return data.access_token
}

fetchApiWithAccessToken()

// // 非同期の即時関数を実行
// ;(async () => {
//   const token = await fetchAuth0Token()
//   console.log(token)
// })()
