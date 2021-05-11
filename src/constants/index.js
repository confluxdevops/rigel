import {IS_DEV} from '../utils'

export const NetworkContextName = 'NETWORK'

// chain config constants
export const DefaultChainIconSize = 'w-10 h-10'

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

export const Chains = [
  ChainShortNameEth,
  ChainShortNameCfx,
  ChainShortNameBtc,
  ChainShortNameBsc,
]
