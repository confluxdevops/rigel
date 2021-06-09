import {useEffect, useState} from 'react'
import {ChainConfig, KeyOfMetaMask, KeyOfPortal} from '../constants/chainConfig'
import {
  useConnect as useConnectPortal,
  useTokenContract as useTokenContractPortal,
} from './usePortal'
import {
  useConnect as useConnectWeb3,
  useTokenContract as useTokenContractWeb3,
} from './useWeb3Network'

export function useWallet(chain) {
  const connectObjPortal = useConnectPortal()
  const connectObjWeb3 = useConnectWeb3()
  let connectObj = {}
  switch (ChainConfig[chain].wallet) {
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
export function useTokenContract(chain, address) {
  const dataPortal = useTokenContractPortal(address)
  const dataWeb3 = useTokenContractWeb3(address)
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
export function useContractState(contract, method, params) {
  let [data, setData] = useState(null)
  useEffect(() => {
    contract &&
      contract[method](params)
        .then(res => {
          setData(res)
        })
        .catch(() => {
          setData(null)
        })
  }, [contract, method, params])
  return data
}
