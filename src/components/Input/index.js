import {useState} from 'react'
import PropTypes from 'prop-types'

function Input({
  prefix,
  suffix,
  value,
  disabled,
  className = '',
  onChange,
  bordered = true,
  size = 'medium',
  width = 'w-60',
  errorMessage = '',
  ...props
}) {
  const [focused, setFocused] = useState(false)
  const getDisabledStyle = () => {
    if (disabled) return 'bg-gray-10 cursor-not-allowed'
    return 'bg-gray-0'
  }

  const getSizeStyle = () => {
    if (size === 'medium') return 'h-10'
    if (size === 'large') return 'h-12'
  }

  const getBorderStyle = () => {
    if (!bordered) return 'border-0'
    if (errorMessage !== '') return 'border-error border'
    else return `border ${focused ? 'border-primary' : 'border-gray-20'}`
  }

  return (
    <div>
      <div
        className={`flex justify-between items-center rounded ${width} ${getDisabledStyle()} ${getSizeStyle()} ${getBorderStyle()} ${className}`}
      >
        {prefix && (
          <div
            aria-hidden="true"
            onClick={() => setFocused(true)}
            className="pl-3 -mr-2"
          >
            <div className="text-gray-40 w-4 h-4">{prefix}</div>
          </div>
        )}
        <input
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange && onChange(e)}
          className="w-full h-full px-3 text-sm text-gray-80 placeholder-gray-40 border-0 rounded p-0 outline-none"
          {...props}
        />
        {suffix && (
          <div
            aria-hidden="true"
            onClick={() => setFocused(true)}
            className="pr-3 -ml-2"
          >
            <div className="text-gray-40 w-4 h-4">{suffix}</div>
          </div>
        )}
      </div>
      {errorMessage && (
        <div className="text-xs text-error mt-2">{errorMessage}</div>
      )}
    </div>
  )
}

Input.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'large']),
  errorMessage: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  disabled: PropTypes.bool,
  bordered: PropTypes.bool,
}

export default Input
