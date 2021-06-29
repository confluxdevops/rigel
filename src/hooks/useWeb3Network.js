/**
 * For the chain based on Ethereum: multiple connectors
 * But only support MetaMask now
 */
import {useEffect, useState, useMemo} from 'react'
import {useWeb3React, UnsupportedChainIdError} from '@web3-react/core'
import {useInterval} from 'react-use'
import Big from 'big.js'
import {NetworkContextName, IntervalTime, BigNumZero} from '../constants'
import {injected} from '../utils/web3'
import {TypeConnectWallet} from '../constants/index'
import {isMobile} from 'react-device-detect'
import {getContract} from '../utils/web3'
import {ERC20_ABI} from '../abi'

/**
 * doc: https://github.com/NoahZinsmeister/web3-react/tree/v6/docs#useweb3react
 * @returns context object
 * object details:
  activate: (
    connector: AbstractConnectorInterface,
    onError?: (error: Error) => void,
    throwErrors?: boolean
  ) => Promise<void>
  setError: (error: Error) => void
  deactivate: () => void

  connector?: AbstractConnectorInterface
  library?: T
  chainId?: number
  account?: null | string

  active: boolean
  error?: Error
 */
export function useActiveWeb3React() {
  const context = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)
  return context.active ? context : contextNetwork
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const {active, error, activate} = useWeb3React() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const {ethereum} = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch(error => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = accounts => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch(error => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}

export function useEagerConnect() {
  const {activate, active} = useWeb3React() // specifically using useWeb3React because of what this hook does
  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        if (window.ethereum && isMobile) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

export function useInstalled() {
  const isInstalled = window?.ethereum
  return isInstalled
}

export function useAddress() {
  const {account} = useWeb3React()
  return account
}

export function useConnect() {
  const {error, account, activate} = useWeb3React()
  //TODO: unsupported chain id error
  const isInstalled = useInstalled
  const [type, setType] = useState(TypeConnectWallet.uninstalled)
  useEffect(() => {
    if (error) {
      setType(TypeConnectWallet.error)
    } else {
      if (isInstalled) {
        if (!account) {
          setType(TypeConnectWallet.loading)
        } else {
          setType(TypeConnectWallet.success)
        }
      } else {
        setType(TypeConnectWallet.uninstalled)
      }
    }
  }, [account, error, isInstalled])

  const tryActivate = () => {
    if (isInstalled && !account) {
      activate(injected, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(injected)
        } else {
          setType(TypeConnectWallet.error)
        }
      })
    }
  }
  return {type, setType, tryActivate, error, address: account}
}

/**
 * Get the balance of Native Token, etc: the ETH token on the Ethereum chain
 * doc: https://github.com/streamich/react-use/blob/master/docs/useInterval.md
 * @param {*} address token address
 * @param {*} delay interval delay milliseconds
 * @returns the balance
 */
export function useNativeTokenBalance(
  address,
  delay = IntervalTime.fetchBalance,
) {
  const [balance, setBalance] = useState(BigNumZero)
  const {account, library} = useWeb3React()
  useInterval(
    () => {
      library &&
        library
          .getBalance(address)
          .then(newBalance => {
            if (!balance.eq(newBalance)) {
              setBalance(new Big(newBalance.toString(10)))
            }
          })
          .catch(() => {
            setBalance(BigNumZero)
          })
    },
    account ? delay : null,
  )
  return balance
}

// returns null when has error
export function useContract(address, ABI, withSignerIfPossible = true) {
  const {library, account} = useActiveWeb3React()
  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      )
    } catch (error) {
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress, withSignerIfPossible = true) {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}
