import PropTypes from 'prop-types'
import {SupportedChains, ChainConfig} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {Account, ConnectWallet} from '../index'

function AccountStatus({chain, className, size = 'medium'}) {
  const {address} = useWallet(chain)
  const getAccountCompStyle = () => {
    if (size === 'medium') return 'text-xs text-gray-80'
    if (size === 'large') return 'text-sm text-gray-80'
  }

  const getIconStyle = () => {
    if (size === 'medium') return 'mr-1.5'
    if (size === 'large') return 'mr-2'
  }
  const getIconSize = () => {
    if (size === 'medium') return 'w-3 h-3'
    if (size === 'large') return 'w-4 h-4'
  }
  // do not need to use wallet for some chains, for emample: btc
  if (!ChainConfig[chain].wallet) return null
  return (
    <div className={`${className}`}>
      {address ? (
        <Account
          chain={chain}
          showIcon={true}
          className={getAccountCompStyle()}
          iconClassName={getIconStyle()}
          iconSize={getIconSize()}
        />
      ) : (
        <ConnectWallet chain={chain} size={size} />
      )}
    </div>
  )
}

AccountStatus.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'large']),
}
export default AccountStatus
