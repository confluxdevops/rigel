/**
 * Connectors base on web3,including Ethereum,Bsc
 */
import {InjectedConnector} from '@web3-react/injected-connector'
import {SupportedChainIdsWeb3} from './chainConfig'

export const injected = new InjectedConnector({
  supportedChainIds: SupportedChainIdsWeb3,
})
