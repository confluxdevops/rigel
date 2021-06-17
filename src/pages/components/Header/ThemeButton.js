import {Sun, Moon} from '../../../assets/svg'
import useTheme from '../../../hooks/useTheme'
import {WrapIcon} from '../../../components'

function LanguageButton() {
  const {value, toggle} = useTheme()

  return (
    <WrapIcon type="square" className="ml-3" size="w-7 h-7" onClick={toggle}>
      {value ? (
        <Moon className="text-gray-80" />
      ) : (
        <Sun className="text-gray-80" />
      )}
    </WrapIcon>
  )
}

export default LanguageButton
