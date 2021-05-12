import PropTypes from 'prop-types'
import {Loading as LoadingSvg} from '../../assets/svg'

function Loading({className = '', color = 'text-primary', size = 'w-12 h-12'}) {
  return <LoadingSvg className={`animate-spin ${size} ${color} ${className}`} />
}

export default Loading

Loading.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
}
