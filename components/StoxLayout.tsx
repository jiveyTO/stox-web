import Head from 'next/head'
import { useState, useCallback, ReactElement } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider, AvatarProps, Frame, TopBar } from '@shopify/polaris'
import { ReportsMajor, CircleRightMajor, DiscountsMajor } from '@shopify/polaris-icons'

import styles from '../styles/Home.module.css'

const StoxLayout = ({ children }: { children: React.ReactNode }): ReactElement => {
  const [session, loading] = useSession()

  // Go to Discord signIn if not signed in yet
  if (!session && !loading) {
    signIn().catch(() => console.log('Error with auto sign in'))
  }

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    []
  )

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            {
              content: '10 year treasury yield',
              icon: DiscountsMajor,
              url: 'https://www.marketwatch.com/investing/bond/tmubmusd10y?countrycode=bx',
              external: true
            },
            {
              content: 'TSLA',
              icon: ReportsMajor,
              url: 'https://finance.yahoo.com/quote/TSLA/options?p=TSLA',
              external: true
            },
            {
              content: 'FB',
              icon: ReportsMajor,
              url: 'https://finance.yahoo.com/quote/FB/options?p=FB',
              external: true
            }
          ]
        },
        {
          items: [{ content: 'Sign Out', icon: CircleRightMajor, onAction: signOut }]
        }
      ]}
      name={session?.user?.name as string}
      detail={session?.user?.email as string}
      initials={session?.user?.name?.charAt(0).toUpperCase()}
      avatar={session?.user?.image as AvatarProps['source']}
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  )

  const topBarMarkup = !session ? null : <TopBar userMenu={userMenuMarkup} />

  return (
    <AppProvider i18n={enTranslations}>
      <Head>
        <meta name="description" content="Trade options with friends" />
        <meta name="og:title" content="Stox" />
        <title>Stox</title>
      </Head>
      {!session ? (
        <div className={styles['container']}>
          <h1>Loading...</h1>
        </div>
      ) : (
        <Frame topBar={topBarMarkup}>{children}</Frame>
      )}
    </AppProvider>
  )
}

export default StoxLayout
