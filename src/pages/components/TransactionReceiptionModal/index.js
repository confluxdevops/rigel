import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import {Modal, Loading, Button, Link} from '../../../components'
import {
  SupportedChains,
  ChainConfig,
  WalletConfig,
  KeyOfMetaMask,
} from '../../../constants/chainConfig'
import {ErrorOutlined, SuccessOutlined, MetamaskLogo} from '../../../assets/svg'
import useAddTokenToMetamask from '../../../hooks/useAddTokenToMetamask'
import {TxReceiptModalType} from '../../../constants'

function TransactionReceiptionModal({
  open,
  type,
  toChain,
  fromChain,
  value,
  fromToken,
  toToken,
  txHash,
}) {
  const {t} = useTranslation()
  const {addToken, success} = useAddTokenToMetamask(toToken)
  let content
  const onAddToken = () => {
    if (success) return
    addToken()
  }
  if (type === 'ongoing') {
    const token = fromToken && fromToken.symbol
    const chain = ChainConfig[toChain].fullName
    content = (
      <div className="flex flex-col items-center">
        <span>
          <Trans i18nKey="shuttleInfo" values={{value, token, chain}} />
        </span>
        <div className="bg-warning-10 text-warning-dark w-full px-6 pt-3 pb-6 mt-4 text-center">
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
        className="!pb-0 !px-0"
      />
    )
  } else if (type === 'success') {
    content = (
      <div className="flex flex-1 flex-col items-center">
        <Link href={ChainConfig[fromChain].scanTxUrl + txHash} target="_blank">
          {t('viewOnScan')}
        </Link>
        {ChainConfig[fromChain].wallet === KeyOfMetaMask && (
          <Button
            variant="outlined"
            fullWidth
            className="mt-4"
            endIcon={!success ? <MetamaskLogo alt="metamaskLogo" /> : null}
            disabled={success}
            // TODO: deal with metamask is not installed
            onClick={onAddToken}
          >
            {success
              ? t('addedTokenToMetaMask', {
                  token: toToken && toToken.symbol,
                })
              : t('addTokenToMetaMask', {
                  token: toToken && toToken.symbol,
                })}
          </Button>
        )}
      </div>
    )
    return (
      <Modal
        open={open}
        title={t('submitted')}
        icon={<SuccessOutlined />}
        content={content}
      />
    )
  } else if (type === 'error') {
    content = (
      <div className="text-base font-medium text-error flex justify-center">
        {t('rejected')}
      </div>
    )
    return <Modal open={open} icon={<ErrorOutlined />} content={content} />
  }
  return <div>TransactionReceiptionModal</div>
}

TransactionReceiptionModal.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(TxReceiptModalType)).isRequired,
  toChain: PropTypes.oneOf(SupportedChains),
  fromChain: PropTypes.oneOf(SupportedChains),
  value: PropTypes.string,
  fromToken: PropTypes.object,
  toToken: PropTypes.object,
  txHash: PropTypes.string,
}

export default TransactionReceiptionModal
