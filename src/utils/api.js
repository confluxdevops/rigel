import jsonRpc from './request'

export function requestAllTokenList(url) {
  return jsonRpc(url, 'getTokenList', [null])
}

export function requestToken(url, fromChain, toChain, address) {
  return jsonRpc(url, 'searchToken', {
    from_chain: fromChain,
    to_chain: toChain,
    token_address: address,
  })
}
