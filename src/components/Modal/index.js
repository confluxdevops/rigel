import React from 'react'
import {useRef} from 'react'
import PropTypes from 'prop-types'
import {useClickAway} from 'react-use'
import {Close} from '../../assets/svg'

function Modal({
  className = '',
  width,
  open = false,
  closable = true,
  closeIcon,
  icon,
  onClose,
  title,
  content,
  actions,
  size = 'small',
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
        className={`relative overflow-auto flex flex-col items-center z-20 ${
          width ? width : size === 'medium' ? 'w-110' : 'w-70'
        } rounded bg-white shadow-common p-6 ${className}`}
        {...props}
      >
        {closable && (
          <span
            aria-hidden="true"
            onClick={e => onCloseClick(e)}
            className={`flex items-center absolute ${
              size === 'medium' ? 'w-6 h-6' : 'w-4 h-4'
            } top-3 right-3 text-gray-40`}
          >
            {closeIcon ? closeIcon : <Close />}
          </span>
        )}
        {icon && (
          <span className="flex items-center w-12 h-12 mb-3">{icon}</span>
        )}
        {title && (
          <div className="text-base text-gray-100 mb-2 font-medium">
            {title}
          </div>
        )}
        <div className="text-gray-60 w-full">{content}</div>
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
  size: PropTypes.oneOf(['small', 'medium']),
  width: PropTypes.string,
  title: PropTypes.string,
  open: PropTypes.bool,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  content: PropTypes.node.isRequired,
  icon: PropTypes.PropTypes.node,
  closeIcon: PropTypes.node,
}
