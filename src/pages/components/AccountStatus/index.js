import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {SupportedChains} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {Account, ConnectWallet} from '../index'

function AccountStatus({chain, size = 'medium', className = '', id}) {
  const {address} = useWallet(chain)
  console.log(address)
  const accountCompStyle = useMemo(() => {
    if (size === 'medium') return 'text-xs text-gray-80'
    if (size === 'large') return 'text-sm text-gray-80'
  }, [size])

  const iconStyle = useMemo(() => {
    if (size === 'medium') return 'mr-1.5 !w-3 !h-3'
    if (size === 'large') return 'mr-2 !w-4 !h-4'
  }, [size])

  return (
    <div className={`${className}`}>
      {address ? (
        <Account
          id={`${id}_account`}
          chain={chain}
          showIcon={true}
          className={accountCompStyle}
          iconClassName={iconStyle}
          address={address}
        />
      ) : (
        <ConnectWallet id={`${id}_connectWallet`} chain={chain} size={size} />
      )}
    </div>
  )
}

AccountStatus.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  size: PropTypes.oneOf(['medium', 'large']),
  className: PropTypes.string,
  id: PropTypes.string,
}
export default AccountStatus
