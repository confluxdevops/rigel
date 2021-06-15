// import {useEffect} from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {Logo, Sun, Moon, EnglishIcon, ChineseIcon} from '../../../assets/svg'
import useTheme from '../../../hooks/useTheme'
import WalletHub from './WalletHub'
import {WrapIcon} from '../../../components'
import './header.css'

function Header() {
  const {t, i18n} = useTranslation()
  const {value, toggle} = useTheme()

  const {language} = i18n
  const onChangeLanguage = () => {
    if (language === 'en') {
      i18n.changeLanguage('zh-CN')
    } else if (language === 'zh-CN') {
      i18n.changeLanguage('en')
    }
  }
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
        <WrapIcon
          type="square"
          className="ml-3"
          size="w-7 h-7"
          onClick={toggle}
        >
          {value ? (
            <Moon className="text-gray-80" />
          ) : (
            <Sun className="text-gray-80" />
          )}
        </WrapIcon>
        <WrapIcon
          type="square"
          className="ml-3"
          size="w-7 h-7"
          onClick={onChangeLanguage}
        >
          {language === 'en' ? (
            <EnglishIcon className="text-gray-80" />
          ) : (
            <ChineseIcon className="text-gray-80" />
          )}
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
