import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import {Modal, Loading, Button} from '../../../components'
import Config, {
  SupportedChains,
  WalletMetaMask,
} from '../../../constants/chainConfig'
import {
  errorOutlind,
  successOutlind,
  metamaskLogo,
} from '../../../assets/images'
import useAddTokenToMetamask from '../../../hooks/useAddTokenToMetamask'

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
  if (type === 'ongoing') {
    const token = fromToken && fromToken.symbol
    const chain = Config[toChain].fullName
    content = (
      <div className="flex flex-col items-center">
        <span>
          <Trans
            i18nKey="shuttleInfo"
            value={value}
            token={token}
            chain={chain}
          >
            Shuttle <strong>{{value}}</strong> {{token}} to {{chain}}
          </Trans>
        </span>
        <div className="bg-warning-10 text-warning-dark px-8 py-3 mt-3 text-center">
          {t('confirm', {wallet: Config[fromChain].wallet})}
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
          href={Config[fromChain].scanTxUrl + txHash}
          target="_blank"
          rel="noreferrer"
        >
          {t('viewOnScan')}
        </a>
        {Config[toChain].wallet === WalletMetaMask && (
          <Button
            variant="outlined"
            fullWidth
            className="mt-4"
            endIcon={
              !success ? <img src={metamaskLogo} alt="metamaskLogo" /> : null
            }
            // TODO: deal with metamask is not installed
            onClick={addToken}
          >
            {success
              ? t('addedTokenToMetaMask', {token: toToken && toToken.symbol})
              : t('addTokenToMetaMask', {token: toToken && toToken.symbol})}
          </Button>
        )}
      </div>
    )
    return (
      <Modal
        open={open}
        title={t('submitted')}
        icon={<img src={successOutlind} alt="success" className="w-12 h-12" />}
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
        icon={<img src={errorOutlind} alt="error" className="w-12 h-12" />}
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
  fromToken: PropTypes.object,
  toToken: PropTypes.object,
  txHash: PropTypes.string,
}

export default TransactionReceiptionModal
