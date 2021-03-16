import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { verify } from 'jsonwebtoken'

export default async function handler (req, res) {
  // first check that the jwt is good
  let authenticated = false
  try {
    const secret = process.env.SECRET
    const tokenPayload = await verify(req.cookies['next-auth.session-token'], secret)

    if (tokenPayload.name) {
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
        Authorization: req.cookies['next-auth.session-token'] ? `${req.cookies['next-auth.session-token']}` : ''
      }
    }
  })

  const clientTrades = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })

  const body = (req.body.query) ? req.body.query : JSON.parse(req.body).query

  let result
  try {
    result = await clientTrades.query({
      query: gql`${body}`
    })
  } catch (e) {
    console.log('jwt token error:', e)
    res.status(401)
  }

  if (!result) return null

  res.status(200).json(JSON.stringify(result))
}
