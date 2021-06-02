import PropTypes from 'prop-types'
import {
  selectedIcon as defaultSelectedIcon,
  disabledIcon,
} from '../../assets/images'
function MenuItem({
  children,
  itemKey,
  selected,
  selectedIcon,
  icon,
  onClick,
  disabled,
}) {
  const getStyle = () => {
    if (disabled)
      return 'bg-gray-20 text-gray-40 cursor-pointer cursor-not-allowed'
    return 'bg-gray-0 text-gray-100 cursor-poiniter hover:bg-gray-4 hover:text-primary'
  }
  return (
    <div
      key={itemKey}
      aria-hidden="true"
      onClick={() => !disabled && onClick && onClick(itemKey)}
      className={`w-50 h-12 ${
        icon ? 'px-4' : 'pl-12 pr-4'
      } flex items-center ${getStyle()}`}
    >
      <div className="flex items-center flex-1">
        {icon && <span className="flex items-center mr-2 w-6 h-6">{icon}</span>}
        {children}
      </div>
      {!disabled && selected && (
        <span className="flex items-center w-4 h-4">
          {selectedIcon ? (
            selectedIcon
          ) : (
            <img src={defaultSelectedIcon} alt="selected" />
          )}
        </span>
      )}
      {disabled && (
        <span className="flex items-center w-4 h-4">
          <img src={disabledIcon} alt="disabled" />
        </span>
      )}
    </div>
  )
}

MenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  itemKey: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  selectedIcon: PropTypes.node,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default MenuItem
