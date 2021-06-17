import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {SupportedChains} from '../../../constants/chainConfig'
import {TokenIcon, Account} from '../../components'

function ConfirmInfo({fromChain, toChain, token}) {
  const {t} = useTranslation()
  const {symbol} = token
  //TODO
  const shuttleFee = '0.00' //useShuttleFee()
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-40">{t('asset')}</span>
        <div className="flex">
          <TokenIcon size="medium" chain={fromChain} token={token} />
          <span className="text-gray-100 ml-1">{symbol}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-40">{t('destination')}</span>
        <Account
          showIcon={true}
          chain={toChain}
          className="text-gray-100"
          iconClassName="mr-1"
          iconSize="w-5 h-5"
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
  token: PropTypes.object.isRequired,
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ConfirmInfo
