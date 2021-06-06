import {useState} from 'react'
import PropTypes from 'prop-types'
import Config, {SupportedChains} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {ConnectWalletModal, WalletIcon} from '../../components'
import {TypeConnectWallet} from '../../../constants'

function ConnectWallet({size, chain, className = ''}) {
  const [open, setOpen] = useState(false)
  const {type, setType, tryActivate} = useWallet(chain)
  const walletConfig = Config[chain]?.wallet
  const getIcon = () => {
    return (
      <WalletIcon
        className={`${size === 'small' ? 'w-3' : 'w-4'}`}
        chain={chain}
      />
    )
  }
  const onConnect = () => {
    setOpen(true)
    if (type === TypeConnectWallet.loading) {
      tryActivate()
    }
    if (type === TypeConnectWallet.error) {
      setType(TypeConnectWallet.loading)
      tryActivate()
    }
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      {size === 'small' && (
        <div
          className={`inline-flex p-2 h-6 bg-primary-10 items-center rounded cursor-pointer ${className} `}
          onClick={onConnect}
          aria-hidden="true"
        >
          {getIcon()}
          <span className="ml-1.5 text-primary text-xs font-normal">
            Connect
          </span>
        </div>
      )}
      {size === 'big' && (
        <div
          className={`flex border rounded-sm w-52 h-9 justify-center items-center border-primary cursor-pointer ${className}`}
          onClick={onConnect}
          aria-hidden="true"
        >
          {getIcon()}
          <span className="ml-2 text-xs text-primary">
            Connect {walletConfig?.name}
          </span>
        </div>
      )}
      <ConnectWalletModal
        type={type}
        chain={chain}
        open={open}
        onClose={onClose}
      ></ConnectWalletModal>
    </>
  )
}
ConnectWallet.propTypes = {
  size: PropTypes.oneOf('small', 'big').isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
}

export default ConnectWallet
