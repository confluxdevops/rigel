import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {useLocation} from 'react-use'
import {useTranslation} from 'react-i18next'
import {Logo, DarkLogo} from '../../../assets/svg'
import WalletHub from './WalletHub'
import LanguageButton from './LanguageButton'
import ThemeButton from './ThemeButton'
import './header.css'

function Header() {
  const {t} = useTranslation()
  const {pathname} = useLocation()

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
  if (pathname !== '/') {
    return (
      <div className="h-16 px-8 bg-transparent flex justify-between items-center w-full">
        <div className="flex items-center">
          <Logo className="mr-8" />
          <HeaderLink to="/shuttle">{t('app')}</HeaderLink>
        </div>
        <div className="flex items-center">
          <WalletHub
            connectData={connectData}
            pendingTransactions={pendingTransactions}
          />
          <ThemeButton />
          <LanguageButton />
        </div>
      </div>
    )
  } else {
    return (
      <div className="h-16 px-8 bg-transparent flex justify-between items-center w-full">
        <DarkLogo />
        <LanguageButton />
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
