import PropTypes from 'prop-types'
import _ from 'underscore'
import {
  SupportedChains,
  ChainShortNameCfx,
} from '../../../constants/chainConfig'
import {TokenNameAndIcon} from '../../components'
import {WrapIcon} from '../../../components'
import {PlusWithBg} from '../../../assets/svg'
import {shortenEthAddress, shortenCfxAddress} from '../../../utils'
import useAddTokenToMetamask from '../../../hooks/useAddTokenToMetamask'

function TokenItem({chain, token, selectedToken, onClick}) {
  const {addToken} = useAddTokenToMetamask(token)
  const {symbol, name, reference_symbol, reference_name, ctoken, reference} =
    token
  const tokenAddress =
    chain === ChainShortNameCfx
      ? shortenCfxAddress(ctoken)
      : shortenEthAddress(reference)

  const getSelectedStyle = () => {
    if (_.isEqual(token, selectedToken)) {
      return 'bg-gray-10'
    }
    return 'bg-gray-0 hover:bg-gray-4'
  }

  const onAddToken = e => {
    addToken(token, e)
    e.stopPropagation()
  }

  return (
    <div
      aria-hidden="true"
      onClick={() => onClick && onClick(token)}
      className={`px-6 flex justify-between items-center w-full h-14 flex-shrink-0 cursor-pointer ${getSelectedStyle()}`}
    >
      <div className="flex items-center">
        <TokenNameAndIcon size="large" chain={chain} token={token} />
        <div className="flex flex-col ml-2">
          <span className="text-gray-100">
            {chain === ChainShortNameCfx
              ? symbol
              : reference_symbol.toUpperCase()}
          </span>
          <span className="text-gray-40 text-xs">
            {chain === ChainShortNameCfx ? name : reference_name}
          </span>
        </div>
      </div>
      <div className="flex">
        {tokenAddress && (
          <span className="text-xs text-primary">{tokenAddress}</span>
        )}
        {chain !== ChainShortNameCfx && (
          <WrapIcon
            type="circle"
            className="ml-1 cursor-pointer"
            size="w-4 h-4"
            onClick={e => onAddToken(e)}
          >
            <PlusWithBg />
          </WrapIcon>
        )}
      </div>
    </div>
  )
}

TokenItem.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  selectedToken: PropTypes.object.isRequired,
  token: PropTypes.object.isRequired,
  onClick: PropTypes.func,
}

export default TokenItem
