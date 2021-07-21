import PropTypes from 'prop-types'
import {
  SupportedChains,
  WalletIcon,
  ChainConfig,
} from '../../../constants/chainConfig'
import {shortenAddress} from '../../../utils/address'
import {useWallet, useAccountStatus} from '../../../hooks/useWallet'
import {getChainIdRight} from '../../../utils'
import {TypeAccountStatus} from '../../../constants'
import {ConnectWallet} from '../../components'

function HeaderAccount({
  chain,
  className,
  iconClassName,
  showIcon = false,
  id,
  ...props
}) {
  const walletKey = ChainConfig[chain].wallet
  const {address, error, chainId, type, tryActivate} = useWallet(chain)
  const isChainIdRight = getChainIdRight(chain, chainId, address)
  const {type: accountType} = useAccountStatus(
    chain,
    address,
    error,
    isChainIdRight,
  )

  return (
    <div className={`flex items-center ${className}`} {...props}>
      {showIcon && <WalletIcon type={walletKey} className={iconClassName} />}
      {address && shortenAddress(chain, address, 'user', false)}
      {accountType === TypeAccountStatus.unconnected && (
        <ConnectWallet
          id={`${id}_connectWallet`}
          chain={chain}
          size="large"
          type={type}
          tryActivate={tryActivate}
        />
      )}
    </div>
  )
}

HeaderAccount.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  showIcon: PropTypes.bool,
  id: PropTypes.string,
}
export default HeaderAccount
