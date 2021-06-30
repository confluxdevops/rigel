import {useState, useMemo, useCallback} from 'react'
import {useDeepCompareEffect, useEffectOnce} from 'react-use'
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
import {isChainIdRight} from '../utils'

export function useWallet(chain) {
  const connectObjPortal = useConnectPortal()
  const connectObjWeb3 = useConnectWeb3()

  return useMemo(() => {
    switch (ChainConfig[chain]?.wallet) {
      case KeyOfMetaMask:
        return connectObjWeb3
      case KeyOfPortal:
        return connectObjPortal
      default:
        return {}
    }
  }, [connectObjPortal, connectObjWeb3, chain])
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
  let data = null
  switch (ChainConfig[chain].wallet) {
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
  const getContractData = useCallback(() => {
    if (isNativeToken) {
      return null
    } else {
      contract &&
        contract[method](...params)
          .then(res => {
            return res
          })
          .catch(() => {
            return null
          })
    }
  }, [contract, method, params, isNativeToken])

  useDeepCompareEffect(() => {
    setData(getContractData())
  }, [contract, method, params, isNativeToken, getContractData])

  useEffectOnce(() => {
    if (interval) {
      const timeInterval = setInterval(() => {
        setData(getContractData())
      }, interval)
      return () => clearInterval(timeInterval)
    }
  })
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
  return useMemo(() => (balance ? new Big(balance) : BigNumZero), [balance])
}

export function useTokenAllowance(chain, tokenAddress, params) {
  const allowance = useContractState(chain, tokenAddress, 'allowance', params)
  return allowance
}

export function useNativeTokenBalance(chain, address) {
  const balancePortal = useNativeTokenBalancePortal()
  const balanceWeb3 = useNativeTokenBalanceWeb3(address)
  return useMemo(() => {
    if (!chain || !address) return BigNumZero
    switch (ChainConfig[chain].wallet) {
      case KeyOfMetaMask:
        return balanceWeb3
      case KeyOfPortal:
        return balancePortal
    }
  }, [address, balancePortal, balanceWeb3, chain])
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
    [isNativeToken, nativeTokenBalance, tokenBalance],
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

export function useIsChainInRightNetwork(chain) {
  const {address, chainId} = useWallet(chain)
  return useMemo(() => {
    if (ChainConfig[chain]?.wallet) {
      //this chain require wallet
      if (address) {
        return isChainIdRight(chain, chainId)
      } else {
        // this chian must use connect wallet,but the use has not already connected the wallet
        return false
      }
    } else {
      //this chain do not require the wallet
      return true
    }
  }, [address, chain, chainId])
}

export function useAccountStatus(chain) {
  const {address, chainId, error} = useWallet(chain)
  return useMemo(() => {
    const wallet = ChainConfig[chain]?.wallet
    if (wallet) {
      if (address) {
        if (isChainIdRight(chain, chainId)) {
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
  }, [address, chain, chainId, error])
}
