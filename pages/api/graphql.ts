import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Secret, verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  // first check that the jwt is good
  let authenticated = false
  let cookieToken: string
  try {
    const secret: Secret = process.env.SECRET || ''

    cookieToken =
      req.cookies['__Secure-next-auth.session-token'] || req.cookies['next-auth.session-token']
    const tokenPayload = await verify(cookieToken, secret)

    if ((tokenPayload as any).name) {
      authenticated = true
    }
  } catch (e) {
    console.log('e', e)
    res.status(401)
  }

  if (!authenticated) return null

  // make a call to your real graphql API server
  // TODO update uri for prod
  const httpLink = createHttpLink({
    uri: process.env.STOX_API
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: cookieToken ? `${cookieToken}` : ''
      }
    }
  })

  const clientTrades = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })

  const body = req.body.query ? req.body.query : JSON.parse(req.body).query

  let result
  try {
    result = await clientTrades.query({
      query: gql`
        ${body}
      `
    })
  } catch (e) {
    console.log('jwt token error:', e)
    res.status(401)
  }

  if (!result) return null

  res.status(200).json(JSON.stringify(result))
}
