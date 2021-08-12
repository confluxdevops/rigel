/* eslint-disable react-hooks/exhaustive-deps */
import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'

import {Button} from '../../../components'
import {
  KeyOfMetaMask,
  KeyOfPortal,
  ChainConfig,
} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {calculateGasMargin} from '../../../utils'
import {useTxState} from '../../../state/transaction'
import {
  ClaimStatus,
  ClaimButtonType,
  TxReceiptModalType,
} from '../../../constants'
import {TransactionReceiptionModal} from '../../components'

function ShuttleClaimButton({hash, type, setClaimStatus, disabled, library}) {
  const {t} = useTranslation()
  const {transactions} = useTxState()
  const txData = transactions?.[hash]
  const {fromChain, toChain, tx_to, tx_input, fromToken, toToken} = txData || {}
  const {address} = useWallet(toChain)
  const wallet = ChainConfig[toChain]?.wallet
  const [txModalShow, setTxModalShow] = useState(false)
  const [txModalType, setTxModalType] = useState(TxReceiptModalType.ongoing)
  const [txHash, setTxHash] = useState('')
  const onSubmit = async () => {
    type === ClaimButtonType.common && setTxModalShow(true)
    setClaimStatus && setClaimStatus(ClaimStatus.ongoing)
    if (wallet === KeyOfPortal && window.confluxJS) {
      //portal
      try {
        const estimateData = await window.confluxJS.estimateGasAndCollateral({
          from: address,
          data: tx_input,
          to: tx_to,
        })
        const data = await window.confluxJS.sendTransaction({
          from: address,
          data: tx_input,
          to: tx_to,
          gas: calculateGasMargin(estimateData?.gasLimit, 0.5),
          storageLimit: calculateGasMargin(
            estimateData?.storageCollateralized,
            0.5,
          ),
        })
        setClaimStatus && setClaimStatus(ClaimStatus.success)
        type === ClaimButtonType.common &&
          setTxModalType(TxReceiptModalType.success)
        setTxHash(data?.hash)
      } catch (error) {
        setClaimStatus && setClaimStatus(ClaimStatus.error)
        type === ClaimButtonType.common &&
          setTxModalType(TxReceiptModalType.error)
      }
    }
    if (wallet === KeyOfMetaMask && library) {
      //metamask
      const gas = await library.estimateGas({
        from: address,
        data: tx_input,
        to: tx_to,
      })
      library
        .getSigner()
        .sendTransaction({
          from: address,
          data: tx_input,
          to: tx_to,
          gasLimit: gas ? calculateGasMargin(gas) : undefined,
        })
        .then(data => {
          setClaimStatus && setClaimStatus(ClaimStatus.success)
          type === ClaimButtonType.common &&
            setTxModalType(TxReceiptModalType.success)
          setTxHash(data?.hash)
        })
        .catch(() => {
          setClaimStatus && setClaimStatus(ClaimStatus.error)
          type === ClaimButtonType.common &&
            setTxModalType(TxReceiptModalType.error)
        })
    }
  }
  return (
    <>
      <Button
        onClick={onSubmit}
        size="small"
        id="shuttleIn"
        disabled={disabled}
      >
        {t('claim')}
      </Button>
      {type === ClaimButtonType.common && txModalShow && (
        <TransactionReceiptionModal
          type={txModalType}
          open={txModalShow}
          fromChain={fromChain}
          toChain={toChain}
          fromToken={fromToken}
          toToken={toToken}
          txHash={txHash}
          value={0}
          isClaim={true}
          library={library}
          onClose={() => {
            setTxModalShow(false)
          }}
        />
      )}
    </>
  )
}

ShuttleClaimButton.propTypes = {
  hash: PropTypes.string.isRequired,
  setClaimStatus: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(ClaimButtonType)).isRequired,
  library: PropTypes.object,
}

export default ShuttleClaimButton
