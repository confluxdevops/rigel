// chain config constants
import React from 'react'
import PropTypes from 'prop-types'

import {IS_DEV} from '../utils'
import {checkHexAddress, checkCfxTokenAddress} from '../utils/address'
import {
  BscIcon,
  BtcIcon,
  EthIcon,
  CfxIcon,
  MetamaskLogo,
  PortalLogo,
} from '../assets/svg'

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

export const KeyOfPortal = 'portal'
export const KeyOfMetaMask = 'metamask'
export const WalletConfig = {
  [KeyOfPortal]: {
    key: KeyOfPortal,
    name: 'ConfluxPortal',
    website: 'https://portal.confluxnetwork.org',
    icon(className, size) {
      return <WalletIcon className={className} size={size} type={KeyOfPortal} />
    },
  },
  [KeyOfMetaMask]: {
    key: KeyOfMetaMask,
    name: 'MetaMask',
    website: 'https://metamask.io',
    icon(className, size) {
      return (
        <WalletIcon className={className} size={size} type={KeyOfMetaMask} />
      )
    },
  },
}

export const displayFilter = obj => {
  return obj?.supported === 1 && obj?.in_token_list === 1
}

/**
 * chain config
 */
export const ChainConfig = {
  [KeyOfEth]: {
    key: KeyOfEth,
    icon(className, size) {
      return <ChainIcon className={className} size={size} chain={KeyOfEth} />
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
    wallet: KeyOfMetaMask,
  },
  [KeyOfBsc]: {
    key: KeyOfBsc,
    icon(className, size) {
      return <ChainIcon className={className} size={size} chain={KeyOfBsc} />
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
    wallet: KeyOfMetaMask,
  },
  [KeyOfCfx]: {
    key: KeyOfCfx,
    icon(className, size) {
      return <ChainIcon className={className} size={size} chain={KeyOfCfx} />
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
    wallet: KeyOfPortal,
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

export const SupportedChains = Object.keys(ChainConfig)

export const SupportedWallets = Object.keys(WalletConfig)

// set default chain to FromChain and ToChain when shuttle
export const DefaultFromChain = KeyOfEth
export const DefaultToChain = KeyOfCfx
export const SupportedChainIdsWeb3 = [
  ...ChainConfig[KeyOfEth].supportedChainIds,
  ...ChainConfig[KeyOfBsc].supportedChainIds,
]

const DefaultChainIconSize = 'w-10 h-10'
export function ChainIcon({chain, size = DefaultChainIconSize, className}) {
  let icon
  switch (chain) {
    case KeyOfEth:
      icon = <EthIcon />
      break
    case KeyOfBsc:
      icon = <BscIcon />
      break
    case KeyOfCfx:
      icon = <CfxIcon />
      break
    case KeyOfBtc:
      icon = <BtcIcon />
      break
  }
  return React.cloneElement(icon, {
    className: `${size} ${className}`,
  })
}

const DefaultWalletIconSize = 'w-4 h-4'
export function WalletIcon({type, size = DefaultWalletIconSize, className}) {
  let icon
  switch (type) {
    case KeyOfPortal:
      icon = <PortalLogo />
      break
    case KeyOfMetaMask:
      icon = <MetamaskLogo />
      break
  }
  return React.cloneElement(icon, {
    className: `${size} ${className}`,
  })
}

ChainIcon.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  size: PropTypes.string,
  className: PropTypes.string,
}

WalletIcon.propTypes = {
  type: PropTypes.oneOf(SupportedWallets).isRequired,
  size: PropTypes.string,
  className: PropTypes.string,
}
