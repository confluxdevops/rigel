/**
 * Choose the chain on Shuttle page
 */
import PropTypes from 'prop-types'
import {useState, useEffect} from 'react'

import Config, {SupportedChains, KeyOfCfx} from '../../../constants/chainConfig'
import {MenuItem, Dropdown} from '../../../components'

function ChainSelect({type, chain, fromChain, onClick}) {
  const chainsData = useChainsData(type, chain, fromChain)
  const chainConfig = Config[chain]
  const clickHandler = key => {
    onClick && onClick(key)
  }
  const menu = chainsData.map(item => (
    <MenuItem
      itemKey={item.key}
      key={item.key}
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
        <span aria-hidden="true">{chainConfig.shortName}</span>
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
function useChainsData(type, chain, fromChain) {
  const [chains, setChains] = useState([])
  useEffect(() => {
    let chainArr = []
    switch (type) {
      case 'from':
        SupportedChains.forEach(chainName => {
          const ChainConfig = Config[chainName]
          let item = {}
          item.key = ChainConfig.key
          item.name = ChainConfig.fullName
          item.icon = ChainConfig.icon('h-6 w-6')
          item.disabled = false
          if (chainName === chain) {
            item.selected = true
          } else {
            item.selected = false
          }
          chainArr.push(item)
        })
        break
      case 'to':
        SupportedChains.forEach(chainName => {
          const ChainConfig = Config[chainName]
          let item = {}
          item.key = ChainConfig.key
          item.name = ChainConfig.fullName
          item.icon = ChainConfig.icon('h-6 w-6')
          if (fromChain !== KeyOfCfx) {
            if (chainName !== KeyOfCfx) {
              item.disabled = true
            } else {
              item.disabled = false
            }
          } else {
            if (chainName === KeyOfCfx) {
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
          chainArr.push(item)
        })
        break
    }
    setChains(chainArr)
  }, [type, chain, fromChain])
  return chains
}
