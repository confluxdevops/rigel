import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {formatAmount} from '@cfxjs/data-format'
import {SupportedChains} from '../../../constants/chainConfig'
import {useWallet, useAccountStatus} from '../../../hooks/useWallet'
import {Input, Tag} from '../../../components'
import {AccountStatus} from '../../components'
import TokenSelect from './TokenSelect'
import {getChainIdRight} from '../../../utils'
import {TypeAccountStatus} from '../../../constants'

function FromToken({
  fromChain,
  toChain,
  fromToken,
  onChooseToken,
  fromAddress,
  balanceVal,
  value,
  onInputChange,
  onMaxClick,
}) {
  const {t} = useTranslation()
  const {address, error, chainId, type, tryActivate} = useWallet(fromChain)
  const isChainIdRight = getChainIdRight(fromChain, chainId, address)
  const {type: accountType, errorType} = useAccountStatus(
    fromChain,
    address,
    error,
    isChainIdRight,
  )
  return (
    <div className="flex flex-col flex-1 border border-gray-10 rounded px-3 py-4 justify-between">
      <div className="flex justify-between">
        <TokenSelect
          id="fromToken"
          token={fromToken}
          type="from"
          fromChain={fromChain}
          toChain={toChain}
          onClick={() => onChooseToken && onChooseToken()}
        />
        <div className="h-6 flex items-center">
          <AccountStatus
            id="fromToken"
            chain={fromChain}
            size="medium"
            tryActivate={tryActivate}
            type={type}
            accountType={accountType}
            errorType={errorType}
            address={address}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Input
          id="shuttleAmount"
          bordered={false}
          value={value}
          onChange={onInputChange}
          placeholder="0.00"
          className="!text-gray-100 !text-lg !bg-transparent"
          width="w-32"
        />
        <div className="flex flex-col items-end">
          {fromAddress && (
            <span
              className="text-gray-40 text-xs inline-block mb-1"
              id="balance"
            >{`${t('balance')} ${
              accountType === TypeAccountStatus.success
                ? formatAmount(balanceVal)
                : '--'
            }`}</span>
          )}
          {fromAddress && (
            <Tag size="small" onClick={onMaxClick} id="max">
              {t('max')}
            </Tag>
          )}
        </div>
      </div>
    </div>
  )
}

FromToken.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.object,
  fromAddress: PropTypes.string,
  balanceVal: PropTypes.string,
  value: PropTypes.string,
  onChooseToken: PropTypes.func,
  onInputChange: PropTypes.func,
  onMaxClick: PropTypes.func,
}

export default FromToken
