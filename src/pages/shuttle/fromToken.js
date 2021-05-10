import React from 'react'
import PropTypes from 'prop-types'
import imgArrow from './../../assets/images/arrow-right.svg'
import TokenIcon from './../components/TokenIcon'
function FromToken({token, onClick}) {
  return (
    <div
      className="inline-flex items-center"
      onClick={e => onClick && onClick(e)}
      aria-hidden="true"
    >
      <TokenIcon token={token}></TokenIcon>
      <span className="text-black text-sm font-normal ml-1">
        {token && token.symbol}
      </span>
      <img src={imgArrow} alt="arraw" className="w-3.5 h-3.5 ml-1" />
    </div>
  )
}
FromToken.propTypes = {
  token: PropTypes.object,
  onClick: PropTypes.func,
}
export default FromToken
