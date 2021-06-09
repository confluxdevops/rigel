import {useEffect, useState, useMemo} from 'react'
import {useConfluxPortal} from '@cfxjs/react-hooks'
import {TypeConnectWallet} from '../constants/index'
import ERC20_ABI from '../abi/erc20.json'

export function useInstalled() {
  const {portalInstalled} = useConfluxPortal()
  return portalInstalled
}

export function useAddress() {
  const {address} = useConfluxPortal()()
  return address
}

export function useConnectWalletType() {}

export function useConnect() {
  const {portalInstalled, address, login, error} = useConfluxPortal()
  const [type, setType] = useState(TypeConnectWallet.uninstalled)
  const tryActivate = () => {
    login()
  }
  useEffect(() => {
    if (error) {
      setType(TypeConnectWallet.error)
    } else {
      if (portalInstalled) {
        if (!address) {
          setType(TypeConnectWallet.loading)
        } else {
          setType(TypeConnectWallet.success)
        }
      } else {
        setType(TypeConnectWallet.uninstalled)
      }
    }
  }, [portalInstalled, address, error])
  return {type, setType, tryActivate, error, address}
}

export function useContract(address, ABI) {
  const {confluxJS} = useConfluxPortal()
  return useMemo(() => {
    if (!address || !ABI || !confluxJS) return null
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
