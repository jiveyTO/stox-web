import { useState, useCallback } from 'react'
import { signOut, useSession } from 'next-auth/client'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider, Frame, Navigation, TopBar } from '@shopify/polaris'
import { ReportsMajor, CircleRightMajor, DiscountsMajor } from '@shopify/polaris-icons'

const StoxLayout = ({ children }) => {
  const [session, loading] = useSession()
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
      name={session?.user?.name}
      detail={session?.user?.email}
      initials={session?.user?.name?.charAt(0).toUpperCase()}
      avatar={session?.user?.image}
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  )

  const topBarMarkup = (!session)
    ? null
    : (
        <TopBar
          userMenu={userMenuMarkup}
        />
      )

  return (
    <AppProvider i18n={enTranslations}>
      <Frame topBar={topBarMarkup}>
        {children}
      </Frame>
    </AppProvider>
  )
}

export default StoxLayout
