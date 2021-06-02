import {isHexAddress} from '@cfxjs/account'
import {validateBase32Address} from '@cfxjs/base32-address'
import {ChainIdCfx, KeyOfCfx} from '../constants/chainConfig'
import {getEllipsStr, IS_DEV} from '../utils'

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

export function shortenAddress(chain, address) {
  return chain === KeyOfCfx
    ? shortenCfxAddress(address)
    : shortenEthAddress(address)
}
