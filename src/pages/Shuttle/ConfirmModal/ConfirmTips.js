import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import {SupportedChains, ChainConfig} from '../../../constants/chainConfig'
import {Checkbox} from '../../../components'
import {useIsBtcChain, useIsCfxChain} from '../../../hooks'
import {ShuttleInButton} from './ShuttleButton'

function ConfirmTips({fromChain, toChain, fromToken, value, onClose}) {
  const [checked, setChecked] = useState(false)
  const {t} = useTranslation()
  const isBtcChain = useIsBtcChain(toChain)
  const isCfxChain = useIsCfxChain(toChain)
  //TODO: add shuttleOut
  let BtnComp = isCfxChain ? ShuttleInButton : ShuttleInButton

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
      <BtnComp
        fromChain={fromChain}
        toChain={toChain}
        fromToken={fromToken}
        value={value}
        onClose={onClose}
        disabled={!checked}
      />
    </div>
  )
}

ConfirmTips.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onClose: PropTypes.func,
}

export default ConfirmTips
