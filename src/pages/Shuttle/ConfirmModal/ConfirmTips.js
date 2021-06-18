import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import {SupportedChains, ChainConfig} from '../../../constants/chainConfig'
import {Checkbox, Button} from '../../../components'
import {Send} from '../../../assets/svg'
import {useIsBtcChain} from '../../../hooks'

function ConfirmTips({fromChain, toChain}) {
  const [checked, setChecked] = useState(false)
  const {t} = useTranslation()
  const isBtcChain = useIsBtcChain(toChain)

  //TODO
  // const approveButton = <Button>{t('approve', {token: symbol})}</Button>
  const sendButton = <Button startIcon={<Send />}>{t('send')}</Button>

  return (
    <div className="flex w-full flex-col mt-6 bg-gray-10 px-6 pb-6 pt-4 text-gray-80 text-xs">
      <span className="text-sm">{t('tips.mustKnow')}</span>
      <span>
        {isBtcChain ? t('tips.toBtcAddressTip') : t('tips.addressTip')}
      </span>
      {!isBtcChain && (
        <span>
          <Trans i18nKey="tips.forbiddenAddressTip" />
        </span>
      )}
      {!isBtcChain && (
        <span>
          <Trans
            i18nKey="tips.gasTip"
            values={{fromChain: ChainConfig[fromChain].shortName}}
          />
        </span>
      )}
      {isBtcChain && <span>{t('tips.toBtcGasTip')}</span>}
      {isBtcChain && <span>{t('tips.btcWaitLongTip')}</span>}
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
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ConfirmTips
