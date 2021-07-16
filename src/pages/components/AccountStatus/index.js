import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {SupportedChains} from '../../../constants/chainConfig'
import {Account, ConnectWallet, AccountError} from '../../components'
import {TypeAccountStatus, TypeConnectWallet} from '../../../constants'

function AccountStatus({
  chain,
  size = 'medium',
  className = '',
  id,
  onClose,
  tryActivate,
  type,
  accountType,
  errorType,
  address,
}) {
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
      {accountType === TypeAccountStatus.success && (
        <Account
          id={`${id}_account`}
          chain={chain}
          showIcon={true}
          className={accountCompStyle}
          iconClassName={iconStyle}
          address={address}
        />
      )}
      {accountType === TypeAccountStatus.unconnected && (
        <ConnectWallet
          id={`${id}_connectWallet`}
          chain={chain}
          size={size}
          type={type}
          tryActivate={tryActivate}
        />
      )}
      {accountType === TypeAccountStatus.error && (
        <AccountError chain={chain} errorType={errorType} onClose={onClose} />
      )}
    </div>
  )
}

AccountStatus.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  size: PropTypes.oneOf(['medium', 'large']),
  className: PropTypes.string,
  id: PropTypes.string,
  onClose: PropTypes.func,
  tryActivate: PropTypes.func,
  type: PropTypes.oneOf(Object.values(TypeConnectWallet)),
  accountType: PropTypes.oneOf(Object.values(TypeAccountStatus)),
  errorType: PropTypes.number,
  address: PropTypes.string,
}
export default AccountStatus
