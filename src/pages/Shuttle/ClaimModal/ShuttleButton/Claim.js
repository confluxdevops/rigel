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

function ShuttleClaimButton({historyData}) {
  const {t} = useTranslation()
  const {toChain, tx_to, tx_input} = historyData
  const {library} = useActiveWeb3React()
  const {address} = useWallet(toChain)
  console.log('toAddress', address)
  const wallet = ChainConfig[toChain].wallet
  const onSubmit = async () => {
    if (wallet === KeyOfPortal && window.confluxJS) {
      //portal
      try {
        const estimateData = await window.confluxJS.estimateGasAndCollateral({
          from: address,
          data: tx_input,
          to: tx_to,
        })
        console.log('estimateData', estimateData)
        const txData = await window.confluxJS.sendTransaction({
          from: address,
          data: tx_input,
          to: tx_to,
          gas: calculateGasMargin(estimateData?.gasLimit, 0.5),
          storageLimit: calculateGasMargin(
            estimateData?.storageCollateralized,
            0.5,
          ),
        })
        console.log(txData)
      } catch (error) {
        console.log(error)
      }
    }
    if (wallet === KeyOfMetaMask && library) {
      //metamask
      const gas = await library.estimateGas({
        from: address,
        data: tx_input,
        to: tx_to,
      })
      console.log('gas', gas)
      library
        .getSigner()
        .sendTransaction({
          from: address,
          data: tx_input,
          to: tx_to,
          gasLimit: gas ? calculateGasMargin(gas) : undefined,
        })
        .then(data => {
          console.log('data', data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  return (
    <>
      <Button fullWidth onClick={onSubmit} size="large" id="shuttleIn">
        {t('send')}
      </Button>
    </>
  )
}

ShuttleClaimButton.propTypes = {
  historyData: PropTypes.object,
}

export default ShuttleClaimButton
