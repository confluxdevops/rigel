/**
 * Choose the chain on Shuttle page
 */
import PropTypes from 'prop-types'
import {useState, useEffect} from 'react'

import Config, {SupportedChains, KeyOfCfx} from '../../../constants/chainConfig'
import {Menu, Dropdown} from '../../../components'
import {ArrowDownFilled} from '../../../assets/svg'

function ChainSelect({type, chain, fromChain, onClick}) {
  const chainsData = useChainsData(type, chain, fromChain)
  const chainConfig = Config[chain]
  const onClickHandler = key => {
    onClick && onClick(key, type)
  }
  const menu = (
    <Menu>
      {chainsData.map(item => (
        <Menu.Item
          itemKey={item.key}
          key={item.key}
          onClick={onClickHandler}
          selected={item.selected}
          disabled={item.disabled}
          icon={item.icon}
        >
          {item.name}
        </Menu.Item>
      ))}
    </Menu>
  )

  const getIcon = chain => {
    return Config[chain].icon()
  }
  return (
    <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
      <div
        className="w-26.5 h-24.5 rounded bg-gray-10 p-3 flex flex-col cursor-pointer"
        aria-hidden="true"
      >
        {getIcon(chain)}
        <div className="mt-2 flex justify-between items-center w-full">
          <span className="text-xs text-gray-80">{chainConfig.shortName}</span>
          <ArrowDownFilled className="w-4 h-4 text-gray-40" />
        </div>
      </div>
    </Dropdown>
  )
}

ChainSelect.propTypes = {
  type: PropTypes.oneOf(['from', 'to']).isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  fromChain: PropTypes.oneOf(SupportedChains), // only when type === to need the value
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
