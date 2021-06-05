import React from 'react'
import { Provider } from 'next-auth/client'
import StoxLayout from '../components/StoxLayout'
import type { AppProps } from 'next/app'
import { ReactElement } from 'react'
import '../styles/globals.css'
import '@shopify/polaris/dist/styles.css'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <Provider session={pageProps.session}>
      <StoxLayout>
        <Component {...pageProps} />
      </StoxLayout>
    </Provider>
  )
}

export default MyApp
