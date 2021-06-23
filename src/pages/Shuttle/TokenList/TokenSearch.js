import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {Input} from '../../../components'

function TokenSearch({value, onChange}) {
  const {t} = useTranslation()
  return (
    <Input
      width="w-full"
      value={value || ''}
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={t('searchTokenPlaceholder')}
    />
  )
}

TokenSearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
}

export default TokenSearch