import PropTypes from 'prop-types'
function Button({
  onClick,
  className = '',
  children,
  size = 'medium',
  color = 'primary',
  variant = 'contained',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}) {
  const getDisabledStyle = () => {
    if (disabled) {
      if (variant === 'text')
        return 'bg-transparent text-gray-40 cursor-not-allowed'
      else return 'bg-gray-20 text-gray-40 cursor-not-allowed'
    }
    return ''
  }
  const getColorStyle = () => {
    if (disabled) return ''
    if (variant === 'text') {
      if (color === 'primary')
        return 'text-primary bg-transparent hover:text-primary-dark'
    } else if (variant === 'outlined') {
      if (color === 'primary')
        return 'border border-primary text-primary bg-white hover:border-primary-dark hover:text-primary-dark'
    } else if (variant === 'contained') {
      if (color === 'primary')
        return 'text-white bg-primary hover:bg-primary-dark'
    }
    return ''
  }
  const getSizeStyle = () => {
    if (size === 'large') return 'text-base h-15'
    if (size === 'medium') return 'text-sm h-12'
    if (size === 'small') return 'text-xs h-9'
    return ''
  }
  return (
    <button
      onClick={e => onClick && onClick(e)}
      disabled={disabled}
      className={`
      flex justify-center items-center focus:outline-none rounded 
      ${getDisabledStyle()} 
      ${getColorStyle()} 
      ${getSizeStyle()} 
      ${fullWidth ? 'w-full' : 'px-4'} 
      ${className}`}
      {...props}
    >
      {startIcon && <span className="inline-block mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="inline-block ml-2">{endIcon}</span>}
    </button>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
}

export default Button
