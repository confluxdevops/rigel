import PropTypes from 'prop-types'
import {ArrowRightWithBg} from '../../assets/svg'
import {WrapIcon} from '../../components'
import {TokenNameAndIcon} from '../components'
import {SupportedChains} from '../../constants/chainConfig'

function TokenType({token, onClick, type, chain}) {
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
      className="inline-flex items-center"
      onClick={e => onClick && onClick(e)}
      aria-hidden="true"
    >
      <TokenNameAndIcon token={token} chain={chain}></TokenNameAndIcon>
      <span className={`ml-1 ${className}`}>{token && token.symbol}</span>
      {type === 'from' && (
        <WrapIcon type="circle" className="ml-1" size="w-4 h-4">
          <ArrowRightWithBg />
        </WrapIcon>
      )}
    </div>
  )
}

TokenType.propTypes = {
  token: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['from', 'to']).isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default TokenType
