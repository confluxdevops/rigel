import {IS_DEV} from './../utils'
import BscHexagonIcon from './../components/Icon/Hexagon/bsc'
import BtcHexagonIcon from './../components/Icon/Hexagon/btc'
import EthHexagonIcon from './../components/Icon/Hexagon/eth'
import CfxHexagonIcon from './../components/Icon/Hexagon/cfx'
const config = {
  eth: {
    icon: '',
    hexagonIcon: EthHexagonIcon,
    fullName: 'Ethereum',
    shortName: 'eth',
    tokenName: 'ETH',
    checkAddress() {
      //TODO:
      return true
    },
    scanUrl: IS_DEV ? 'https://rinkeby.etherscan.io/' : 'https://etherscan.io',
    scanTxUrl: config.scanUrl + '/tx/',
    scanTokenUrl: config.scanUrl + '/token/',
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
  bsc: {
    icon: '',
    hexagonIcon: BscHexagonIcon,
    fullName: 'Binance Smart Contract',
    shortName: 'bsc',
    checkAddress() {
      //TODO:
      return true
    },
    scanUrl: IS_DEV ? 'https://testnet.bscscan.com/' : 'https://bscscan.com/',
    scanTxUrl: config.scanUrl + '/tx/',
    scanTokenUrl: config.scanUrl + '/token/',
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
  cfx: {
    icon: '',
    hexagonIcon: CfxHexagonIcon,
    fullName: 'Conflux',
    shortName: 'cfx',
    checkAddress() {
      //TODO:
      return true
    },
    scanUrl: IS_DEV
      ? 'https://testnet.confluxscan.io/'
      : 'https://confluxscan.io/',
    scanTxUrl: config.scanUrl + '/transaction/',
    scanTokenUrl: config.scanUrl + '/address/',
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
  btc: {
    icon: '',
    hexagonIcon: BtcHexagonIcon,
    fullName: 'Bitcoin',
    shortName: 'btc',
    checkAddress() {
      //TODO:
      return true
    },
    scanUrl: IS_DEV
      ? 'https://blockstream.info/testnet'
      : 'https://blockstream.info',
    scanTxUrl: config.scanUrl + '/tx/',
    commonTokens: [],
  },
}
export default config
