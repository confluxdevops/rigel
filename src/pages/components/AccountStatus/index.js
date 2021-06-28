import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {SupportedChains} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {Account, ConnectWallet} from '../index'

function AccountStatus({chain, size = 'medium', id}) {
  const {address} = useWallet(chain)
  const accountCompStyle = useMemo(() => {
    if (size === 'medium') return 'text-xs text-gray-80'
    if (size === 'large') return 'text-sm text-gray-80'
  }, [size])

  const iconStyle = useMemo(() => {
    if (size === 'medium') return 'mr-1.5 !w-3 !h-3'
    if (size === 'large') return 'mr-2 !w-4 !h-4'
  }, [size])

  return address ? (
    <Account
      id={`${id}_account`}
      chain={chain}
      showIcon={true}
      className={accountCompStyle}
      iconClassName={iconStyle}
    />
  ) : (
    <ConnectWallet id={`${id}_connectWallet`} chain={chain} size={size} />
  )
}

AccountStatus.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  size: PropTypes.oneOf(['medium', 'large']),
  id: PropTypes.string,
}
export default AccountStatus
