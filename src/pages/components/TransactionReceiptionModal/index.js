import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import {Modal, Loading, Button} from '../../../components'
import {
  SupportedChains,
  ChainConfig,
  WalletConfig,
  KeyOfMetaMask,
} from '../../../constants/chainConfig'
import {ErrorOutlined, SuccessOutlined, MetamaskLogo} from '../../../assets/svg'
import useAddTokenToMetamask from '../../../hooks/useAddTokenToMetamask'

function TransactionReceiptionModal({
  open,
  type,
  toChain,
  fromChain,
  value,
  fromTokenInfo,
  toTokenInfo,
  txHash,
}) {
  const {t} = useTranslation()
  const {addToken, success} = useAddTokenToMetamask(toTokenInfo)
  let content
  if (type === 'ongoing') {
    const token = fromTokenInfo && fromTokenInfo.symbol
    const chain = ChainConfig[toChain].fullName
    content = (
      <div className="flex flex-col items-center">
        <span>
          <Trans i18nKey="shuttleInfo" values={{value, token, chain}} />
        </span>
        <div className="bg-warning-10 text-warning-dark px-8 py-3 mt-3 text-center">
          {t('confirm', {
            wallet: WalletConfig[ChainConfig[fromChain].wallet].name,
          })}
        </div>
      </div>
    )
    return (
      <Modal
        open={open}
        icon={<Loading />}
        title={t('waiting')}
        content={content}
      />
    )
  } else if (type === 'success') {
    content = (
      <div className="flex flex-1 flex-col items-center">
        <a
          className="text-primary text-xs font-medium no-underline"
          href={ChainConfig[fromChain].scanTxUrl + txHash}
          target="_blank"
          rel="noreferrer"
        >
          {t('viewOnScan')}
        </a>
        {ChainConfig[toChain].wallet === KeyOfMetaMask && (
          <Button
            variant="outlined"
            fullWidth
            className="mt-4"
            endIcon={!success ? <MetamaskLogo alt="metamaskLogo" /> : null}
            // TODO: deal with metamask is not installed
            onClick={addToken}
          >
            {success
              ? t('addedTokenToMetaMask', {
                  token: toTokenInfo && toTokenInfo.symbol,
                })
              : t('addTokenToMetaMask', {
                  token: toTokenInfo && toTokenInfo.symbol,
                })}
          </Button>
        )}
      </div>
    )
    return (
      <Modal
        open={open}
        title={t('submitted')}
        icon={<SuccessOutlined className="w-12 h-12" />}
        content={content}
      />
    )
  } else if (type === 'error') {
    content = (
      <div className="text-base font-medium text-error flex justify-center">
        {t('rejected')}
      </div>
    )
    return (
      <Modal
        open={open}
        icon={<ErrorOutlined className="w-12 h-12" />}
        content={content}
      />
    )
  }
  return <div>TransactionReceiptionModal</div>
}

TransactionReceiptionModal.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.oneOf(['ongoing', 'success', 'error']).isRequired,
  toChain: PropTypes.oneOf(SupportedChains),
  fromChain: PropTypes.oneOf(SupportedChains),
  value: PropTypes.string,
  fromTokenInfo: PropTypes.object,
  toTokenInfo: PropTypes.object,
  txHash: PropTypes.string,
}

export default TransactionReceiptionModal
