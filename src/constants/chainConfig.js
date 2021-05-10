import React from 'react'
import {IS_DEV} from './../utils'
import {ReactComponent as BscIcon} from './../assets/images/chain-bsc-logo.svg'
import {ReactComponent as BtcIcon} from './../assets/images/chain-btc-logo.svg'
import {ReactComponent as EthIcon} from './../assets/images/chain-eth-logo.svg'
import {ReactComponent as CfxIcon} from './../assets/images/chain-cfx-logo.svg'
export const ChainNameEth = 'eth'
export const ScanUrlEth = IS_DEV
  ? 'https://rinkeby.etherscan.io/'
  : 'https://etherscan.io'
export const ChainNameBsc = 'bsc'
export const ScanUrlBsc = IS_DEV
  ? 'https://testnet.bscscan.com/'
  : 'https://bscscan.com/'
export const ChainNameCfx = 'cfx'
export const ScanUrlCfx = IS_DEV
  ? 'https://testnet.confluxscan.io/'
  : 'https://confluxscan.io/'
export const ChainNameBtc = 'btc'
export const ScanUrlBtc = IS_DEV
  ? 'https://blockstream.info/testnet'
  : 'https://blockstream.info'
const defaultIconClassName = 'w-12 h-12'
export function Icon({chain, className}) {
  let comp = <></>
  const finalClass = className || defaultIconClassName
  switch (chain) {
    case ChainNameEth:
      comp = <EthIcon className={finalClass} />
      break
    case ChainNameBsc:
      comp = <BscIcon className={finalClass} />
      break
    case ChainNameCfx:
      comp = <CfxIcon className={finalClass} />
      break
    case ChainNameBtc:
      comp = <BtcIcon className={finalClass} />
      break
  }
  return comp
}
const config = {
  [ChainNameEth]: {
    icon(className) {
      return <Icon className={className} chain={ChainNameEth} />
    },
    fullName: 'Ethereum',
    shortName: 'eth',
    tokenName: 'ETH',
    checkAddress() {
      //TODO:
      return true
    },
    scanUrl: ScanUrlEth,
    scanTxUrl: ScanUrlEth + '/tx/',
    scanTokenUrl: ScanUrlEth + '/token/',
    getTokenList() {
      //TODO:
      return {}
    },
    getToken() {
      //TODO:
      return {}
    },
    commonTokens: ['ETH', 'USDT', 'eCFX'],
  },
  [ChainNameBsc]: {
    icon(className) {
      return <Icon className={className} chain={ChainNameBsc} />
    },
    fullName: 'Binance Smart Contract',
    shortName: 'bsc',
    tokenName: 'BNB',
    checkAddress() {
      //TODO:
      return true
    },
    scanUrl: ScanUrlBsc,
    scanTxUrl: ScanUrlBsc + '/tx/',
    scanTokenUrl: ScanUrlBsc + '/token/',
    getTokenList() {
      //TODO:
      return {}
    },
    getToken() {
      //TODO:
      return {}
    },
    commonTokens: ['BNB', 'bcUSDT', 'bCFX'],
  },
  [ChainNameCfx]: {
    icon(className) {
      return <Icon className={className} chain={ChainNameCfx} />
    },
    fullName: 'Conflux',
    shortName: 'cfx',
    tokenName: 'CFX',
    checkAddress() {
      //TODO:
      return true
    },
    scanUrl: ScanUrlCfx,
    scanTxUrl: ScanUrlCfx + '/transaction/',
    scanTokenUrl: ScanUrlCfx + '/address/',
    getTokenList() {
      //TODO:
      return {}
    },
    getToken() {
      //TODO:
      return {}
    },
    commonTokens: ['CFX', 'cUSDT', 'cETH'],
  },
  [ChainNameBtc]: {
    icon(className) {
      return <Icon className={className} chain={ChainNameBtc} />
    },
    fullName: 'Bitcoin',
    shortName: 'btc',
    tokenName: 'BTC',
    checkAddress() {
      //TODO:
      return true
    },
    scanUrl: ScanUrlBtc,
    scanTxUrl: ScanUrlBtc + '/tx/',
    commonTokens: [],
  },
}
export default config
export const supportedChains = Object.keys(config)
