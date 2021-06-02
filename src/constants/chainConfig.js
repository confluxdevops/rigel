// chain config constants
import PropTypes from 'prop-types'

import {IS_DEV} from '../utils'
import {checkHexAddress, checkCfxTokenAddress} from '../utils/address'
import {bscIcon, btcIcon, ethIcon, cfxIcon} from '../assets/images'

/**
 * ethereum config
 */
export const KeyOfEth = 'eth'
export const ScanUrlEth = IS_DEV
  ? 'https://rinkeby.etherscan.io/'
  : 'https://etherscan.io'
export const ChainIdEth = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  KOVAN: 42,
}

/**
 * bsc config
 */
export const KeyOfBsc = 'bsc'
export const ScanUrlBsc = IS_DEV
  ? 'https://testnet.bscscan.com/'
  : 'https://bscscan.com/'
export const ChainIdBsc = {
  MAINNET: 56,
  TESTNET: 97,
}

/**
 * conflux config
 */
export const KeyOfCfx = 'cfx'
export const ScanUrlCfx = IS_DEV
  ? 'https://testnet.confluxscan.io/'
  : 'https://confluxscan.io/'
export const ChainIdCfx = {
  MAINNET: 1029,
  TESTNET: 1,
}

/**
 * bitcoin config
 */
export const KeyOfBtc = 'btc'
export const ScanUrlBtc = IS_DEV
  ? 'https://blockstream.info/testnet'
  : 'https://blockstream.info'

export const DefaultChainIconClassName = 'w-10 h-10'

export function ChainIcon({chain, className}) {
  const finalClass = className || DefaultChainIconClassName
  let imgSrc = ''
  switch (chain) {
    case KeyOfEth:
      imgSrc = ethIcon
      break
    case KeyOfBsc:
      imgSrc = bscIcon
      break
    case KeyOfCfx:
      imgSrc = cfxIcon
      break
    case KeyOfBtc:
      imgSrc = btcIcon
      break
  }
  return <img src={imgSrc} className={finalClass} alt={chain} />
}

export const WalletMetaMask = 'MetaMask'
export const WalletPortal = 'ConfluxPortal'

export const displayFilter = obj => {
  return obj?.supported === 1 && obj?.in_token_list === 1
}

/**
 * main config
 */
const Config = {
  [KeyOfEth]: {
    key: KeyOfEth,
    icon(className) {
      return <ChainIcon className={className} chain={KeyOfEth} />
    },
    fullName: 'Ethereum', //full name of the chain
    shortName: 'Ethereum', // short name of chain, usually used for fetching api
    tokenName: 'ETH', //the name of native token for this chain
    checkAddress: checkHexAddress,
    displayFilter,
    scanUrl: ScanUrlEth,
    scanTxUrl: ScanUrlEth + '/tx/',
    scanTokenUrl: ScanUrlEth + '/token/',
    // TODO
    // commonTokens: ['ETH', 'USDT', 'eCFX'],
    commonTokens: ['eth', '0xae080e58d91cf0b8a8de18ddcf92b9e5fbfadec5'],
    supportedChainIds: [ChainIdEth.MAINNET, ChainIdEth.RINKEBY],
    wallet: WalletMetaMask,
  },
  [KeyOfBsc]: {
    key: KeyOfBsc,
    icon(className) {
      return <ChainIcon className={className} chain={KeyOfBsc} />
    },
    fullName: 'Binance Smart Contract',
    shortName: 'BSC',
    tokenName: 'BNB',
    checkAddress: checkHexAddress,
    displayFilter,
    scanUrl: ScanUrlBsc,
    scanTxUrl: ScanUrlBsc + '/tx/',
    scanTokenUrl: ScanUrlBsc + '/token/',
    // TODO
    commonTokens: ['BNB', 'bcUSDT', 'bCFX'],
    supportedChainIds: Object.values(ChainIdBsc),
    wallet: WalletMetaMask,
  },
  [KeyOfCfx]: {
    key: KeyOfCfx,
    icon(className) {
      return <ChainIcon className={className} chain={KeyOfCfx} />
    },
    fullName: 'Conflux',
    shortName: 'Conflux',
    tokenName: 'CFX',
    checkAddress: checkCfxTokenAddress,
    displayFilter,
    scanUrl: ScanUrlCfx,
    scanTxUrl: ScanUrlCfx + '/transaction/',
    scanTokenUrl: ScanUrlCfx + '/address/',
    // TODO
    commonTokens: ['CFX', 'cUSDT', 'cETH'],
    supportedChainIds: Object.values(ChainIdCfx),
    wallet: WalletPortal,
  },
  [KeyOfBtc]: {
    key: KeyOfBtc,
    icon(className) {
      return <ChainIcon className={className} chain={KeyOfBtc} />
    },
    fullName: 'Bitcoin',
    shortName: 'Bitcoin',
    tokenName: 'BTC',
    checkAddress() {
      //TODO:
      return true
    },
    displayFilter() {
      return true
    },
    scanUrl: ScanUrlBtc,
    scanTxUrl: ScanUrlBtc + '/tx/',
    commonTokens: [],
  },
}

export default Config

export const SupportedChains = Object.keys(Config)

// set default chain to FromChain and ToChain when shuttle
export const DefaultFromChain = KeyOfEth
export const DefaultToChain = KeyOfCfx

ChainIcon.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
}
