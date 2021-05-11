import {
  ChainShortNameEth,
  ChainShortNameBtc,
  ChainShortNameCfx,
  ChainShortNameBsc,
  ScanUrlEth,
  ScanUrlBsc,
  ScanUrlCfx,
  ScanUrlBtc,
} from '../constants'
import {ChainIcon} from '../pages/components'

const config = {
  [ChainShortNameEth]: {
    icon(className) {
      return <ChainIcon className={className} chain={ChainShortNameEth} />
    },
    fullName: 'Ethereum',
    shortName: ChainShortNameEth,
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
  [ChainShortNameBsc]: {
    icon(className) {
      return <ChainIcon className={className} chain={ChainShortNameBsc} />
    },
    fullName: 'Binance Smart Contract',
    shortName: ChainShortNameBsc,
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
  [ChainShortNameCfx]: {
    icon(className) {
      return <ChainIcon className={className} chain={ChainShortNameCfx} />
    },
    fullName: 'Conflux',
    shortName: ChainShortNameCfx,
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
  [ChainShortNameBtc]: {
    icon(className) {
      return <ChainIcon className={className} chain={ChainShortNameBtc} />
    },
    fullName: 'Bitcoin',
    shortName: ChainShortNameBtc,
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
