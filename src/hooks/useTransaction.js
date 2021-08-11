/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import {convertDecimal} from '@cfxjs/data-format'
import {useWallet} from '../hooks/useWallet'
import {
  StatusOperation,
  ShuttleStatus,
  TypeTransaction,
  ProxyUrlPrefix,
} from '../constants'
import {KeyOfCfx, KeyOfBtc} from '../constants/chainConfig'
import {
  requestUserOperationList,
  requestUserOperationByHash,
} from '../utils/api'
import {useTxState} from '../state/transaction'
import {useActiveWeb3React} from './useWeb3Network'
import {useAllTokenList, mapToken} from '../hooks/useTokenList'
import {removeTxs, appendTxs, updateTx} from '../utils/index'

export const useUpdateTxs = () => {
  const {address: cfxAddress} = useWallet(KeyOfCfx)
  const {library} = useActiveWeb3React()
  const {transactions, setTransactions} = useTxState()
  const tokenList = useAllTokenList()
  window._transactions = new Map(Object.entries(transactions))
  useEffect(() => {
    const update = () => {
      let trans = new Map(window._transactions)
      let transArr = [...trans.values()]
      //when tx type is approve transaction
      const approveTxs = transArr.filter(
        item => item.tx_type === TypeTransaction.approve,
      )
      const pendingApproveTxs = approveTxs.filter(
        item => item.status === ShuttleStatus.pending,
      )
      const pendingInApproveTxs = pendingApproveTxs.filter(
        item => item.fromChain !== KeyOfCfx,
      )
      if (library) {
        pendingInApproveTxs.forEach(item => {
          const {hash} = item
          library.getTransactionReceipt(hash).then(res => {
            if (res?.status) {
              updateTx(trans, hash, {status: ShuttleStatus.success})
            } else {
              updateTx(trans, hash, {status: ShuttleStatus.error})
            }
          })
        })
      }

      const pendingOutApproveTxs = pendingApproveTxs.filter(
        item => item.fromChain === KeyOfCfx,
      )

      if (window?.confluxJS) {
        pendingOutApproveTxs.forEach(item => {
          const {hash} = item
          window.confluxJS.getTransactionReceipt(hash).then(res => {
            if (res?.outcomeStatus == 0) {
              updateTx(trans, hash, {status: ShuttleStatus.success})
            } else {
              updateTx(trans, hash, {status: ShuttleStatus.error})
            }
          })
        })
      }

      // when tx type is common transacton
      let proArr = []
      const commonTxs = transArr.filter(
        item => item.tx_type === TypeTransaction.transaction,
      )
      const hashArr = []
      commonTxs
        .filter(
          item =>
            item.status === ShuttleStatus.success ||
            item.status === ShuttleStatus.error,
        )
        .map(item => {
          hashArr.push(item?.hash)
        })
      removeTxs(trans, hashArr)
      const pendingCommonTxs = commonTxs.filter(
        item =>
          item.status === ShuttleStatus.pending ||
          item.status === ShuttleStatus.waiting,
      )
      const transWillRemove = [] //cfx-out btc-in
      pendingCommonTxs.forEach(item => {
        const {hash, in_or_out: type, fromChain, toToken} = item
        const {origin, to_chain} = toToken
        if (fromChain === KeyOfBtc && type === 'in') {
          transWillRemove.push(item?.hash)
        } else {
          proArr.push(
            requestUserOperationByHash(
              ProxyUrlPrefix.shuttleflow,
              hash,
              type,
              origin,
              to_chain,
            ),
          )
        }
      })
      removeTxs(trans, transWillRemove)
      Promise.all(proArr).then(response => {
        let hashArr = []
        response.forEach((item, index) => {
          if (item) {
            hashArr.push(pendingCommonTxs[index]?.hash)
          }
        })
        removeTxs(trans, hashArr)
        requestUserOperationList(
          ProxyUrlPrefix.shuttleflow,
          null,
          cfxAddress,
          Object.values(StatusOperation),
          null,
          null,
          10000,
        )
          .then(list => {
            if (list) {
              const newList = list.map(item => mapData(item, tokenList))
              appendTxs(trans, newList)
            }
            setTransactions(trans)
          })
          .finally(() => {})
      })
    }
    update()
    let timeInterval
    if (cfxAddress) {
      timeInterval = setInterval(() => update(), 30000)
    }
    return () => {
      timeInterval && clearInterval(timeInterval)
    }
  }, [cfxAddress])
}

// const useUpdateWaiting = txs => {
//   const waitingItems = Object.values(txs)
//   let hasNativeToken = false
//   const tokenArr = []
//   const newWaitingArr = []
//   let nativeItem = {}
//   let shuttleAddress = ''
//   waitingItems.forEach(item => {
//     const {toToken = {}, shuttleAddress: address} = item
//     shuttleAddress = address
//     if (toToken.ctoken === KeyOfCfx) {
//       hasNativeToken = true
//       nativeItem = item
//     } else {
//       tokenArr.push(toToken.ctoken)
//       newWaitingArr.push(item)
//     }
//   })
//   if (hasNativeToken) {
//     newWaitingArr.unshift(nativeItem)
//   }
//   const {address: cfxAddress} = useWallet(KeyOfCfx)
//   const {transactions, setTransactions} = useTxState()
//   const [balance, tokenBalances] = useMultipleBalance(shuttleAddress, tokenArr)
//   let trans = new Map(Object.entries(transactions))
//   useEffect(() => {
//     newWaitingArr.forEach((item, index) => {
//       let amount = 0
//       if (hasNativeToken) {
//         if (index === 0) {
//           amount = getComparedBalance(balance)
//         } else {
//           amount = getComparedBalance(tokenBalances[index - 1])
//         }
//       } else {
//         amount = getComparedBalance(tokenBalances[index])
//       }
//       const amountMinus = new Big(amount).minus(item?.fee)
//       amount = amountMinus.gt(0) ? amountMinus.toString(10) : '0'
//       updateTx(trans, item?.hash, {amount: amount, timestamp: Date.now()})
//     })
//     setTransactions(trans)
//   }, [cfxAddress, JSON.stringify(tokenBalances), balance.toString(10)])
// }

/**
 * Get tokenInfo from tokenList by token address
 * Merge api data to local data
 */
function mapData(item = {}, tokenList) {
  const data = {}
  if (!item) return {}
  const {
    from_chain,
    to_chain,
    token,
    status,
    timestamp,
    in_or_out,
    nonce_or_txid,
    to_addr,
    amount,
    tx_to,
    tx_input,
  } = item
  const isCfxChain = from_chain === KeyOfCfx ? true : false
  const newList = tokenList
    .filter(item => token === (isCfxChain ? item.ctoken : item.reference))
    .filter(item => item.to_chain === to_chain)
  const tokenInfo = (newList && newList[0]) || {}
  data.response = item
  data.decimals = tokenInfo?.decimals
  data.status = ShuttleStatus.pending
  if (status === 'confirming') {
    data.status = ShuttleStatus.pending
  }
  if (status === 'doing') {
    if (tx_to && tx_input) {
      data.status = ShuttleStatus.waiting
    } else {
      data.status = ShuttleStatus.pending
    }
  }
  if (status === 'finished') {
    data.status = 'success'
  }
  if (status === 'invalid') {
    data.status = 'error'
  }
  data.timestamp = timestamp
  data.in_or_out = in_or_out
  if (in_or_out === 'in') {
    if (from_chain === KeyOfCfx) {
      data.fromChain = to_chain
      data.toChain = from_chain
    } else {
      data.fromChain = from_chain
      data.toChain = to_chain
    }
  }
  if (in_or_out === 'out') {
    if (from_chain === KeyOfCfx) {
      data.fromChain = from_chain
      data.toChain = to_chain
    } else {
      data.fromChain = to_chain
      data.toChain = from_chain
    }
  }
  data.fromToken = JSON.parse(
    JSON.stringify(mapToken(tokenInfo, data.fromChain === KeyOfCfx)),
  )
  data.toToken = JSON.parse(
    JSON.stringify(mapToken(tokenInfo, data.toChain === KeyOfCfx)),
  )
  data.toAddress = to_addr
  data.tx_type = TypeTransaction.transaction
  data.hash = nonce_or_txid?.split('_')[0]
  data.amount = convertDecimal(amount, 'divide', data.decimals)
  data.tx_to = tx_to
  data.tx_input = tx_input
  return data
}

export const useTxData = (
  multipleOrderedStatus,
  transactionTypes = Object.values(TypeTransaction),
) => {
  const {transactions} = useTxState()
  const [arr, setArr] = useState([])
  const {address} = useWallet(KeyOfCfx)
  useEffect(() => {
    if (address) {
      const transArr = Object.values(transactions)
      let filteredTxs = transArr.filter(
        tx => transactionTypes.indexOf(tx?.tx_type) != -1,
      )
      let newArr = []
      multipleOrderedStatus.forEach(status => {
        let groupedArr = []
        if (status === ShuttleStatus.success) {
          groupedArr = filteredTxs.filter(tx => tx?.status === status)
          if (groupedArr.length > 100) groupedArr = groupedArr.slice(0, 100) //first 100 element
        } else {
          groupedArr = filteredTxs.filter(tx => tx?.status === status)
        }
        groupedArr.sort(function (a, b) {
          return b.timestamp - a.timestamp
        })
        newArr = newArr.concat(groupedArr)
      })
      setArr(newArr)
    } else {
      setArr([])
    }
  }, [JSON.stringify(transactions), address])
  return arr
}
