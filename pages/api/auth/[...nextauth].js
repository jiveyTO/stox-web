import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { sign, verify } from 'jsonwebtoken'

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_BOT_ID,
      clientSecret: process.env.DISCORD_APP_PRIVATE_TOKEN
    })
  ],
  session: {
    jwt: true,
    maxAge: 10 * 24 * 60 * 60
  },
  jwt: {
    secret: process.env.SECRET,
    encode: async ({ secret, token, maxAge }) => {
      return sign(token, secret, { algorithm: 'HS512' })
    },
    decode: async ({ secret, token, maxAge }) => {
      const decodedToken = verify(token, secret, { algorithms: ['HS512'] })
      return decodedToken
    }
  },
  secret: process.env.SECRET,
  debug: true
})
