import PropTypes from 'prop-types'
import {Loading as LoadingSvg} from '../../assets/svg'

function Loading({className = '', size = 'w-12 h-12'}) {
  return (
    <LoadingSvg className={`animate-spin text-gray-20 ${size} ${className}`} />
  )
}

export default Loading

Loading.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
}
