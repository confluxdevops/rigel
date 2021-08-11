/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'

import {Button} from '../../../../components'
import {
  KeyOfMetaMask,
  KeyOfPortal,
  ChainConfig,
} from '../../../../constants/chainConfig'
import {useWallet} from '../../../../hooks/useWallet'
import {calculateGasMargin} from '../../../../utils'
import {useActiveWeb3React} from '../../../../hooks/useWeb3Network'
import {useTxState} from '../../../../state/transaction'
import {ClaimStatus} from '../../../../constants'

function ShuttleClaimButton({hash, setClaimStatus, disabled}) {
  const {t} = useTranslation()
  const {transactions} = useTxState()
  const txData = transactions?.[hash]
  const {toChain, tx_to, tx_input} = txData || {}
  const {library} = useActiveWeb3React()
  const {address} = useWallet(toChain)
  const wallet = ChainConfig[toChain]?.wallet
  const onSubmit = async () => {
    setClaimStatus(ClaimStatus.ongoing)
    if (wallet === KeyOfPortal && window.confluxJS) {
      //portal
      try {
        const estimateData = await window.confluxJS.estimateGasAndCollateral({
          from: address,
          data: tx_input,
          to: tx_to,
        })
        await window.confluxJS.sendTransaction({
          from: address,
          data: tx_input,
          to: tx_to,
          gas: calculateGasMargin(estimateData?.gasLimit, 0.5),
          storageLimit: calculateGasMargin(
            estimateData?.storageCollateralized,
            0.5,
          ),
        })
        setClaimStatus(ClaimStatus.success)
      } catch (error) {
        setClaimStatus(ClaimStatus.error)
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
        .then(() => {
          setClaimStatus(ClaimStatus.success)
        })
        .catch(() => {
          setClaimStatus(ClaimStatus.error)
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
    </>
  )
}

ShuttleClaimButton.propTypes = {
  hash: PropTypes.string,
  setClaimStatus: PropTypes.func,
  disabled: PropTypes.bool,
}

export default ShuttleClaimButton
