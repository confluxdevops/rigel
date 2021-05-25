import jsonRpc, {requestSf} from './request'

export function getAllTokenList(url) {
  return jsonRpc(url, 'getTokenList', {})
}

export function searchToken(fromChain, toChian, address) {
  return requestSf('searchToken', {
    from_chain: fromChain,
    to_chain: toChian,
    token_address: address,
  })
}
