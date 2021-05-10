import PropTypes from 'prop-types'
import {ReactComponent as Close} from '../../assets/images/close.svg'

function Tag({
  onClose,
  className = '',
  children,
  size = 'medium',
  color = 'primary',
  icon,
  closeIcon,
  disabled = false,
  closable = false,
  ...props
}) {
  const getDisabledStyle = () => {
    if (disabled) {
      return 'bg-gray-20 text-gray-40 cursor-not-allowed'
    }
    return ''
  }

  const getColorStyle = () => {
    if (disabled) return ''
    if (color === 'primary') {
      return 'text-primary bg-primary-10 hover:border hover:border-primary'
    } else if (color === 'error') {
      return 'text-error bg-error-10 hover:border hover:border-error'
    }
    return ''
  }

  const getSizeStyle = () => {
    if (size === 'medium') return 'text-xs h-6 px-2'
    if (size === 'small') return 'text-2xs h-4 px-1'
    return ''
  }

  const getIconColor = () => {
    if (disabled) return 'text-gray-40'
    if (color === 'primary') return 'text-primary'
    if (color === 'error') return 'text-error'
  }

  const getIconSize = () => {
    if (size === 'medium') return 'w-3 h-3'
    if (size === 'small') return 'w-2 h-2'
  }

  return (
    <button
      disabled={disabled}
      className={`
      flex justify-center items-center focus:outline-none rounded ${getDisabledStyle()} ${getColorStyle()} ${getSizeStyle()} ${className}`}
      {...props}
    >
      {icon && (
        <span
          className={`flex items-center mr-1 ${getIconColor()} ${getIconSize()}`}
        >
          {icon}
        </span>
      )}
      {children}
      {closable && (
        <span
          aria-hidden="true"
          onClick={() => !disabled && onClose && onClose()}
          className={`flex items-center focus:outline-none ml-1 ${getIconColor()} ${getIconSize()}`}
        >
          {closeIcon ? closeIcon : <Close />}
        </span>
      )}
    </button>
  )
}

Tag.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  icon: PropTypes.node,
  closeIcon: PropTypes.node,
}

export default Tag
