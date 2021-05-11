import PropTypes from 'prop-types'
import circle from '../../assets/images/circle.svg'
import square from '../../assets/images/square.svg'

function WrapIcon({type, size = 'w-6 h-6', children, className = ''}) {
  return (
    <div
      className={`${size} relative flex justify-center items-center ${className}`}
    >
      {type === 'circle' && <img src={circle} alt="circle" className={size} />}
      {type === 'square' && <img src={square} alt="square" className={size} />}
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
