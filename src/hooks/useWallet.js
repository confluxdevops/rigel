// import {useState,useCallback,useEffect} from 'react'
import {ChainConfig, KeyOfMetaMask, KeyOfPortal} from '../constants/chainConfig'
import {useConnect as useConnectPortal} from './usePortal'
import {useConnect as useConnectWeb3} from './useWeb3Network'

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
