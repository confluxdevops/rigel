import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import queryString from 'query-string'
import {useHistory} from 'react-router-dom'
import {Button, Loading, Link} from '../../../components'
import {
  SupportedChains,
  ChainConfig,
  WalletConfig,
} from '../../../constants/chainConfig'
import {SendStatus} from '../../../constants'
import {SuccessFilled, ErrorOutlined} from '../../../assets/svg'

const FirstStep = ({
  fromChain,
  toChain,
  fromToken,
  sendStatus,
  setSendStatus,
  ...props
}) => {
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
      <Link>{t('viewInHistory')}</Link>
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
          <Button size="small" setSendStatus={setSendStatus} {...props}>
            {t('send')}
          </Button>
        )}
        {sendStatus === 'claim' && <SuccessFilled className="w-6 h-6" />}
      </div>
      {sendStatus && (
        <span className="ml-7 text-gray-40 text-xs inline-block pt-0.5">
          {sendStatus === SendStatus.ongoing &&
            t('confirm', {
              wallet: WalletConfig[ChainConfig[fromChain].wallet].name,
            })}
          {sendStatus === SendStatus.success && (
            <span className="flex items-center whitespace-pre">
              <Trans i18nKey="claimModal.takeTime" />
              {viewHistory}
            </span>
          )}
          {sendStatus === SendStatus.error && t('claimModal.clickSend')}
          {sendStatus === SendStatus.claim && viewHistory}
        </span>
      )}
      {sendStatus && sendStatus !== SendStatus.claim && (
        <div className="flex flex-col items-center pt-6 text-base">
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
  setSendStatus: PropTypes.func,
}

export default FirstStep
