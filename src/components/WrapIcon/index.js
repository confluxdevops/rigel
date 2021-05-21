import PropTypes from 'prop-types'
import {circleBg, squareBg} from '../../assets/images'

function WrapIcon({type, size = 'w-6 h-6', children, className = ''}) {
  return (
    <div
      className={`${size} relative flex justify-center items-center ${className}`}
    >
      {type === 'circle' && (
        <img src={circleBg} alt="circle" className={size} />
      )}
      {type === 'square' && (
        <img src={squareBg} alt="square" className={size} />
      )}
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
