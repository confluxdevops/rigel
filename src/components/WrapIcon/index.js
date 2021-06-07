import PropTypes from 'prop-types'
import {CircleBg, SquareBg} from '../../assets/svg'

function WrapIcon({type, size = 'w-6 h-6', children, className = ''}) {
  return (
    <div
      className={`${size} relative flex justify-center items-center ${className}`}
    >
      {type === 'circle' && <CircleBg className={size} />}
      {type === 'square' && <SquareBg className={size} />}
      <div
        className={`${size} absolute inset-0 flex justify-center items-center text-gray-40`}
      >
        {children}
      </div>
    </div>
  )
}

export default WrapIcon

WrapIcon.propTypes = {
  type: PropTypes.oneOf(['circle', 'square']).isRequired,
  size: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
}
