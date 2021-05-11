import PropTypes from 'prop-types'
import {ArrowRight} from '../../assets/svg'
import {WrapIcon} from '../../components'
import {TokenNameAndIcon} from '../components'

function TokenType({token, onClick, type}) {
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
      <TokenNameAndIcon token={token}></TokenNameAndIcon>
      <span className={`text-sm font-normal ml-1 ${className}`}>
        {token && token.symbol}
      </span>
      {type === 'from' && (
        <WrapIcon className="ml-1" size="w-4 h-4">
          <ArrowRight />
        </WrapIcon>
      )}
    </div>
  )
}

TokenType.propTypes = {
  token: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['from', 'to']).isRequired,
}

export default TokenType
