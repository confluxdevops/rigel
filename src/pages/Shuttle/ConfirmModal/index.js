import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {Modal} from '../../../components'
import {SupportedChains} from '../../../constants/chainConfig'
import {useIsBtcChain} from '../../../hooks'

import SelectedChains from './SelectedChains'
import ConfirmInfo from './ConfirmInfo'
import ConfirmTips from './ConfirmTips'
import BtcConfirmTips from './BtcConfirmTips'

function ConfirmModal({open = false, fromChain, toChain, fromToken, value}) {
  const {t} = useTranslation()
  const fromIsBtcChain = useIsBtcChain(fromChain)
  const {symbol} = fromToken
  const content = (
    <div className="flex flex-col items-center">
      <span className="text-gray-100 text-xl">
        {value}
        <span className="text-sm ml-1">{symbol}</span>
      </span>
      <span className="inline-block -mt-1 mb-4 text-gray-40">
        {t('transactionAmount')}
      </span>
      <SelectedChains fromChain={fromChain} toChain={toChain} />
      <ConfirmInfo fromChain={fromChain} toChain={toChain} token={fromToken} />
      {fromIsBtcChain && <BtcConfirmTips />}
      {!fromIsBtcChain && (
        <ConfirmTips fromChain={fromChain} toChain={toChain} />
      )}
    </div>
  )
  return <Modal size="medium" open={open} content={content} />
}

ConfirmModal.propTypes = {
  open: PropTypes.bool,
  fromToken: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ConfirmModal
