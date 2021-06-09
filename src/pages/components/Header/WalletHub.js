import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {Dropdown, WrapIcon, Link, Loading} from '../../../components'
import {NotConnected, Connected, NoPending} from '../../../assets/svg'
import {
  WalletConfig,
  ChainConfig,
  KeyOfMetaMask,
  KeyOfPortal,
} from '../../../constants/chainConfig'
import {shortenAddress} from '../../../utils/address'
import {
  ArrowDownWithBg,
  ArrowUpWithBg,
  Close,
  ArrowRight,
} from '../../../assets/svg'
import {AccountStatus} from '../../components'

function WalletHub({connectData, pendingTransactions = []}) {
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
        {WalletConfig[ChainConfig[unConnectedData[0].chain].wallet].icon()}
        <div className="h-full border border-gray-20 bg-gray-0 flex items-center rounded-full ml-1 px-3">
          <Connected className="w-2 h-2 mr-1" />
          <span className="mr-1">
            {shortenAddress(connectedData[0].chain, connectedData[0].address)}
          </span>
          <WrapIcon type="circle">
            {arrow === 'down' ? <ArrowDownWithBg /> : <ArrowUpWithBg />}
          </WrapIcon>
        </div>
        {pendingTransactions.length > 0 && (
          <div className="flex items-center justify-center w-4 h-4 absolute top-0 right-0 rounded-full bg-error text-xs text-gray-0">
            {pendingTransactions.length > 99
              ? '99+'
              : pendingTransactions.length}
          </div>
        )}
      </div>
    )
  } else if (length === 2) {
    children = (
      <div className="h-8 px-3 flex items-center rounded-full border border-gray-20">
        <Connected className="w-2 h-2 mr-1" />
        {WalletConfig[KeyOfPortal].icon()}
        {WalletConfig[KeyOfMetaMask].icon('-ml-1')}
        <WrapIcon type="circle" className="ml-1">
          {arrow === 'down' ? <ArrowDownWithBg /> : <ArrowUpWithBg />}
        </WrapIcon>
      </div>
    )
  }

  return (
    <Dropdown
      trigger={['click']}
      overlay={
        <Popup
          connectData={connectData}
          pendingTransactions={pendingTransactions}
        />
      }
      onVisibleChange={visible => onVisibleChange(visible)}
    >
      {children}
    </Dropdown>
  )
}

WalletHub.propTypes = {
  connectData: PropTypes.array.isRequired,
  pendingTransactions: PropTypes.array,
}

export default WalletHub

const Popup = ({onClick, connectData, pendingTransactions}) => {
  const {t} = useTranslation()
  const metamaskData = connectData.filter(
    data => ChainConfig[data.chain].wallet === KeyOfMetaMask,
  )[0]
  const portalData = connectData.filter(
    data => ChainConfig[data.chain].wallet === KeyOfPortal,
  )[0]
  const noPending = (
    <div className="flex flex-col items-center mt-1">
      <NoPending className="mb-1" />
      <span className="text-xs text-gray-40">
        Pending transactions will appear here
      </span>
    </div>
  )
  const displayPendingTransactions = pendingTransactions.slice(0, 5)
  return (
    <div className="w-60 shadow-common rounded flex flex-col">
      <div className="p-3 bg-gray-0 flex flex-col">
        <div className="flex justify-between">
          <span className="text-gray-40 text-xs">{t('accounts')}</span>
          <Close
            className="w-4 h-4 text-gray-40"
            onClick={() => onClick & onClick()}
          />
        </div>
        <div className="pt-3 flex flex-col">
          <AccountStatus
            chain={metamaskData.chain}
            size="large"
            className="mb-3"
          />
          <AccountStatus chain={portalData.chain} size="large" />
        </div>
      </div>
      <div className="p-3 bg-gray-10 flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-gray-40 text-xs">{t('shuttleRecord')}</span>
          <div className="flex items-center">
            <Link size="small" to="/history">
              {t('all')}
            </Link>
            <ArrowRight className="w-4 h-4 text-gray-40" />
          </div>
        </div>
        <div>
          {pendingTransactions.length === 0
            ? noPending
            : displayPendingTransactions.map((data, index) => {
                const {type, tokenSymbol, fromChain, toChain} = data
                return (
                  <div className="mt-3 flex items-center" key={index}>
                    <Loading size="w-3 h-3" className="mr-1" />
                    <span className="text-gray-80 text-xs">
                      {type === 'shuttle' &&
                        `${tokenSymbol} From ${ChainConfig[fromChain].shortName} To ${ChainConfig[toChain].shortName}`}
                      {type === 'approve' && `Approve ${tokenSymbol}`}
                    </span>
                  </div>
                )
              })}
        </div>
      </div>
    </div>
  )
}

Popup.propTypes = {
  onClick: PropTypes.func,
  connectData: PropTypes.array.isRequired,
  pendingTransactions: PropTypes.array,
}
