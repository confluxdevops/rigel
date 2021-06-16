import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import {SupportedChains, ChainConfig} from '../../../constants/chainConfig'
import {Checkbox, Button} from '../../../components'
import {Send} from '../../../assets/svg'

function ConfirmTips({fromChain}) {
  const [checked, setChecked] = useState(false)
  const {t} = useTranslation()

  //TODO
  // const approveButton = <Button>{t('approve', {token: symbol})}</Button>
  const sendButton = <Button startIcon={<Send />}>{t('send')}</Button>

  return (
    <div className="flex w-110 flex-col mt-6 bg-gray-10 -mb-6 px-6 pb-6 pt-4 text-gray-80 text-xs">
      <span className="text-sm">{t('tipTitle')}</span>
      <span>{t('addressTip')}</span>
      <span>
        <Trans i18nKey="notContractTip" />
      </span>
      <span>
        <Trans
          i18nKey="gasTip"
          values={{fromChain: ChainConfig[fromChain].shortName}}
        />
      </span>
      <Checkbox
        className="mt-4 mb-6"
        checked={checked}
        onChange={() => {
          setChecked(!checked)
        }}
      >
        <span className="text-primary text-xs">{t('checkboxLabel')}</span>
      </Checkbox>
      {sendButton}
    </div>
  )
}

ConfirmTips.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ConfirmTips
