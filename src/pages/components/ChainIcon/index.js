import PropTypes from 'prop-types'
import bscIcon from '../../../assets/images/chain-bsc-logo.svg'
import btcIcon from '../../../assets/images/chain-btc-logo.svg'
import ethIcon from '../../../assets/images/chain-eth-logo.svg'
import cfxIcon from '../../../assets/images/chain-cfx-logo.svg'
import {
  DefaultChainIconSize,
  ChainShortNameEth,
  ChainShortNameBsc,
  ChainShortNameCfx,
  ChainShortNameBtc,
  Chains,
} from '../../../constants'

function Icon({chain, className}) {
  const finalClass = className || DefaultChainIconSize
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

Icon.propTypes = {
  chain: PropTypes.oneOf(Chains).isRequired,
  className: PropTypes.string,
}

export default Icon
