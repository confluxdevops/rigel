/* eslint-disable react-hooks/exhaustive-deps */
import {useMemo, useState, useCallback, useEffect} from 'react'
import {useEffectOnce} from 'react-use'
import {useConnectWalletStatus, useIsChainIdRight, useWallet} from './useWallet'
import {ERC20_ABI} from '../abi'
import {KeyOfCfx} from '../constants/chainConfig'
import {BigNumZero} from '../constants'

function validAccounts(accounts) {
  return Array.isArray(accounts) && accounts.length
}

const isPortalInstalled = () => window?.conflux?.isConfluxPortal

function useChainNetId() {
  const [chainId, setChainId] = useState(window?.conflux?.chainId)
  // const [networkId, setNetworkId] = useState(parseInt(window?.conflux?.networkVersion, 10) || null);

  useEffectOnce(() => {
    const chainListener = chainId => {
      setChainId(chainId)
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

  return {chainId}
}

export function useConnect() {
  const [address, setAddress] = useState(null)
  const [error, setError] = useState({})
  const {chainId} = useChainNetId()

  useEffectOnce(() => {
    window?.conflux
      ?.send({method: 'cfx_accounts'})
      .then(accounts => {
        if (validAccounts(accounts) && accounts[0] !== address) {
          setAddress(accounts[0])
        } else {
          if (address !== null && address !== undefined) {
            setAddress(null)
          }
        }
      })
      .catch(error => setError(error))
  })

  useEffectOnce(() => {
    const accountsLinstener = newAccounts => {
      if (validAccounts(newAccounts)) {
        setAddress(newAccounts[0])
      } else {
        if (address !== null) setAddress(null)
      }
    }
    // 监听账户变化
    window?.conflux?.on('accountsChanged', accountsLinstener)
    return () => {
      window?.conflux?.off?.('accountsChanged', accountsLinstener)
    }
  })

  const login = useCallback(() => {
    if (!address) {
      if (window?.conflux)
        window.conflux
          .send({method: 'cfx_requestAccounts'})
          .then(accounts => validAccounts(accounts) && setAddress(accounts[0]))
          .catch(err => {
            setError(err)
            if (err.code === 4001) {
              // EIP-1193 userRejectedRequest error
              // If this happens, the user rejected the connection request.
              console.error('Please connect to MetaMask.')
            } else {
              console.error(err)
            }
          })
    }
  }, [address])

  const portalInstalled = isPortalInstalled()

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
  const confluxJS = window?.confluxJS
  const {chainId} = useWallet(KeyOfCfx)
  const isChainIdRight = useIsChainIdRight(KeyOfCfx, chainId)
  return useMemo(() => {
    if (!ABI || !confluxJS || !isChainIdRight) return null
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
  const {address} = useConnect()
  const [balance, setBalance] = useState(BigNumZero)
  const {chainId} = useChainNetId()
  const isChainIdRight = useIsChainIdRight(KeyOfCfx, chainId)

  useEffect(() => {
    if (!isChainIdRight) {
      setBalance(BigNumZero)
    } else {
      window?.confluxJS.getBalance(address).then(result => {
        // console.log('balance drip', balance.toString())
        setBalance(result)
      })
    }
  }, [address])
  return balance
}
