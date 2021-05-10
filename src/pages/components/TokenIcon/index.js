import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import config, {Hexagon} from '../../../constants/chainConfig'
const defaultHexagonIconLength = 8
function TokenIcon({token}) {
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
          <Hexagon
            chain={token.origin}
            width={defaultHexagonIconLength}
            height={defaultHexagonIconLength}
          ></Hexagon>
        </span>
      )}
    </div>
  )
}
TokenIcon.propTypes = {
  token: PropTypes.object.isRequired,
  hexagonIconLength: PropTypes.number,
}
export default TokenIcon
