import {useEffect, useState, useMemo} from 'react'
import Big from 'big.js'
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
import {BigNumZero} from '../constants/index'
import {isChainIdRight} from '../utils'

export function useWallet(chain) {
  const connectObjPortal = useConnectPortal()
  const connectObjWeb3 = useConnectWeb3()
  let connectObj = {}
  switch (ChainConfig[chain]?.wallet) {
    case KeyOfMetaMask:
      connectObj = connectObjWeb3
      break
    case KeyOfPortal:
      connectObj = connectObjPortal
      break
  }
  return connectObj
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
export function useContractState(chain, tokenAddress, method, params) {
  const contract = useTokenContract(chain, tokenAddress)
  const isNativeToken = useIsNativeToken(chain, tokenAddress)
  const [data, setData] = useState(null)
  useEffect(() => {
    if (isNativeToken) {
      setData(null)
    } else {
      try {
        contract &&
          contract[method](...params).then(res => {
            setData(res)
          })
      } catch (error) {
        setData(null)
      }
    }
    //TODO: Array dependency always call?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, method, `${params}`, isNativeToken])
  return data
}

export function useTokenBalance(chain, tokenAddress, params) {
  let balance = useContractState(chain, tokenAddress, 'balanceOf', params)
  balance = balance ? new Big(balance) : BigNumZero
  return balance
}

export function useTokenAllowance(chain, tokenAddress, params) {
  const allowance = useContractState(chain, tokenAddress, 'allowance', params)
  return allowance
}

export function useNativeTokenBalance(chain, address) {
  const balancePortal = useNativeTokenBalancePortal()
  const balanceWeb3 = useNativeTokenBalanceWeb3(address)
  if (!chain || !address) return BigNumZero
  let balance = 0
  switch (ChainConfig[chain].wallet) {
    case KeyOfMetaMask:
      balance = balanceWeb3
      break
    case KeyOfPortal:
      balance = balancePortal
      break
  }
  return balance
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
