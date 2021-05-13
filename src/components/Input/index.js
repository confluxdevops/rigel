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
    if (errorMessage !== '') return 'border-error focus:border-error border'
    else return 'border-gray-20 focus:border-theme border'
  }

  return (
    <div
      className={`rounded px-3 ${width} ${getDisabledStyle()} ${getSizeStyle()} ${getBorderStyle()} ${className}`}
    >
      <div className="flex justify-between items-center">
        {prefix}
        <input
          value={value}
          onChange={e => onChange && onChange(e)}
          className="text-sm text-gray-80 placeholder-gray-40 border-0 p-0 outline-none"
          {...props}
        />
        {suffix}
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
