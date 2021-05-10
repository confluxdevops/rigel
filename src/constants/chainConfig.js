import React from 'react'
import {IS_DEV} from './../utils'
import BscHexagonIcon from './../components/Icon/Hexagon/bsc'
import BtcHexagonIcon from './../components/Icon/Hexagon/btc'
import EthHexagonIcon from './../components/Icon/Hexagon/eth'
import CfxHexagonIcon from './../components/Icon/Hexagon/cfx'
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
export function Hexagon({chain, width, height}) {
  let comp = <></>
  switch (chain) {
    case ChainNameEth:
      comp = <EthHexagonIcon width={width} height={height} />
      break
    case ChainNameBsc:
      comp = <BscHexagonIcon width={width} height={height} />
      break
    case ChainNameCfx:
      comp = <CfxHexagonIcon width={width} height={height} />
      break
    case ChainNameBtc:
      comp = <BtcHexagonIcon width={width} height={height} />
      break
  }
  return comp
}
const config = {
  [ChainNameEth]: {
    icon: '',
    hexagonIcon(width, height) {
      return <Hexagon width={width} height={height} chain={ChainNameEth} />
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
    icon: '',
    hexagonIcon(width, height) {
      return <Hexagon width={width} height={height} chain={ChainNameBsc} />
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
    icon: '',
    hexagonIcon(width, height) {
      return <Hexagon width={width} height={height} chain={ChainNameCfx} />
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
    icon: '',
    hexagonIcon(width, height) {
      return <Hexagon width={width} height={height} chain={ChainNameBtc} />
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
