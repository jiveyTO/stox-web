import Head from 'next/head'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { signIn, signOut, useSession } from 'next-auth/client'
import useSWR from 'swr'
import TradeTable from '../components/TradeTable'

import '@shopify/polaris/dist/styles.css'
import { Page, DisplayText, Card, Button } from '@shopify/polaris'
import styles from '../styles/Home.module.css'

const TRADES_QUERY = gql`
{
  trades {
    id
    trader
    action
    quantity
    ticker
    expiry
    expiryStr
    strike
    type
    price
    principal
    returnPercent
    returnDollar
    closedAmt
    expiredAmt
  }
}`

const fetcher = async (url, QUERY) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'applicaiton/json' },
    body: JSON.stringify({ query: QUERY.loc.source.body })
  })
  const data = await res.json()

  return data
}

const useTrades = () => {
  const { data, error } = useSWR(['/api/graphql', TRADES_QUERY], fetcher, { dedupingInterval: 300000 })

  let returnData = []
  if (data) returnData = data.data.trades

  return {
    trades: returnData,
    isLoading: !error && !data,
    isError: error
  }
}

const TradesBlock = () => {
  const { trades, isLoading, isError } = useTrades()

  return (
    <>
    <TradeTable trades={trades} />
    </>
  )
}

export default function Home ({ launches }) {
  const [session, loading] = useSession()

  if (!session) {
    return (
      <div className={styles['container']}>
        <h1>Not signed in</h1>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Stox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page>
      <main className={styles.main}>
        Signed in as {session.user.email} <br/>
        <button onClick={() => signOut()}>Sign out</button>
          <DisplayText size="extraLarge" element="h1">
            Welcome to <a href="https://finance.yahoo.com"><span style={{ color: '#0070f3' }}>Stox!</span></a>
          </DisplayText>

        <TradesBlock></TradesBlock>

        <div className={styles.grid}>

          { launches.map(launch => (
            <a key={launch.id} href={launch.links.video_link} className={styles.card}>
              <h3>{ launch.mission_name }</h3>
              <p><strong>Launch Time:</strong>{ new Date(launch.launch_date_local).toLocaleString('en-US') }</p>
            </a>
          ))}

        </div>
      </main>
      </Page>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Stox{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export const getStaticProps = async (context) => {
  const clientSpaceX = new ApolloClient({
    uri: 'https://api.spacex.land/graphql',
    cache: new InMemoryCache()
  })

  const props = {}

  const dataSpaceX = await clientSpaceX.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 5) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `
  })
  props.launches = dataSpaceX.data.launchesPast

  return {
    props
  }
}
