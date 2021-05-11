import PropTypes from 'prop-types'
import {ReactComponent as ArrowRight} from './../../assets/images/arrow-right.svg'
import TokenNameAndIcon from './../components/TokenNameAndIcon'

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
        <ArrowRight className="w-3.5 h-3.5 ml-1 text-gray-60" />
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
