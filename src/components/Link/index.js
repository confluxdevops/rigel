import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

function CustomLink({
  onClick,
  className = '',
  children,
  size = 'medium',
  disabled = false,
  startIcon,
  endIcon,
  ...props
}) {
  const getDisabledStyle = () => {
    if (disabled) {
      return 'bg-transparent text-gray-40 cursor-not-allowed'
    }
    return ''
  }

  const getColorStyle = () => {
    if (disabled) return ''
    return 'text-primary bg-transparent hover:text-primary-dark hover:underline'
  }

  const getSizeStyle = () => {
    if (size === 'large') return 'text-base h-12'
    if (size === 'medium') return 'text-sm h-10'
    if (size === 'small') return 'text-xs h-8'
    return ''
  }

  const getIconColor = () => {
    if (disabled) return 'text-gray-40'
    return 'text-primary hover:text-primary-dark'
  }

  const getIconSize = () => {
    if (size === 'large') return 'w-6 h-6'
    if (size === 'medium') return 'w-5 h-5'
    if (size === 'small') return 'w-4 h-4'
  }

  return (
    <Link
      onClick={e => onClick && onClick(e)}
      disabled={disabled}
      className={`
      flex justify-center items-center focus:outline-none rounded ${getDisabledStyle()} ${getColorStyle()} ${getSizeStyle()} ${className}`}
      {...props}
    >
      {startIcon && (
        <span
          className={`flex items-center mr-2 ${getIconColor()} ${getIconSize()}`}
        >
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span
          className={`flex items-center ml-2 ${getIconColor()} ${getIconSize()}`}
        >
          {endIcon}
        </span>
      )}
    </Link>
  )
}

CustomLink.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
}

export default CustomLink
