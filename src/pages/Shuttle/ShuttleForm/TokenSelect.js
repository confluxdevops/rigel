import PropTypes from 'prop-types'
import {BgArrowRight} from '../../../assets/svg'
import {WrapIcon} from '../../../components'
import {TokenIcon} from '../../components'
import {SupportedChains} from '../../../constants/chainConfig'

function TokenSelect({token, onClick, type, chain}) {
  let className = ''
  switch (type) {
    case 'from':
      className = 'text-black'
      break
    case 'to':
      className = 'text-gray-40'
      break
  }

  return (
    <div
      className={`flex items-center bg-gray-10 ${
        type === 'from' ? 'cursor-pointer' : ''
      }`}
      onClick={e => onClick && onClick(e)}
      aria-hidden="true"
    >
      <TokenIcon token={token} chain={chain} />
      <span className={`ml-1 ${className}`}>{token && token.symbol}</span>
      {type === 'from' && (
        <WrapIcon type="circle" className="ml-1">
          <BgArrowRight />
        </WrapIcon>
      )}
    </div>
  )
}

TokenSelect.propTypes = {
  token: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['from', 'to']).isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default TokenSelect
