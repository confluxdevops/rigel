/**
 * Choose the chain on Shuttle page
 */
import PropTypes from 'prop-types'
import Config, {
  SupportedChains,
  ChainShortNameCfx,
} from '../../../constants/chainConfig'
import {MenuItem, Dropdown} from '../../../components'

function ChainSelect({type, chain, fromChain, onClick}) {
  const chainsData = getChainsData(type, chain, fromChain)
  const chainConfig = Config[chain]
  const clickHandler = key => {
    onClick && onClick(key)
  }
  const menu = chainsData.map(item => (
    <MenuItem
      itemKey={item.shortName}
      key={item.shortName}
      onClick={clickHandler}
      selected={item.selected}
      disabled={item.disabled}
      icon={item.icon}
    >
      {item.name}
    </MenuItem>
  ))
  const getIcon = chain => {
    return Config[chain].icon('w-12 h-12')
  }
  return (
    <div>
      {getIcon(chain)}
      <Dropdown
        overlay={<>{menu}</>}
        placement="bottomLeft"
        trigger={['click']}
        arrow
      >
        <span aria-hidden="true">{chainConfig.shortOfFullName}</span>
      </Dropdown>
    </div>
  )
}

ChainSelect.propTypes = {
  type: PropTypes.oneOf(['from', 'to']).isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  fromChain: PropTypes.oneOf(SupportedChains),
  onClick: PropTypes.func,
}

export default ChainSelect

/**
 * get the data that will show in the Chain Dropdown list
 * @param {*} type
 * @param {*} chain
 * @param {*} fromChain
 */
function getChainsData(type, chain, fromChain) {
  let chains = []
  switch (type) {
    case 'from':
      SupportedChains.forEach(chainName => {
        const ChainConfig = Config[chainName]
        let item = {}
        item.name = ChainConfig.shortOfFullName
        item.shortName = ChainConfig.shortName
        item.icon = ChainConfig.icon('h-6 w-6')
        item.disabled = false
        if (chainName === chain) {
          item.selected = true
        } else {
          item.selected = false
        }
        chains.push(item)
      })
      break
    case 'to':
      SupportedChains.forEach(chainName => {
        const ChainConfig = Config[chainName]
        let item = {}
        item.name = ChainConfig.shortOfFullName
        item.shortName = ChainConfig.shortName
        item.icon = ChainConfig.icon('h-6 w-6')
        if (fromChain !== ChainShortNameCfx) {
          if (chainName !== ChainShortNameCfx) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        } else {
          if (chainName === ChainShortNameCfx) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        }
        if (chainName === chain) {
          item.selected = true
        } else {
          item.selected = false
        }
        chains.push(item)
      })
      break
  }
  return chains
}
