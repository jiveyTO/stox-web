import '../styles/globals.css'
import { Provider } from 'next-auth/client'
import StoxLayout from '../components/StoxLayout'

function MyApp ({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <StoxLayout>
        <Component {...pageProps} />
      </StoxLayout>
    </Provider>
  )
}

export default MyApp
