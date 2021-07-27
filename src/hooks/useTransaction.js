/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import {convertDecimal} from '@cfxjs/data-format'
import {ProxyUrlPrefix, BigNumZero, Decimal18} from '../constants'
import {useWallet} from '../hooks/useWallet'
import {
  StatusOperation,
  Millisecond,
  ShuttleStatus,
  TypeTransaction,
} from '../constants'
import {KeyOfCfx, KeyOfBtc} from '../constants/chainConfig'
import {
  requestUserOperationList,
  requestUserOperationByHash,
} from '../utils/api'
import {useTxState} from '../state/transaction'
import {useActiveWeb3React} from './useWeb3Network'
import {useAllTokenList, mapToken} from '../hooks/useTokenList'
import {useMultipleBalance} from '../hooks/usePortal'
import {Big} from 'big.js'
import {removeTxs, appendTxs, updateTx} from '../utils/index'

//update the local data intervally
// export const useUpdateData = () => {
//   const {address: cfxAddress} = useWallet(KeyOfCfx)
//   const {data: btcData} = useSWR(
//     cfxAddress
//       ? [
//           ProxyUrlPrefix.shuttleflow,
//           'in',
//           cfxAddress,
//           Object.values(StatusOperation),
//           KeyOfBtc,
//           KeyOfCfx,
//         ]
//       : null,
//     requestUserOperationList,
//   )
//   const {data: cfxData} = useSWR(
//     cfxAddress
//       ? [
//           ProxyUrlPrefix.shuttleflow,
//           'out',
//           cfxAddress,
//           Object.values(StatusOperation),
//           KeyOfCfx,
//           null,
//         ]
//       : null,
//     requestUserOperationList,
//   )
//   return {}
// }

export const useUpdateTxs = () => {
  const {address: cfxAddress} = useWallet(KeyOfCfx)
  const {library} = useActiveWeb3React()
  const {transactions, setTransactions} = useTxState()
  const tokenList = useAllTokenList()
  const [waitingTxs, setWaitingTxs] = useState({})
  window._transactions = new Map(Object.entries(transactions))
  useUpdateWaiting(waitingTxs)
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
      if (library) {
        pendingApproveTxs.forEach(item => {
          const {hash} = item
          library.getTransactionReceipt(hash).then(res => {
            if (res?.status) {
              updateTx(trans, hash, {status: ShuttleStatus.success})
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
      const pendingTxs = {}
      const transWillRemove = [] //cfx-out btc-in
      pendingCommonTxs.forEach(item => {
        const {
          hash,
          in_or_out: type,
          fromChain,
          toChain,
          toToken,
          status,
        } = item
        const {origin} = toToken
        const isOriginCfx = origin === KeyOfCfx ? true : false
        if (fromChain === KeyOfCfx && isOriginCfx && type === 'out') {
          //native token on Conflux chain shuttle out
          if (status === ShuttleStatus.waiting) {
            pendingTxs[hash] = item
            setWaitingTxs({
              ...waitingTxs,
              ...pendingTxs,
            })
          } else {
            transWillRemove.push(item?.hash)
          }
        } else if (fromChain === KeyOfBtc && type === 'in') {
          transWillRemove.push(item?.hash)
        } else {
          proArr.push(
            requestUserOperationByHash(
              ProxyUrlPrefix.shuttleflow,
              hash,
              type,
              origin,
              isOriginCfx && toChain === KeyOfCfx ? fromChain : KeyOfCfx,
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

const useUpdateWaiting = txs => {
  const waitingItems = Object.values(txs)
  let hasNativeToken = false
  const tokenArr = []
  const newWaitingArr = []
  let nativeItem = {}
  let shuttleAddress = ''
  waitingItems.forEach(item => {
    const {toToken = {}, shuttleAddress: address} = item
    shuttleAddress = address
    if (toToken.ctoken === KeyOfCfx) {
      hasNativeToken = true
      nativeItem = item
    } else {
      hasNativeToken = false
      tokenArr.push(toToken.ctoken)
      newWaitingArr.push(item)
    }
  })
  if (hasNativeToken) {
    newWaitingArr.unshift(nativeItem)
  }
  const {address: cfxAddress} = useWallet(KeyOfCfx)
  const {transactions, setTransactions} = useTxState()
  const [balance, tokenBalances] = useMultipleBalance(shuttleAddress, tokenArr)
  let trans = new Map(Object.entries(transactions))
  useEffect(() => {
    newWaitingArr.forEach((item, index) => {
      let amount = 0
      if (hasNativeToken) {
        if (index === 0) {
          amount = getComparedBalance(balance)
        } else {
          amount = getComparedBalance(tokenBalances[index - 1])
        }
      } else {
        amount = getComparedBalance(tokenBalances[index])
      }
      updateTx(trans, item?.hash, {amount: amount, timestamp: Date.now()})
    })
    setTransactions(trans)
  }, [cfxAddress, JSON.stringify(tokenBalances), balance.toString(10)])
}

function getComparedBalance(balance) {
  if (new Big(balance || 0)?.gt(BigNumZero)) {
    return convertDecimal(balance?.toString(10), 'divide', Decimal18)
  }
  return 0
}

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
  } = item
  const isCfxChain = from_chain === KeyOfCfx ? true : false
  const newList = tokenList
    .filter(item => token === (isCfxChain ? item.ctoken : item.reference))
    .filter(item => item.to_chain === to_chain)
  const tokenInfo = (newList && newList[0]) || {}
  data.response = item
  data.decimals = tokenInfo?.decimals
  data.status = ShuttleStatus.pending
  if (status === 'confirming' || status === 'doing') {
    data.status = ShuttleStatus.pending
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
  return data
}

export const useTxData = multipleOrderedStatus => {
  const {transactions} = useTxState()
  const [arr, setArr] = useState([])
  const {address} = useWallet(KeyOfCfx)
  const currentTimestamp = Date.now()
  useEffect(() => {
    if (address) {
      const transArr = Object.values(transactions)
      let filteredTxs = transArr.filter(
        tx => tx?.timestamp >= currentTimestamp - Millisecond.day,
      ) // recent 24 hours
      let newArr = []
      multipleOrderedStatus.forEach(status => {
        let groupedArr = []
        if (status === ShuttleStatus.waiting) {
          groupedArr = filteredTxs
            .filter(tx => tx?.status === status)
            .filter(tx => tx?.amount != 0)
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
