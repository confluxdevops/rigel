/* eslint-disable import/named */
import { Web3Provider } from '@ethersproject/providers'
// eslint-disable-next-line import/namespace
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL

export const NETWORK_CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary
export function getNetworkLibrary() {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider))
}