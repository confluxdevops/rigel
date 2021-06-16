import {ChainConfig} from '../constants/chainConfig'
import Big from 'big.js'
import {BigNumZero} from '../constants'

export const IS_DEV =
  window.location.hostname === 'localhost' ||
  window.location.hostname.indexOf('test') > -1

export const getEllipsStr = (str, frontNum, endNum) => {
  if (str) {
    const length = str.length
    if (endNum === 0 && length <= frontNum) {
      return str.substring(0, frontNum)
    }
    return (
      str.substring(0, frontNum) +
      '...' +
      str.substring(length - endNum, length)
    )
  }
  return ''
}

export const getMaxAmount = (chain, amount) => {
  const remainderAmount = ChainConfig[chain]?.remainderAmount
  let amountBig = new Big(amount)
  if (amountBig.gt(remainderAmount)) {
    return amountBig.minus(remainderAmount)
  } else {
    return BigNumZero
  }
}
