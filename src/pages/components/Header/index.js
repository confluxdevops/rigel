import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {useLocation} from 'react-use'
import {useTranslation} from 'react-i18next'
import {Logo, DarkLogo, MobileLogo, DarkMobileLogo} from '../../../assets/svg'
import {useIsMobile} from '../../../hooks'
import useTheme from '../../../hooks/useTheme'
import {WalletHub, LanguageButton, ThemeButton} from '../../components'
import './header.css'

function Header() {
  const {t} = useTranslation()
  const {pathname} = useLocation()
  const isMobile = useIsMobile()
  const {value: isDarkMode} = useTheme()

  //TODO: remove mock data
  const connectData = [
    {
      chain: 'cfx',
      address: 'cfxtest:aame5p2tdzfsc3zsmbg1urwkg5ax22epg27cnu1rwm',
    },
    {chain: 'eth', address: null},
  ]
  const pendingTransactions = [
    {
      type: 'shuttle',
      fromChain: 'eth',
      toChain: 'cfx',
      tokenSymbol: 'ETH',
    },
    {type: 'approve', tokenSymbol: 'UNI'},
  ]

  if (pathname === '/') {
    return (
      <div className="h-16 px-8 bg-transparent flex justify-between items-center w-full">
        {!isMobile ? <DarkLogo /> : <DarkMobileLogo />}
        <LanguageButton />
      </div>
    )
  } else if (pathname === '/maintenance') {
    return null
  } else {
    return (
      <div className="h-12 md:h-16 px-3 md:px-8 bg-transparent flex justify-between items-center w-full">
        <div className="flex items-center justify-between w-full md:w-auto md:justify-start">
          {!isMobile &&
            (!isDarkMode ? (
              <Logo className="mr-8" />
            ) : (
              <DarkLogo className="mr-8" />
            ))}
          {isMobile && (!isDarkMode ? <MobileLogo /> : <DarkMobileLogo />)}
          <HeaderLink to="/shuttle">{t('app')}</HeaderLink>
        </div>
        {!isMobile && (
          <div className="flex items-center">
            <WalletHub
              connectData={connectData}
              pendingTransactions={pendingTransactions}
            />
            <ThemeButton />
            <LanguageButton />
          </div>
        )}
      </div>
    )
  }
}

function HeaderLink({to, children, disabled = false}) {
  const getStyle = () => {
    if (disabled) return 'text-gray-40'
    return 'text-gray-60'
  }
  return (
    <NavLink
      className={`text-base mr-6 w-8 h-6 flex items-center justify-center ${getStyle()}`}
      to={to}
    >
      {children}
    </NavLink>
  )
}

HeaderLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabled: PropTypes.bool,
}

export default Header
