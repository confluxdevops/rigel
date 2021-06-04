import PropTypes from 'prop-types'
import Config, {SupportedChains} from '../../../constants/chainConfig'

function ChainItem({chain}) {
  const chainConfig = Config[chain]
  const getIcon = () => {
    return chainConfig.icon()
  }
  return (
    <div className="flex flex-col">
      {getIcon(chain)}
      <span className="text-xs text-gray-80 inline-block mt-2">
        {chainConfig.shortName}
      </span>
    </div>
  )
}

ChainItem.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ChainItem
