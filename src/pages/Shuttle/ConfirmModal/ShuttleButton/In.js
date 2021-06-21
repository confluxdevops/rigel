/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {convertDecimal} from '@cfxjs/data-format'
import {format} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js'
import Big from 'big.js'
import {BigNumber} from '@ethersproject/bignumber'
import {MaxUint256} from '@ethersproject/constants'
import {Logger} from '@ethersproject/logger'

import {Button, Loading} from '../../../../components'
import {Send} from '../../../../assets/svg'
import {SupportedChains, ChainConfig} from '../../../../constants/chainConfig'
import {ZeroAddrHex, TxReceiptModalType} from '../../../../constants'
import {
  useIsNativeToken,
  useTokenAllowance,
  useWallet,
} from '../../../../hooks/useWallet'
import {useContract, useTokenContract} from '../../../../hooks/useWeb3Network'
import DEPOSIT_RELAYER_ABI from '../../../../abi/depositRelayerABI.json'
import {calculateGasMargin} from '../../../../utils'
import {TransactionReceiptionModal} from '../../../components'

function ShuttleInButton({
  fromChain,
  toChain,
  fromToken,
  value,
  onClose,
  disabled,
}) {
  const drContractAddress =
    ChainConfig[fromChain].contractAddress?.depositRelayer
  const {t} = useTranslation()
  const [approveShown, setApproveShown] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [txModalShown, setTxModalShown] = useState(false)
  const [didMount, setDidMount] = useState(false)
  const [txModalType, setTxModalType] = useState(TxReceiptModalType.ongoing)
  const [txHash, setTxHash] = useState('')
  const {address, decimals, symbol} = fromToken
  const {address: fromAccountAddress} = useWallet(fromChain)
  const {address: toAccountAddress} = useWallet(toChain)
  const isNativeToken = useIsNativeToken(fromChain, address)
  const drContract = useContract(drContractAddress, DEPOSIT_RELAYER_ABI)
  const tokenContract = useTokenContract(address)
  const tokenAllownace = useTokenAllowance(fromChain, address, [
    fromAccountAddress,
    drContractAddress,
  ])
  useEffect(() => {
    setDidMount(true)
    if (!isNativeToken) {
      if (
        new Big(tokenAllownace ? tokenAllownace.toString(10) : 0).lt(
          new Big(value).times(`1e${decimals}`),
        )
      ) {
        setApproveShown(true)
      } else {
        setApproveShown(false)
      }
    }
    return () => {
      setDidMount(false)
    }
  }, [decimals, tokenAllownace, value, isNativeToken])

  function contractApprove(tokenContract, value, gas) {
    tokenContract
      .approve(drContractAddress, value, {
        gasLimit: gas ? calculateGasMargin(gas) : undefined,
      })
      .then(txResponse => {
        txResponse &&
          txResponse
            .wait()
            .then(() => {
              setIsApproving(false)
              setApproveShown(false)
            })
            .catch(() => {
              setIsApproving(false)
            })
      })
      .catch(() => {
        setIsApproving(false)
      })
  }

  const onApprove = async () => {
    if (isApproving) return
    setIsApproving(true)
    //MaxUint256
    tokenContract.estimateGas
      .approve(drContractAddress, MaxUint256)
      .then(gas => {
        contractApprove(tokenContract, MaxUint256, gas)
      })
      .catch(error => {
        if (
          error.code === Logger.errors.UNPREDICTABLE_GAS_LIMIT ||
          (error.data && error.data.code === -32000)
        ) {
          contractApprove(tokenContract, 0)
        } else {
          setIsApproving(false)
        }
      })
  }

  const onSubmit = async () => {
    if (isNativeToken) {
      let params = [
        format.hexAddress(toAccountAddress),
        ZeroAddrHex,
        {
          value: convertDecimal(value, 'multiply', decimals),
        },
      ]
      let gas = await drContract.estimateGas.deposit(
        params[0],
        params[1],
        params[2],
      )
      setTxModalShown(true)
      drContract
        .deposit(params[0], params[1], {
          ...params[2],
          gasLimit: calculateGasMargin(gas),
        })
        .then(data => {
          setTxHash(data.hash)
          setTxModalType(TxReceiptModalType.success)
        })
        .catch(error => {
          setTxModalType(TxReceiptModalType.error)
        })
    } else {
      let params = [
        address,
        format.hexAddress(toAccountAddress),
        ZeroAddrHex,
        convertDecimal(value, 'multiply', decimals),
        {
          value: BigNumber.from(0),
        },
      ]
      let gasDt = await drContract.estimateGas.depositToken(
        params[0],
        params[1],
        params[2],
        params[3],
        params[4],
      )
      setTxModalShown(true)
      drContract
        .depositToken(params[0], params[1], params[2], params[3], {
          ...params[4],
          gasLimit: calculateGasMargin(gasDt),
        })
        .then(data => {
          setTxHash(data.hash)
          setTxModalType(TxReceiptModalType.success)
        })
        .catch(error => {
          setTxModalType(TxReceiptModalType.error)
        })
    }
    onClose && onClose()
  }

  if (!didMount) {
    return null
  }

  return (
    <>
      {approveShown && (
        <Button onClick={onApprove} disabled={disabled}>
          {isApproving && <Loading size="w-6 h-6" />}
          {!isApproving && t('approve', {token: symbol})}
        </Button>
      )}
      {!approveShown && (
        <Button startIcon={<Send />} onClick={onSubmit} disabled={disabled}>
          {t('send')}
        </Button>
      )}
      <TransactionReceiptionModal
        type={txModalType}
        open={txModalShown}
        fromChain={fromChain}
        toChain={toChain}
        fromToken={fromToken}
        toToken={fromToken}
        value={value}
        txHash={txHash}
      />
    </>
  )
}

ShuttleInButton.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  disabled: PropTypes.bool,
}
export default ShuttleInButton
