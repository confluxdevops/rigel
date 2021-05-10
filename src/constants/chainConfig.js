import {IS_DEV} from './../utils'
import {ReactComponent as BscIcon} from './../assets/images/chain-bsc-logo.svg'
import {ReactComponent as BtcIcon} from './../assets/images/chain-btc-logo.svg'
import {ReactComponent as EthIcon} from './../assets/images/chain-eth-logo.svg'
import {ReactComponent as CfxIcon} from './../assets/images/chain-cfx-logo.svg'

export const ChainShortNameEth = 'eth'
export const ScanUrlEth = IS_DEV
  ? 'https://rinkeby.etherscan.io/'
  : 'https://etherscan.io'

export const ChainShortNameBsc = 'bsc'
export const ScanUrlBsc = IS_DEV
  ? 'https://testnet.bscscan.com/'
  : 'https://bscscan.com/'

export const ChainShortNameCfx = 'cfx'
export const ScanUrlCfx = IS_DEV
  ? 'https://testnet.confluxscan.io/'
  : 'https://confluxscan.io/'

export const ChainShortNameBtc = 'btc'
export const ScanUrlBtc = IS_DEV
  ? 'https://blockstream.info/testnet'
  : 'https://blockstream.info'

const defaultIconClassName = 'w-12 h-12'

export function Icon({chain, className}) {
  let comp = <></>
  const finalClass = className || defaultIconClassName
  switch (chain) {
    case ChainShortNameEth:
      comp = <EthIcon className={finalClass} />
      break
    case ChainShortNameBsc:
      comp = <BscIcon className={finalClass} />
      break
    case ChainShortNameCfx:
      comp = <CfxIcon className={finalClass} />
      break
    case ChainShortNameBtc:
      comp = <BtcIcon className={finalClass} />
      break
  }
  return comp
}

const config = {
  [ChainShortNameEth]: {
    icon(className) {
      return <Icon className={className} chain={ChainShortNameEth} />
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
      return <Icon className={className} chain={ChainShortNameBsc} />
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
      return <Icon className={className} chain={ChainShortNameCfx} />
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
      return <Icon className={className} chain={ChainShortNameBtc} />
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
