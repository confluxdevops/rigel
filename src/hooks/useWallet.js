/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useMemo, useCallback, useEffect} from 'react'
import Big from 'big.js'
import {UnsupportedChainIdError} from '@web3-react/core'
import {ChainConfig, KeyOfMetaMask, KeyOfPortal} from '../constants/chainConfig'
import {
  useConnect as useConnectPortal,
  useTokenContract as useTokenContractPortal,
  useNativeTokenBalance as useNativeTokenBalancePortal,
} from './usePortal'
import {
  useConnect as useConnectWeb3,
  useTokenContract as useTokenContractWeb3,
  useNativeTokenBalance as useNativeTokenBalanceWeb3,
} from './useWeb3Network'
import {BigNumZero, IntervalTime, TypeAccountStatus} from '../constants'
import {IS_DEV} from '../utils'
import {checkCfxTokenAddress} from '../utils/address'
import {useIsCfxChain} from '../hooks'

export function useWallet(chain) {
  const connectObjPortal = useConnectPortal()
  const connectObjWeb3 = useConnectWeb3()
  let data = {}
  switch (ChainConfig[chain]?.wallet) {
    case KeyOfMetaMask:
      data = connectObjWeb3
      break
    case KeyOfPortal:
      data = connectObjPortal
      break
  }
  return data
}

/**
 * erc20/crc20 contract
 * @param {*} chain
 * @param {*} address
 * @returns
 */
export function useTokenContract(chain, tokenAddress) {
  const dataPortal = useTokenContractPortal(tokenAddress)
  const dataWeb3 = useTokenContractWeb3(tokenAddress)
  let data = {}
  switch (ChainConfig[chain]?.wallet) {
    case KeyOfMetaMask:
      data = dataWeb3
      break
    case KeyOfPortal:
      data = dataPortal
      break
  }
  return data
}

/**
 * call some method from contract and get the value
 * @param {*} contract
 * @param {*} method
 * @param {*} params
 * @returns
 */
export function useContractState(
  chain,
  tokenAddress,
  method,
  params,
  interval,
) {
  const contract = useTokenContract(chain, tokenAddress)
  const isNativeToken = useIsNativeToken(chain, tokenAddress)
  const [data, setData] = useState(null)
  const {errorType} = useAccountStatus(chain)
  const {chainId} = useWallet(chain)
  const isChainIdRight = useIsChainIdRight(chain, chainId)

  const getContractData = useCallback(
    params => {
      if (isNativeToken || !params[0] || !contract || !isChainIdRight) {
        setData(null)
      } else {
        contract[method](...params)
          .then(res => {
            setData(res)
          })
          .catch(() => {
            setData(null)
          })
      }
    },
    [isNativeToken, chain, tokenAddress, method],
  )

  useEffect(() => {
    if (!errorType) {
      if (interval) {
        getContractData(params)
        const timeInterval = setInterval(
          () => getContractData(params),
          interval,
        )
        return () => clearInterval(timeInterval)
      } else {
        getContractData(params)
      }
    }
  }, [...params, getContractData, interval])

  return data
}

export function useTokenBalance(chain, tokenAddress, params) {
  const balance = useContractState(
    chain,
    tokenAddress,
    'balanceOf',
    params,
    IntervalTime.fetchBalance,
  )
  return balance ? new Big(balance) : BigNumZero
}

export function useTokenAllowance(chain, tokenAddress, params) {
  const allowance = useContractState(chain, tokenAddress, 'allowance', params)
  return allowance || BigNumZero
}

export function useNativeTokenBalance(chain, address) {
  const balancePortal = useNativeTokenBalancePortal()
  const balanceWeb3 = useNativeTokenBalanceWeb3(address)
  return useMemo(() => {
    if (!chain || !address) return BigNumZero
    switch (ChainConfig[chain]?.wallet) {
      case KeyOfMetaMask:
        return balanceWeb3
      case KeyOfPortal:
        return balancePortal
      default:
        return BigNumZero
    }
  }, [address, balancePortal.toString(10), balanceWeb3.toString(10), chain])
}

/**
 * get balance of native token(for example:eth) or token balance(for example:usdt)
 * @param {*} chain
 * @param {*} address
 * @param {*} tokenAddress
 * @param {*} params
 * @returns
 */
export function useBalance(chain, address, tokenAddress, params) {
  const isNativeToken = useIsNativeToken(chain, tokenAddress)
  const nativeTokenBalance = useNativeTokenBalance(chain, address)
  const tokenBalance = useTokenBalance(chain, tokenAddress, params)
  return useMemo(
    () => (isNativeToken ? nativeTokenBalance : tokenBalance),
    [isNativeToken, nativeTokenBalance.toString(10), tokenBalance.toString(10)],
  )
}

/**
 * whether this address is native token in this chain
 * @param {*} chain
 * @param {*} address
 * @returns
 */
export function useIsNativeToken(chain, tokenAddress) {
  return useMemo(
    () => ChainConfig[chain].tokenName?.toLowerCase() === tokenAddress,
    [chain, tokenAddress],
  )
}

export function useAccountStatus(chain) {
  const {address, chainId, error} = useWallet(chain)
  const isChainIdRight = useIsChainIdRight(chain, chainId)
  return useMemo(() => {
    const wallet = ChainConfig[chain]?.wallet
    if (wallet) {
      if (address) {
        if (isChainIdRight) {
          return {type: TypeAccountStatus.success}
        }
        //error:wrong network
        return {type: TypeAccountStatus.error, errorType: 2}
      } else {
        if (error) {
          if (error instanceof UnsupportedChainIdError) {
            //error:wrong network
            return {type: TypeAccountStatus.error, errorType: 2}
          }
          //other error
          return {type: TypeAccountStatus.error, errorType: 1}
        }
        return {type: TypeAccountStatus.unconnected}
      }
    } else {
      //it means that this chain do not require the wallet, for example: btc
      return {type: TypeAccountStatus.success}
    }
  }, [Boolean(address), chain, Boolean(error), isChainIdRight])
}

export function useIsChainIdRight(chain, chainId) {
  const {address} = useWallet(chain)
  const {wallet, supportedChainIds} = ChainConfig[chain] || {}
  const isCfxChain = useIsCfxChain(chain)
  return useMemo(() => {
    if (isCfxChain) {
      return (
        wallet &&
        chainId == supportedChainIds?.[IS_DEV ? 'TESTNET' : 'MAINNET'] &&
        checkCfxTokenAddress(address, 'user')
      )
    }

    return (
      wallet && chainId == supportedChainIds?.[IS_DEV ? 'TESTNET' : 'MAINNET']
    )
  }, [chain, chainId, IS_DEV, address])
}
