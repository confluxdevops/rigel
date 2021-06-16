import {useTranslation} from 'react-i18next'
import {EnglishIcon, ChineseIcon} from '../../../assets/svg'
import {WrapIcon} from '../../../components'

function LanguageButton() {
  const {i18n} = useTranslation()
  const {language} = i18n
  const onChangeLanguage = () => {
    if (language === 'en') {
      i18n.changeLanguage('zh-CN')
    } else if (language === 'zh-CN') {
      i18n.changeLanguage('en')
    }
  }
  return (
    <WrapIcon
      type="square"
      className="ml-3"
      size="w-7 h-7"
      onClick={onChangeLanguage}
    >
      {language === 'en' ? (
        <EnglishIcon className="text-gray-80" />
      ) : (
        <ChineseIcon className="text-gray-80" />
      )}
    </WrapIcon>
  )
}

export default LanguageButton
