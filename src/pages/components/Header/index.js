// import {useEffect} from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {Logo, Sun} from '../../../assets/svg'
import WalletHub from './WalletHub'
import {WrapIcon} from '../../../components'
import './header.css'

function Header() {
  const {t} = useTranslation()
  //TODO: remove mock data
  const connectData = [
    {
      type: 'portal',
      chain: 'cfx',
      address: 'cfxtest:aame5p2tdzfsc3zsmbg1urwkg5ax22epg27cnu1rwm',
    },
    {type: 'metamask', chain: 'eth', address: null},
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
  return (
    <div className="h-16 px-8 bg-gray-0 flex justify-between items-center w-full">
      <div className="flex items-center">
        <Logo className="mr-8" />
        <HeaderLink to="/shuttle">{t('app')}</HeaderLink>
      </div>
      <div className="flex items-center">
        <WalletHub
          connectData={connectData}
          pendingTransactions={pendingTransactions}
        />
        <WrapIcon type="square" className="ml-3" size="w-7 h-7">
          <Sun />
        </WrapIcon>
        <WrapIcon type="square" className="ml-3" size="w-7 h-7">
          <Sun />
        </WrapIcon>
      </div>
    </div>
  )
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
