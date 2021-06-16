import Big from 'big.js'

export const NetworkContextName = 'NETWORK'

export const TypeConnectWallet = {
  uninstalled: 'uninstalled',
  loading: 'loading',
  error: 'error',
  success: 'success',
}

export const ProxyUrlPrefix = {
  shuttleflow: '/rpcshuttleflow',
  sponsor: '/rpcsponsor',
}

/**
 * interval time config
 */
export const IntervalTime = {
  fetchBalance: 3000,
}

export const BigNumZero = new Big(0)
