import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {formatAmount} from '@cfxjs/data-format'
import {TokenIcon, Account} from '../components'
import {SupportedChains, ChainConfig} from '../../constants/chainConfig'
import {useIsNativeToken} from '../../hooks/useWallet'
import useAddTokenToMetamask from '../../hooks/useAddTokenToMetamask'
import {useIsCfxChain} from '../../hooks'
import {WrapIcon, Toast} from '../../components'
import {
  BgPlus,
  BgCopy,
  BgArrowRight,
  ErrorFilled,
  SuccessFilled,
  PendingFilled,
  ArrowUp,
} from '../../assets/svg'
import {ShuttleStatus} from '../../constants'
import Progress from './Progress'

function TokenInfo({toToken, fromChain, toChain, toAddress}) {
  const {symbol, address} = toToken
  const isNativeToken = useIsNativeToken(toChain, address)
  const {addToken, success} = useAddTokenToMetamask(toToken)
  const isToChainCfx = useIsCfxChain(toChain)
  const {t} = useTranslation()
  const [copied, setCopied] = useState(false)

  const onAddToken = e => {
    e.stopPropagation()
    if (success) return
    addToken()
  }

  return (
    <div className="flex items-center">
      <TokenIcon chain={toChain} size="large" token={toToken} />
      <div className="ml-2 flex flex-col">
        <span className="text-gray-100 font-medium mr-1 flex items-center">
          {symbol}
          {!isNativeToken && !isToChainCfx && (
            <WrapIcon
              type="circle"
              className="ml-1 cursor-pointer"
              onClick={e => onAddToken(e)}
            >
              <BgPlus />
            </WrapIcon>
          )}
          {isToChainCfx && (
            <WrapIcon type="circle" className="ml-1 cursor-pointer relative">
              <CopyToClipboard text={toAddress} onCopy={() => setCopied(true)}>
                <BgCopy />
              </CopyToClipboard>
              <Toast
                content={t('copiedSuccess')}
                open={copied}
                type="line"
                onClose={() => setCopied(false)}
                className="top-10 right-10"
              />
            </WrapIcon>
          )}
        </span>
        <span className="text-gray-40 text-xs">
          {t('history.chainDescription', {
            fromChain: ChainConfig[fromChain].shortName,
            toChain: ChainConfig[toChain].shortName,
          })}
        </span>
      </div>
    </div>
  )
}

TokenInfo.propTypes = {
  toToken: PropTypes.object,
  fromChain: PropTypes.oneOf(SupportedChains),
  toChain: PropTypes.oneOf(SupportedChains),
  toAddress: PropTypes.string,
}

function Status({status}) {
  const {t} = useTranslation()
  const icon = useMemo(() => {
    let icon = null
    const iconClassName = 'w-4 h-4 mr-1'
    switch (status) {
      case 'success':
        icon = <SuccessFilled className={iconClassName} />
        break
      case 'error':
        icon = <ErrorFilled className={iconClassName} />
        break
      case 'pending':
      case 'waiting':
        icon = <PendingFilled className={iconClassName} />
        break
    }
    return icon
  }, [status])

  const colorStyle = useMemo(() => {
    let color = ''
    switch (status) {
      case 'success':
        color = 'text-success'
        break
      case 'error':
        color = 'text-error'
        break
      case 'pending':
      case 'waiting':
        color = 'text-waiting'
        break
    }
    return color
  }, [status])

  return (
    <div className="flex">
      {icon}{' '}
      <span className={`text-xs ${colorStyle}`}>{t(`history.${status}`)}</span>
    </div>
  )
}

Status.propTypes = {
  status: PropTypes.oneOf(Object.keys(ShuttleStatus)),
}
function HistoryItem({historyItemData}) {
  const {
    toToken,
    fromChain,
    toChain,
    amount,
    status,
    fromAddress,
    toAddress,
    progress,
  } = historyItemData

  const t = useTranslation()

  const [detailShow, setDetailShow] = useState(false)

  return (
    <>
      <div
        aria-hidden="true"
        className="w-full h-16 flex items-center justify-between px-6 mt-2 cursor-pointer"
        onClick={() => setDetailShow(true)}
      >
        <TokenInfo
          fromChain={fromChain}
          toChain={toChain}
          toToken={toToken}
          toAddress={toAddress}
        />
        <div className="flex flex-col">
          <span className="text-base text-gray-100 text-right">
            {formatAmount(amount)}
          </span>
          <Status status={status} />
        </div>
      </div>
      <div
        className={`flex flex-col w-full items-center bg-gray-10 px-6 ${
          detailShow
            ? 'animate-slice-down transition-max-height max-h-44 origin-top'
            : 'animate-slice-up transition-max-height max-h-0 origin-bootom overflow-hidden'
        }`}
      >
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center py-4">
            {fromAddress ? (
              <Account
                chain={fromChain}
                address={fromAddress}
                iconClassName="w-5 h-5 mr-1"
                showIcon
              />
            ) : (
              t('history.fromBtcAddress')
            )}
            <WrapIcon type="circle" size="w-6 h-6" className="mx-2">
              <BgArrowRight />
            </WrapIcon>
            <Account
              chain={toChain}
              address={toAddress}
              iconClassName="w-5 h-5 mr-1"
              showIcon
            />
          </div>
          {progress && (
            <Progress
              progress={progress}
              fromChain={fromChain}
              toChain={toChain}
            />
          )}
        </div>
        <ArrowUp
          className="w-6 h-6 -mb-3 cursor-pointer"
          onClick={() => setDetailShow(false)}
        />
      </div>
    </>
  )
}

HistoryItem.propTypes = {
  historyItemData: PropTypes.object.isRequired,
}

export default HistoryItem
