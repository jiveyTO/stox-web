import '../styles/globals.css'
import { Provider } from 'next-auth/client'

import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider } from '@shopify/polaris'

function MyApp ({ Component, pageProps }) {
  return (
    <AppProvider i18n={enTranslations}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </AppProvider>
  )
}

export default MyApp
