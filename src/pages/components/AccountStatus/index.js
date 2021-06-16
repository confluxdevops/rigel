import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {SupportedChains} from '../../../constants/chainConfig'
import useWallet from '../../../hooks/useWallet'
import {Account, ConnectWallet} from '../index'

function AccountStatus({chain, className, size = 'medium'}) {
  const {address} = useWallet(chain)
  const accountCompStyle = useMemo(() => {
    if (size === 'medium') return 'text-xs text-gray-80'
    if (size === 'large') return 'text-sm text-gray-80'
  }, [size])

  const iconStyle = useMemo(() => {
    if (size === 'medium') return 'mr-1.5'
    if (size === 'large') return 'mr-2'
  }, [size])

  const iconSize = useMemo(() => {
    if (size === 'medium') return 'w-3 h-3'
    if (size === 'large') return 'w-4 h-4'
  }, [size])

  return (
    <div className={`${className}`}>
      {address ? (
        <Account
          chain={chain}
          showIcon={true}
          className={accountCompStyle}
          iconClassName={iconStyle}
          iconSize={iconSize}
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
