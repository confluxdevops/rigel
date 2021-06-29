import {useMemo, useCallback} from 'react'
// import {useEffectOnce} from 'react-use'
import {useConfluxPortal} from '@cfxjs/react-hooks'
import {TypeConnectWallet} from '../constants/index'
import {ERC20_ABI} from '../abi'

export function useInstalled() {
  const {portalInstalled} = useConfluxPortal()
  return portalInstalled
}

export function useAddress() {
  const {address} = useConfluxPortal()
  return address
}

export function useConnectWalletType() {}

export function useConnect() {
  const {portalInstalled, address, login, error} = useConfluxPortal()
  const tryActivate = useCallback(() => login(), [login])
  const type = useMemo(() => {
    if (error) {
      return TypeConnectWallet.error
    } else {
      if (portalInstalled) {
        if (!address) {
          return TypeConnectWallet.loading
        }
        return TypeConnectWallet.success
      }
      return TypeConnectWallet.uninstalled
    }
  }, [address, error, portalInstalled])

  return useMemo(() => {
    return {
      type,
      tryActivate,
      error,
      address,
    }
  }, [type, tryActivate, error, address])
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
  }, [address, ABI, confluxJS])
}

export function useTokenContract(tokenAddress) {
  return useContract(tokenAddress, ERC20_ABI)
}

/**
 * get CFX balance from Conflux Network
 * @returns balance of account
 */
export function useNativeTokenBalance() {
  const {balances} = useConfluxPortal()
  return balances && balances[0]
}
