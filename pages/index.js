import Head from 'next/head'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { signIn, signOut, useSession } from 'next-auth/client'
import useSWR from 'swr'
import TradeTable from '../components/TradeTable'
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
    returnPercent
    returnDollar
    closedAmt
    expiredAmt
  }
}`

const fetcher = async (url, QUERY) => {
  console.log('my fetch here = ', url)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'applicaiton/json' },
    body: JSON.stringify({ query: QUERY.loc.source.body })
  })
  const data = await res.json()
  console.log('my data here = ', data)

  return data
}

const useTrades = () => {
  const { data, error } = useSWR(['/api/graphql', TRADES_QUERY], fetcher, { dedupingInterval: 300000 })

  let returnData = []
  console.log('useTrades data = ', data)
  if (data) returnData = data.data.trades

  return {
    trades: returnData,
    isLoading: !error && !data,
    isError: error
  }
}

const TradesBlock = () => {
  return (
    <>
    <TradesSummary></TradesSummary>
    <Trades></Trades>
    </>
  )
}

const TradesSummary = () => {
  return (
    <></>
  )
}

const Trades = () => {
  const { trades, isLoading, isError } = useTrades()
  console.log('<Trades> trades = ', trades)
  console.log('<Trades> isLoading = ', isLoading)
  console.log('<Trades> isError = ', isError)

  return (
    <>
      <TradeTable trades={trades} />
    </>
  )
}

export default function Home ({ launches }) {
  const [session, loading] = useSession()

  console.log('loading...', loading)
  console.log('session A', session)

  if (!session) {
    return (
      <>
        Not signed in <br/>
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        Signed in as {session.user.email} <br/>
        <button onClick={() => signOut()}>Sign out</button>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Stox!</a>
        </h1>

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
