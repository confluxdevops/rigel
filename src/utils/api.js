import jsonRpc from './request'

export function getAllTokenList(url) {
  return jsonRpc(url, 'getTokenList', {})
}

export function searchToken(url, fromChain, toChian, address) {
  return jsonRpc(url, 'searchToken', {
    from_chain: fromChain,
    to_chain: toChian,
    token_address: address,
  })
}
