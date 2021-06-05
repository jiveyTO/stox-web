import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { sign, verify } from 'jsonwebtoken'
import { JWT, JWTDecodeParams, JWTEncodeParams } from 'next-auth/jwt'

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
    encode: async (params) => {
      const { token, secret } = params as JWTEncodeParams
      return sign(token as JWT, secret as string, { algorithm: 'HS512' })
    },
    decode: async (params): Promise<JWT> => {
      const { token, secret } = params as JWTDecodeParams
      const decodedToken = verify(token as string, secret, { algorithms: ['HS512'] })
      return decodedToken as JWT
    }
  },
  secret: process.env.SECRET,
  debug: true
})
