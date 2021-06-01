import {isHexAddress} from '@cfxjs/account'
import {validateBase32Address} from '@cfxjs/base32-address'
import {ChainIdCfx} from '../constants/chainConfig'

export const IS_DEV =
  window.location.hostname === 'localhost' ||
  window.location.hostname.indexOf('test') > -1

export function checkHexAddress(address) {
  return isHexAddress(address)
}

export function checkCfxTokenAddress(address) {
  return validateBase32Address(
    address,
    IS_DEV ? ChainIdCfx.TESTNET : ChainIdCfx.MAINNET,
    'contract',
  )
}

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

export function shortenEthAddress(address) {
  if (!checkHexAddress(address)) return ''
  return getEllipsStr(address, 6, 4)
}

export function shortenCfxAddress(address) {
  if (!checkCfxTokenAddress(address)) ''
  const arr = address.split(':')
  const secondStr = getEllipsStr(arr[1], 4, 4)
  return arr[0] + ':' + secondStr
}
