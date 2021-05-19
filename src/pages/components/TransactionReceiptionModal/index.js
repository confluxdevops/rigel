import PropTypes from 'prop-types'
import {Modal, Loading, Button} from '../../../components'
import Config, {
  SupportedChains,
  WalletMetaMask,
} from '../../../constants/chainConfig'
import {errorOutlind, successOutlind} from '../../../assets/images'

function TransactionReceiptionModal({
  open,
  type,
  toChain,
  fromChain,
  value,
  fromTokenName,
  toTokenName,
  txHash,
}) {
  let content
  if (type === 'going') {
    content = (
      <div className="flex flex-col items-center">
        <span>
          Shuttle <span>{value}</span> {fromTokenName} to{' '}
          {Config[toChain].fullName}
        </span>
        <div className="bg-warning-10 text-warning-dark px-8 py-3 mt-3 text-center">
          confirm this transaction in {Config[fromChain].wallet}
        </div>
      </div>
    )
    return (
      <Modal
        open={open}
        icon={<Loading />}
        title="Waiting for confirmation"
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
          View on Scan
        </a>
        {Config[toChain].wallet === WalletMetaMask && (
          <Button variant="outlined" fullWidth className="mt-4">
            Add {toTokenName} to {Config[toChain].wallet}
          </Button>
        )}
      </div>
    )
    return (
      <Modal
        open={open}
        title="Transaction Submitted"
        icon={<img src={successOutlind} alt="success" className="w-12 h-12" />}
        content={content}
      />
    )
  } else if (type === 'error') {
    content = (
      <div className="text-base font-medium text-error flex justify-center">
        Transaction Rejected
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
  type: PropTypes.oneOf(['going', 'success', 'error']).isRequired,
  toChain: PropTypes.oneOf(SupportedChains),
  fromChain: PropTypes.oneOf(SupportedChains),
  value: PropTypes.string,
  fromTokenName: PropTypes.string,
  toTokenName: PropTypes.string,
  txHash: PropTypes.string,
}

export default TransactionReceiptionModal
