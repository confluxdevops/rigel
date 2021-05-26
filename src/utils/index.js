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
