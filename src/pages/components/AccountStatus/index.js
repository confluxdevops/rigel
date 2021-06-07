import PropTypes from 'prop-types'
import {SupportedChains} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {Account, ConnectWallet} from '../index'

function AccountStatus({chain, className, size = 'small'}) {
  const {address} = useWallet(chain)
  const getAccountCompStyle = () => {
    if (size === 'small') return 'text-xs text-gray-80'
    if (size === 'big') return 'text-sm text-gray-80'
  }

  const getIconStyle = () => {
    if (size === 'small') return 'mr-1.5 w-3'
    if (size === 'big') return 'mr-2 w-4'
  }
  return (
    <div className={`${className}`}>
      {address ? (
        <Account
          chain={chain}
          showIcon={true}
          className={getAccountCompStyle()}
          iconClassName={getIconStyle()}
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
  size: PropTypes.oneOf(['small', 'big']),
}
export default AccountStatus
