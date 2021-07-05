/* eslint-disable react-hooks/exhaustive-deps */
import {useMemo, useState, useCallback, useEffect} from 'react'
import {useEffectOnce} from 'react-use'
import {ERC20_ABI} from '../abi'
import {KeyOfCfx} from '../constants/chainConfig'
import {BigNumZero, TypeConnectWallet} from '../constants'
import {getChainIdRight} from '../utils'

function validAccounts(accounts) {
  return Array.isArray(accounts) && accounts.length
}

const isPortalInstalled = () => window?.conflux?.isConfluxPortal

function useChainNetId() {
  // const [chainId, setChainId] = useState(window?.conflux?.chainId)
  // const [networkId, setNetworkId] = useState(parseInt(window?.conflux?.networkVersion, 10) || null);
  window.location.chainId = window?.conflux?.chainId

  useEffectOnce(() => {
    const chainListener = newChainId => {
      if (newChainId !== '0xNaN' && newChainId !== window.location.chainId) {
        window.location.chainId = newChainId
      }
    }
    // const networkListener = (networkId) => {
    //   setNetworkId(parseInt(networkId, 10) || null);
    // };
    window?.conflux?.on('chainIdChanged', chainListener)
    // window?.conflux?.on("networkChanged", networkListener);
    return () => {
      window?.conflux?.off('chainIdChanged', chainListener)
      // window?.conflux?.off("networkChanged", networkListener);
    }
  })
  return {chainId: window.location.chainId}
}

export function useConnect() {
  const [address, setAddress] = useState(null)
  const [error, setError] = useState(null)
  const {chainId} = useChainNetId()
  const portalInstalled = isPortalInstalled()
  const [type, setType] = useState(
    portalInstalled ? TypeConnectWallet.uninstalled : TypeConnectWallet.success,
  )

  useEffectOnce(() => {
    window?.conflux
      ?.send('cfx_accounts')
      .then(accounts => {
        if (validAccounts(accounts) && accounts[0] !== address) {
          setAddress(accounts[0])
        }
      })
      .catch(error => setError(error))
  })

  useEffectOnce(() => {
    // listen when user disconnect
    const accountsLinstener = accounts => {
      if (validAccounts(accounts) && accounts[0] !== address) {
        setAddress(accounts[0])
      }
      if (accounts.length === 0) {
        setAddress(null)
      }
    }

    // 监听账户变化
    window?.conflux?.on('accountsChanged', accountsLinstener)
    return () => {
      window?.conflux?.off?.('accountsChanged', accountsLinstener)
    }
  })

  const login = useCallback(() => {
    setType(TypeConnectWallet.loading)
    if (!address) {
      if (window?.conflux)
        window.conflux
          .send('cfx_requestAccounts')
          .then(accounts => {
            setType(TypeConnectWallet.success)
            if (validAccounts(accounts)) {
              setAddress(accounts[0])
            }
          })
          .catch(err => {
            setType(TypeConnectWallet.error)
            setError(err)
            if (err.code === 4001) {
              // EIP-1193 userRejectedRequest error
              // If this happens, the user rejected the connection request.
              console.error('Please connect to ConfluxPortal.')
            } else {
              console.error(err)
            }
          })
    }
  }, [address])

  return {
    type,
    tryActivate: login,
    error,
    address,
    chainId,
  }
}

export function useContract(address, ABI) {
  const confluxJS = window?.confluxJS
  const {chainId} = useConnect(KeyOfCfx)
  const isChainIdRight = getChainIdRight(KeyOfCfx, chainId, address, 'contract')
  return useMemo(
    () => {
      if (!ABI || !confluxJS || !isChainIdRight) return null
      try {
        return confluxJS.Contract({abi: ABI, address})
      } catch (error) {
        return null
      }
    },
    [address, Boolean(confluxJS)],
    isChainIdRight,
  )
}

export function useTokenContract(tokenAddress) {
  return useContract(tokenAddress || '', ERC20_ABI)
}

/**
 * get CFX balance from Conflux Network
 * @returns balance of account
 */
export function useNativeTokenBalance(address) {
  const [balance, setBalance] = useState(BigNumZero)
  const {chainId} = useChainNetId()
  const isChainIdRight = getChainIdRight(KeyOfCfx, chainId, address)

  useEffect(() => {
    if (!isChainIdRight || !address) {
      setBalance(BigNumZero)
    } else {
      window?.confluxJS.getBalance(address).then(result => {
        // console.log('balance drip', balance.toString())
        setBalance(result)
      })
    }
  }, [address, isChainIdRight])
  return balance
}
