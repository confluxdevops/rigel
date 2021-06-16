import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {ChainIcon, SupportedChains} from '../../../constants/chainConfig'

function TokenIcon({chain, token, size = 'medium'}) {
  const [subscriptShown, setSubscriptShown] = useState(false)
  useEffect(() => {
    if (token && token.origin !== chain) {
      setSubscriptShown(true)
    } else {
      setSubscriptShown(false)
    }
  }, [chain, token])
  return (
    <div className={`${size === 'large' ? 'w-7 h-7' : 'w-4 h-4'} relative`}>
      {/* TODO: some token has not icon property */}
      <img src={token && token.icon} alt="token icon" className="" />
      {subscriptShown && (
        <span className="absolute right-0 bottom-0">
          <ChainIcon
            chain={token && token.origin}
            size={`${size === 'large' ? 'w-3 h-3' : 'w-2 h-2'}`}
          />
        </span>
      )}
    </div>
  )
}

TokenIcon.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  token: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['medium', 'large']),
}

export default TokenIcon
