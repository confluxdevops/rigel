const timeout = 6000
import {ProxyUrlPrefix} from './../constants'

/**
 * request the remote api
 * @param {*} url
 * @param {*} method rpc method
 * @param {*} params body params
 * @returns
 */
export default function jsonRpc(url, method, params) {
  const data = {id: 1, jsonrpc: '2.0', method, ...params}
  return fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
    timeout,
  })
    .then(response => {
      if (!response.ok) {
        const error = new Error()
        error.status = response.status
        return Promise.reject(error)
      }
      return response.json()
    })
    .then(json => {
      return json.result
    })
}

/**
 * request the remote url based on the 'shuttleflow' prefix
 * @returns
 */
export function requestSf(method, params) {
  return jsonRpc(ProxyUrlPrefix.shuttleflow, method, params)
}

/**
 * request the remote url based on the 'sponsor' prefix
 * @returns
 */
export function requestSponsor(method, params) {
  return jsonRpc(ProxyUrlPrefix.sponsor, method, params)
}
