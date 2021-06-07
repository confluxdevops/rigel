// import {useState,useCallback,useEffect} from 'react'
import Config, {WalletMetaMask, WalletPortal} from '../constants/chainConfig'
import {useConnect as useConnectPortal} from './usePortal'
import {useConnect as useConnectWeb3} from './useWeb3Network'

export function useWallet(chain) {
  const connectObjPortal = useConnectPortal()
  const connectObjWeb3 = useConnectWeb3()
  let connectObj = {}
  switch (Config[chain].wallet) {
    case WalletMetaMask:
      connectObj = connectObjWeb3
      break
    case WalletPortal:
      connectObj = connectObjPortal
      break
  }
  return connectObj
}
