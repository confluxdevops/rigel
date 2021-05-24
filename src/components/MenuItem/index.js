import PropTypes from 'prop-types'
import {selectedIcon as defaultSelectedIcon} from '../../assets/images'

function MenuItem({children, itemKey, selected, selectedIcon, icon, onClick}) {
  return (
    <div
      key={itemKey}
      aria-hidden="true"
      onClick={() => onClick && onClick(itemKey)}
      className={`w-50 h-12 ${
        icon ? 'px-4' : 'pl-12 pr-4'
      } flex items-center bg-gray-0 text-gray-100 hover:bg-gray-10 hover:text-primary`}
    >
      <div className="flex items-center flex-1">
        {icon && <span className="flex items-center mr-2 w-6 h-6">{icon}</span>}
        {children}
      </div>
      {selected && (
        <span className="flex items-center w-4 h-4">
          {selectedIcon ? (
            selectedIcon
          ) : (
            <img src={defaultSelectedIcon} alt="selected" />
          )}
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
}

export default MenuItem
