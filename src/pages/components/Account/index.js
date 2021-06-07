import PropTypes from 'prop-types'
import {SupportedChains} from '../../../constants/chainConfig'
import {WalletIcon} from '../../components'
import {useWallet} from '../../../hooks/useWallet'
import {shortenAddress} from '../../../utils/address'

function Account({chain, className, iconClassName, showIcon = false}) {
  const {address} = useWallet(chain)
  return (
    <div className={`flex justify-center ${className}`}>
      {showIcon && <WalletIcon chain={chain} className={iconClassName} />}
      {address ? shortenAddress(chain, address) : ''}
    </div>
  )
}

Account.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  showIcon: PropTypes.bool,
}
export default Account
