import PropTypes from 'prop-types'
import {SupportedChains, ChainConfig} from '../../../constants/chainConfig'

function ChainItem({chain}) {
  const chainConfig = ChainConfig[chain]
  const getIcon = () => {
    return chainConfig.icon()
  }
  return (
    <div className="flex flex-col">
      {getIcon()}
      <span className="text-xs text-gray-80 mt-2">{chainConfig.shortName}</span>
    </div>
  )
}

ChainItem.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ChainItem
