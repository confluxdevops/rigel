import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import {useClickAway} from 'react-use'
import {Close} from '../../assets/svg'

function Modal({
  className = '',
  width = 'w-70',
  open = false,
  closable = true,
  closeIcon,
  icon,
  onClose,
  title,
  content,
  actions,
  ...props
}) {
  const ref = useRef(null)

  const onCloseClick = e => {
    e.stopPropagation()
    if (closable) {
      onClose && onClose(e)
    }
  }

  useClickAway(ref, e => {
    onClose && onClose(e)
  })

  if (!open) return null
  return (
    <div
      ref={ref}
      className="fixed w-full h-full top-0 left-0 bg-black bg-opacity-60 transation flex justify-center items-center z-10"
    >
      <div
        className={`relative overflow-auto flex flex-col items-center z-20 ${width} rounded bg-white shadow-common p-6 ${className}`}
        {...props}
      >
        {closable && (
          <span
            aria-hidden="true"
            onClick={e => onCloseClick(e)}
            className="flex items-center absolute w-6 h-6 top-3 right-3 text-gray-60"
          >
            {closeIcon ? closeIcon : <Close />}
          </span>
        )}
        {icon && (
          <span className="flex items-center w-10 h-10 mb-4">{icon}</span>
        )}
        {title && (
          <div className="text-base text-gray-100 mb-1 font-medium">
            {title}
          </div>
        )}
        <div className="text-sm text-gray-60">{content}</div>
        {actions && (
          <div className="flex items-center w-full mt-4">{actions}</div>
        )}
      </div>
    </div>
  )
}

export default Modal

Modal.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
  title: PropTypes.string,
  open: PropTypes.bool,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  content: PropTypes.node,
  icon: PropTypes.node,
  closeIcon: PropTypes.node,
}
