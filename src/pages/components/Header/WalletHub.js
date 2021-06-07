import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {Dropdown, WrapIcon, Link} from '../../../components'
import {NotConnected, Connected} from '../../../assets/svg'
import {
  WalletConfig,
  KeyOfCfx,
  KeyOfMetaMask,
} from '../../../constants/chainConfig'
import {shortenAddress} from '../../../utils/address'
import {
  ArrowDownWithBg,
  ArrowUpWithBg,
  Close,
  ArrowRight,
} from '../../../assets/svg'

// const connectData = [
//   {type: 'portal', chain:'cfx', address: 'cfx:asfasfasd...'},
//   {type: 'metamask', chain:'eth', false, address: null},
// ]
function WalletHub({connectData, history = []}) {
  const [arrow, setArrow] = useState('down')
  const {t} = useTranslation()
  const connectedData = connectData.filter(data => !!data.address)
  const unConnectedData = connectData.filter(data => !data.address)
  const length = connectedData.length
  const onVisibleChange = visible => {
    if (visible) setArrow('top')
    if (arrow === 'top') setArrow('down')
  }
  let children
  if (length === 0) {
    children = (
      <div className="h-8 px-3 flex items-center border rounded-full border-primary text-primary">
        <NotConnected className="w-2 h-2 mr-1" />
        <span>{t('connectWallet')}</span>
      </div>
    )
  } else if (length === 1) {
    children = (
      <div className="h-8 bg-gray-20 flex items-center pl-3 rounded-full relative">
        {WalletConfig[unConnectedData[0].type].icon()}
        <div className="h-full border border-gray-20 flex items-center rounded-full ml-1 px-3">
          <Connected className="w-2 h-2 mr-1" />
          <span className="mr-1">{shortenAddress(connectData[0].address)}</span>
          <WrapIcon size="w-4 h-4">
            {arrow === 'down' ? <ArrowDownWithBg /> : <ArrowUpWithBg />}
          </WrapIcon>
        </div>
        {history.length > 0 && (
          <div className="flex items-center justify-center w-4 h-4 absolute top-0 right-0 rounded-full bg-error text-xs text-gray-0">
            {history.length > 99 ? '99+' : history.length}
          </div>
        )}
      </div>
    )
  } else if (length === 2) {
    children = (
      <div className="h-8 px-3 flex items-center rounded-full border border-gray-20">
        <Connected className="w-2 h-2 mr-1" />
        {WalletConfig[KeyOfCfx].icon()}
        {WalletConfig[KeyOfMetaMask].icon('-ml-1')}
        <WrapIcon size="w-4 h-4" className="ml-1">
          {arrow === 'down' ? <ArrowDownWithBg /> : <ArrowUpWithBg />}
        </WrapIcon>
      </div>
    )
  }

  return (
    <Dropdown
      trigger={['click']}
      overlay={<Popup />}
      onVisibleChange={visible => onVisibleChange(visible)}
    >
      {children}
    </Dropdown>
  )
}

WalletHub.propTypes = {
  connectData: PropTypes.object.isRequiredisRequired,
  history: PropTypes.array,
}

export default WalletHub

const Popup = ({onClick}) => {
  const {t} = useTranslation()
  return (
    <div className="w-60 shadow-3 rounded flex flex-col">
      <div className="p-3 bg-gray-0 flex flex-col">
        <div className="flex justify-between">
          <span className="text-gray-40 text-xs">{t('accounts')}</span>
          <Close
            className="w-4 h-4 text-gray-40"
            onClick={() => onClick & onClick()}
          />
        </div>
        {/* TODO: ConnectWallet */}
        <div></div>
      </div>
      <div className="p-3 bg-gray-10 flex flex-col">
        <div className="flex justify-between">
          <span className="text-gray-40 text-xs">{t('shuttleRecord')}</span>
          <div>
            <Link>{t('all')}</Link>
            <ArrowRight className="w-4 h-4 text-gray-40" />
          </div>
        </div>
        {/* TODO: history shuttle pending transactions, only display 5 max */}
        <div></div>
      </div>
    </div>
  )
}

Popup.propTypes = {
  onClick: PropTypes.func,
}
