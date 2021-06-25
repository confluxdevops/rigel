import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {SupportedChains} from '../../../constants/chainConfig'
import {TokenIcon, Account} from '../../components'
import {useIsCfxChain} from '../../../hooks'
import {useCustodianData} from '../../../hooks/useShuttleData'

function ConfirmInfo({fromChain, toChain, fromToken, toToken}) {
  const {symbol} = fromToken
  const {t} = useTranslation()
  const isFromChainCfx = useIsCfxChain(fromChain)
  const isToChainCfx = useIsCfxChain(toChain)
  const chainOfContract = isFromChainCfx ? toChain : fromChain
  const {in_fee, out_fee} = useCustodianData(chainOfContract, toToken)
  const shuttleFee = useMemo(
    () =>
      isToChainCfx
        ? in_fee
          ? in_fee.toString(10)
          : 0
        : out_fee
        ? out_fee.toString(10)
        : 0,
    [in_fee, isToChainCfx, out_fee],
  )

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-40">{t('asset')}</span>
        <div className="flex">
          <TokenIcon size="medium" chain={fromChain} token={fromToken} />
          <span className="text-gray-100 ml-1">{symbol}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-40">{t('destination')}</span>
        <Account
          showIcon={true}
          chain={toChain}
          className="text-gray-100"
          iconClassName="mr-1 !w-5 !h-5"
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-40">{t('shuttleFee')}</span>
        <span className="text-gray-100">{`${shuttleFee} ${symbol}`}</span>
      </div>
    </div>
  )
}

ConfirmInfo.propTypes = {
  fromToken: PropTypes.object.isRequired,
  toToken: PropTypes.object.isRequired,
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ConfirmInfo
