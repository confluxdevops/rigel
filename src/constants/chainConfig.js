// chain config constants
import {IS_DEV, checkHexAddress, checkCfxTokenAddress} from '../utils'
import PropTypes from 'prop-types'
import {bscIcon, btcIcon, ethIcon, cfxIcon} from '../assets/images'

/**
 * ethereum config
 */
export const ChainShortNameEth = 'eth'
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
export const ChainShortNameBsc = 'bsc'
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
export const ChainShortNameCfx = 'cfx'
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

export const WalletMetaMask = 'MetaMask'
export const WalletPortal = 'ConfluxPortal'

export const displayFilter = obj => {
  return obj?.supported === 1 && obj?.in_token_list === 1
}

/**
 * main config
 */
const Config = {
  [ChainShortNameEth]: {
    icon(className) {
      return <ChainIcon className={className} chain={ChainShortNameEth} />
    },
    fullName: 'Ethereum',
    shortName: ChainShortNameEth,
    tokenName: 'ETH',
    checkAddress: checkHexAddress,
    displayFilter,
    scanUrl: ScanUrlEth,
    scanTxUrl: ScanUrlEth + '/tx/',
    scanTokenUrl: ScanUrlEth + '/token/',
    // TODO
    commonTokens: ['ETH', 'USDT', 'eCFX'],
    supportedChainIds: [ChainIdEth.MAINNET, ChainIdEth.RINKEBY],
    wallet: WalletMetaMask,
  },
  [ChainShortNameBsc]: {
    icon(className) {
      return <ChainIcon className={className} chain={ChainShortNameBsc} />
    },
    fullName: 'Binance Smart Contract',
    shortName: ChainShortNameBsc,
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
  [ChainShortNameCfx]: {
    icon(className) {
      return <ChainIcon className={className} chain={ChainShortNameCfx} />
    },
    fullName: 'Conflux',
    shortName: ChainShortNameCfx,
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

ChainIcon.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
}
