import PropTypes from 'prop-types'
import {
  errorFilled,
  successFilled,
  warningFilled,
  infoFilled,
} from '../../assets/images'
import {Close} from '../../assets/svg'

function Alert({
  type = 'success',
  icon,
  className = '',
  width = 'w-100',
  open = false,
  closable = true,
  closeIcon,
  onClose,
  content,
  bordered = false,
}) {
  const typeToIcon = {
    success: <img className="w-4 h-4 mr-2" src={successFilled} alt="success" />,
    info: <img className="w-4 h-4 mr-2" src={infoFilled} alt="info" />,
    error: <img className="w-4 h-4 mr-2" src={errorFilled} alt="error" />,
    warning: <img className="w-4 h-4 mr-2" src={warningFilled} alt="warning" />,
  }
  const IconComponent = typeToIcon[type]
  const getStyle = () => {
    if (type === 'info')
      return `bg-info-10 border ${bordered ? 'border-info' : 'border-info-10'}`
    if (type === 'warning')
      return `bg-warning-10 border ${
        bordered ? 'border-warning' : 'border-warning-10'
      }`
    if (type === 'error')
      return `bg-error-10 border ${
        bordered ? 'border-error' : 'border-error-10'
      }`
    if (type === 'success')
      return `bg-success-10 border ${
        bordered ? 'border-success' : 'border-success-10'
      }`
  }
  const onCloseClick = e => {
    e.stopPropagation()
    if (closable) {
      onClose && onClose(e)
    }
  }

  if (!open) return null

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${getStyle()} ${width} ${className}`}
    >
      <div className="flex items-center">
        {icon || IconComponent || null}
        <span className="text-gray-80">{content}</span>
      </div>
      {closable && (
        <span
          aria-hidden="true"
          onClick={e => onCloseClick(e)}
          className="w-4 h-4 text-gray-40"
        >
          {closeIcon ? closeIcon : <Close />}
        </span>
      )}
    </div>
  )
}

export default Alert

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  className: PropTypes.string,
  width: PropTypes.string,
  open: PropTypes.bool,
  closable: PropTypes.bool,
  bordered: PropTypes.bool,
  onClose: PropTypes.func,
  closeIcon: PropTypes.node,
  icon: PropTypes.node,
  content: PropTypes.oneOfType(PropTypes.string, PropTypes.node),
}
