import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import queryString from 'query-string'
import {useHistory} from 'react-router-dom'
import {Modal, Button, Loading, Link} from '../../../components'
import {
  SupportedChains,
  ChainConfig,
  WalletConfig,
  KeyOfMetaMask,
} from '../../../constants/chainConfig'
import {useIsNativeToken} from '../../../hooks/useWallet'
import useAddTokenToMetamask from '../../../hooks/useAddTokenToMetamask'
import {SendStatus, ClaimStatus} from '../../../constants'
import {
  Question,
  SuccessFilled,
  ErrorOutlined,
  SuccessOutlined,
  MetamaskLogo,
} from '../../../assets/svg'

const FirstStep = ({fromChain, toChain, fromToken, sendStatus, ...props}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const {display_symbol, address} = fromToken
  const viewHistory = (
    <div
      className="flex items-center cursor-pointer"
      aria-hidden="true"
      id="viewHistory1"
      onClick={() => {
        const pathWithQuery = queryString.stringifyUrl({
          url: '/history',
          query: {
            fromChain,
            toChain,
            fromTokenAddress: address,
          },
        })
        history.push(pathWithQuery)
      }}
    >
      <Link>{t('viewHistory')}</Link>
    </div>
  )
  return (
    <div className="w-full border rounded border-primary flex flex-col px-3 py-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <span className="flex w-5 h-5 rounded-full bg-primary items-center justify-center text-white text-xs">
            1
          </span>
          <span className="px-2 text-gray-80 text-base">
            {t('claimModal.sendFromToken', {
              fromTokenSymbol: display_symbol,
              fromChain: ChainConfig[fromChain].shortName,
            })}
          </span>
        </div>
        {/* TODO: replace with ShuttleButton */}
        {(!sendStatus || sendStatus === SendStatus.error) && (
          <Button {...props}>{t('send')}</Button>
        )}
        {sendStatus === 'claim' && <SuccessFilled className="w-6 h-6" />}
      </div>
      {sendStatus && (
        <span className="ml-10 text-gray-40 text-xs inline-block pt-0.5">
          {sendStatus === SendStatus.ongoing &&
            t('confirm', {
              wallet: WalletConfig[ChainConfig[fromChain].wallet].name,
            })}
          {sendStatus === SendStatus.success && (
            <span className="flex items-center">
              <Trans i18nKey="takeTime" />
              {viewHistory}
            </span>
          )}
          {sendStatus === SendStatus.error && t('claimModal.clickSend')}
          {sendStatus === SendStatus.claim && viewHistory}
        </span>
      )}
      {sendStatus && sendStatus !== SendStatus.claim && (
        <div className="flex flex-col justify-center pt-6 text-base">
          {/* big icon */}
          {sendStatus !== SendStatus.error && <Loading className="mb-3" />}
          {sendStatus === SendStatus.error && (
            <ErrorOutlined className="mb-3 w-12 h-12" />
          )}
          {/* text */}
          {sendStatus === SendStatus.ongoing && (
            <span className="text-gray-80">{t('waiting')}</span>
          )}
          {sendStatus === SendStatus.success && (
            <span className="text-gray-80">{t('process')}</span>
          )}
          {sendStatus === SendStatus.error && (
            <span className="text-error">{t('rejected')}</span>
          )}
        </div>
      )}
    </div>
  )
}
FirstStep.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.object.isRequired,
  sendStatus: PropTypes.oneOf(Object.values(SendStatus)).isRequired,
}

const SecondStep = ({
  fromChain,
  toChain,
  fromToken,
  toToken,
  sendStatus,
  claimStatus,
  ...props
}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const {address} = fromToken
  const {display_symbol} = toToken
  const enableClaim = sendStatus === SendStatus.claim
  const isNativeToken = useIsNativeToken(toChain, toToken?.address)
  const {addToken} = useAddTokenToMetamask(toToken)
  const onAddToken = () => {
    addToken()
  }
  return (
    <div
      className={`w-full border rounded ${
        enableClaim ? 'border-primary' : 'border-gray-20'
      } flex flex-col px-3 py-4`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <span
            className={`flex w-5 h-5 rounded-full ${
              enableClaim ? 'bg-primary' : 'bg-gray-20'
            } items-center justify-center ${
              enableClaim ? 'text-white' : 'text-gray-40'
            } text-xs`}
          >
            2
          </span>
          <span
            className={`px-2 ${
              enableClaim ? 'text-gray-80' : 'text-ray-40'
            } text-base`}
          >
            {t('claimModal.claimToToken', {
              toTokenSymbol: display_symbol,
              toChain: ChainConfig[toChain].shortName,
            })}
          </span>
        </div>
        {/* TODO: replace with ClaimButton */}
        {(!claimStatus || claimStatus === ClaimStatus.error) && (
          <Button disabled={!enableClaim} {...props}>
            {t('claim')}
          </Button>
        )}
      </div>
      {claimStatus && claimStatus !== ClaimStatus.success && (
        <span className="ml-10 text-gray-40 text-xs inline-block pt-0.5">
          {claimStatus === ClaimStatus.ongoing &&
            t('confirm', {
              wallet: WalletConfig[ChainConfig[toChain].wallet].name,
            })}
          {claimStatus === ClaimStatus.error && t('claimModal.clickClaim')}
        </span>
      )}
      {claimStatus && (
        <div className="flex flex-col justify-center pt-6 text-base">
          {/* big icon */}
          {claimStatus === ClaimStatus.ongoing && <Loading className="mb-3" />}
          {claimStatus === ClaimStatus.error && (
            <ErrorOutlined className="mb-3 w-12 h-12" />
          )}
          {claimStatus === ClaimStatus.success && (
            <SuccessOutlined className="mb-3 w-12 h-12" />
          )}
          {/* text */}
          {claimStatus === ClaimStatus.ongoing && (
            <span className="text-gray-80">{t('waiting')}</span>
          )}
          {claimStatus === ClaimStatus.success && (
            <span className="text-gray-80">{t('submitted')}</span>
          )}
          {claimStatus === ClaimStatus.error && (
            <span className="text-error">{t('rejected')}</span>
          )}
          {sendStatus === SendStatus.success && (
            <div
              className="flex items-center cursor-pointer mt-1 mb-4"
              aria-hidden="true"
              id="viewHistory1"
              onClick={() => {
                const pathWithQuery = queryString.stringifyUrl({
                  url: '/history',
                  query: {
                    fromChain,
                    toChain,
                    fromTokenAddress: address,
                  },
                })
                history.push(pathWithQuery)
              }}
            >
              <Link>{t('viewHistory')}</Link>
            </div>
          )}
          {sendStatus === SendStatus.success &&
            ChainConfig[toChain].wallet === KeyOfMetaMask &&
            !isNativeToken && (
              <Button
                variant="outlined"
                endIcon={<MetamaskLogo alt="metamaskLogo" />}
                // TODO: deal with metamask is not installed
                onClick={onAddToken}
              >
                {t('addTokenToMetaMask', {
                  tokenSymbol: display_symbol,
                })}
              </Button>
            )}
        </div>
      )}
    </div>
  )
}
SecondStep.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.object.isRequired,
  toToken: PropTypes.object.isRequired,
  sendStatus: PropTypes.oneOf(Object.values(SendStatus)).isRequired,
  claimStatus: PropTypes.oneOf(Object.values(ClaimStatus)).isRequired,
}

function ClaimModal({
  open = false,
  fromChain,
  toChain,
  fromToken,
  toToken,
  onClose,
  sendStatus,
  claimStatus,
  ...props
}) {
  const {t} = useTranslation()
  const content = (
    <div className="flex flex-col w-full">
      <span className="inine-block mb-3 text-gray-60">
        {t('claimModal.description')}
      </span>
      <FirstStep
        fromChain={fromChain}
        toChain={toChain}
        fromToken={fromToken}
        sendStatus={sendStatus}
        {...props}
      />
      <SecondStep
        toChain={toChain}
        toToken={toToken}
        sendStatus={sendStatus}
        claimStatus={claimStatus}
        {...props}
      />
      {/* TODO: add url */}
      <a
        href="www.baidu.com"
        target="_blank"
        className="mb-3 flex items-center"
      >
        <span className="text-gray-40 text-xs">
          {' '}
          {t('claimModal.claimTips')}
        </span>
        <Question className="w-3 h-3 text-gray-40" />
      </a>
    </div>
  )
  return (
    <Modal
      size="medium"
      open={open}
      title={t('claimModal.title')}
      content={content}
      onClose={onClose}
    />
  )
}

ClaimModal.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.object.isRequired,
  toToken: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  sendStatus: PropTypes.oneOf(Object.values(SendStatus)).isRequired,
  claimStatus: PropTypes.oneOf(Object.values(ClaimStatus)).isRequired,
}

export default ClaimModal
