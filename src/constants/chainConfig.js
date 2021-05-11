// chain config constants
import {IS_DEV} from '../utils'
import PropTypes from 'prop-types'
import bscIcon from '../assets/images/chain-bsc-logo.svg'
import btcIcon from '../assets/images/chain-btc-logo.svg'
import ethIcon from '../assets/images/chain-eth-logo.svg'
import cfxIcon from '../assets/images/chain-cfx-logo.svg'

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

export const DefaultChainIconClassName = 'w-10 h-10'
export function ChainIcon({chain, className}) {
  const finalClass = className || DefaultChainIconClassName
  let imgSrc = ''
  switch (chain) {
    case ChainShortNameEth:
      imgSrc = ethIcon
      break
    case ChainShortNameBsc:
      imgSrc = bscIcon
      break
    case ChainShortNameCfx:
      imgSrc = cfxIcon
      break
    case ChainShortNameBtc:
      imgSrc = btcIcon
      break
  }
  return <img src={imgSrc} className={finalClass} alt={chain} />
}

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

ChainIcon.propTypes = {
  chain: PropTypes.oneOf(supportedChains).isRequired,
  className: PropTypes.string,
}
