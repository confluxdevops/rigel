import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import config from '../../../constants/chainConfig'
import {ChainIcon} from '../../components'
function TokenNameAndIcon({token}) {
  const [subscriptShown, setSubscriptShown] = useState(false)
  const origin = token.origin
  useEffect(() => {
    if (config[origin]) {
      if (token.reference_name === config[origin].tokenName) {
        setSubscriptShown(false)
      } else {
        setSubscriptShown(true)
      }
    } else {
      setSubscriptShown(false)
    }
  }, [origin, token])
  return (
    <div className="w-4 h-4 relative">
      <img src={token && token.icon} alt="token icon" className="" />
      {subscriptShown && (
        <span className="absolute right-0 bottom-0">
          <ChainIcon chain={token.origin} className="w-2 h-2"></ChainIcon>
        </span>
      )}
    </div>
  )
}
TokenNameAndIcon.propTypes = {
  token: PropTypes.object.isRequired,
}
export default TokenNameAndIcon
