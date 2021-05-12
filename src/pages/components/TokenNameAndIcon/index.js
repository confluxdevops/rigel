import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {ChainIcon, SupportedChains} from '../../../constants/chainConfig'

function TokenNameAndIcon({chain, token}) {
  const [subscriptShown, setSubscriptShown] = useState(false)
  useEffect(() => {
    if (token && token.origin !== chain) {
      setSubscriptShown(true)
    } else {
      setSubscriptShown(false)
    }
  }, [chain, token])
  return (
    <div className="w-4 h-4 relative">
      <img src={token && token.icon} alt="token icon" className="" />
      {subscriptShown && (
        <span className="absolute right-0 bottom-0">
          <ChainIcon
            chain={token && token.origin}
            className="w-2 h-2"
          ></ChainIcon>
        </span>
      )}
    </div>
  )
}

TokenNameAndIcon.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  token: PropTypes.object.isRequired,
}

export default TokenNameAndIcon
