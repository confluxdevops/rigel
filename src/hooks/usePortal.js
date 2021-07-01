/* eslint-disable react-hooks/exhaustive-deps */
import {useMemo} from 'react'
import {useConfluxPortal} from '@cfxjs/react-hooks'
import {useConnectWalletStatus} from './useWallet'
import {ERC20_ABI} from '../abi'

export function useInstalled() {
  const {portalInstalled} = useConfluxPortal()
  return portalInstalled
}

export function useAddress() {
  const {address} = useConfluxPortal()
  return address
}

export function useConnect() {
  const {portalInstalled, address, error, login, chainId} = useConfluxPortal()
  const [type, setType] = useConnectWalletStatus(
    portalInstalled,
    address,
    error,
  )

  return {
    type,
    tryActivate: login,
    setType,
    error,
    address,
    chainId,
  }
}

export function useContract(address, ABI) {
  const {confluxJS} = useConfluxPortal()
  return useMemo(() => {
    if (!ABI || !confluxJS) return null
    try {
      return confluxJS.Contract({abi: ABI, address})
    } catch (error) {
      return null
    }
  }, [address, Boolean(confluxJS)])
}

export function useTokenContract(tokenAddress) {
  return useContract(tokenAddress || '', ERC20_ABI)
}

/**
 * get CFX balance from Conflux Network
 * @returns balance of account
 */
export function useNativeTokenBalance() {
  const {balances} = useConfluxPortal()
  return balances && balances[0]
}
