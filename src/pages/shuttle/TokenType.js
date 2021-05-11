import PropTypes from 'prop-types'
import imgArrow from './../../assets/images/arrow-right.svg'
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
        <img src={imgArrow} alt="arraw" className="w-3.5 h-3.5 ml-1" />
      )}
    </div>
  )
}
TokenType.propTypes = {
  token: PropTypes.object,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['from', 'to']),
}
export default TokenType
