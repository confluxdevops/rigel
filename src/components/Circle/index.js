import PropTypes from 'prop-types'

function Circle({color = 'bg-gray-80', size = 'w-1 h-1', className = ''}) {
  return (
    <div
      className={`rounded-full mr-1 flex-shrink-0 ${color} ${size} ${className}`}
    />
  )
}

Circle.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
}

export default Circle
