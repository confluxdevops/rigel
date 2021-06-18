import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {ChainIcon, SupportedChains} from '../../../constants/chainConfig'
import {TokenAlert} from '../../../assets/svg'

function TokenIcon({chain, token, size = 'medium', showAlarm = false}) {
  const {icon, origin, supported} = token
  const subscriptShown = useMemo(() => {
    if (origin !== chain) return true
    return false
  }, [chain, origin])

  const iconSize = useMemo(() => {
    if (size === 'large') return 'w-7 h-7'
    if (size === 'medium') return 'w-5 h-5'
    if (size === 'small') return 'w-4 h-4'
  }, [size])

  const subscriptSize = useMemo(() => {
    if (size === 'large') return '!w-3 !h-3'
    if (size === 'medium') return '!w-2.5 !h-2.5'
    if (size === 'small') return '!w-2 !h-2'
  }, [size])

  return (
    <div className={`${iconSize} relative`}>
      <img src={icon} alt="token icon" />
      {supported !== 1 && showAlarm && (
        <TokenAlert className="absolute -left-1 -top-1 w-4 h-4" />
      )}
      {subscriptShown && (
        <span className="absolute -right-0.5 -bottom-0.5">
          <ChainIcon chain={origin} className={`${subscriptSize}`} />
        </span>
      )}
    </div>
  )
}

TokenIcon.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  token: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showAlarm: PropTypes.bool,
}

export default TokenIcon
