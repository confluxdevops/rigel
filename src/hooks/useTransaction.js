/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import {useCallback, useEffect, useState} from 'react'
import {convertDecimal} from '@cfxjs/data-format'
import {ProxyUrlPrefix, BigNumZero, Decimal18} from '../constants'
import {useWallet} from '../hooks/useWallet'
import {
  StatusOperation,
  Millisecond,
  ShuttleStatus,
  TypeTransaction,
} from '../constants'
import {KeyOfCfx, KeyOfBtc, KeyOfEth} from '../constants/chainConfig'
import {
  requestUserOperationList,
  requestUserOperationByHash,
} from '../utils/api'
import {useTxState} from '../state/transaction'
import {useActiveWeb3React} from './useWeb3Network'
import {useAllTokenList} from '../hooks/useTokenList'
import {useMultipleBalance} from '../hooks/usePortal'
import {Big} from 'big.js'

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
  const {transactions, removeTx, updateTx, appendTxs} = useTxState(
    useCallback(state => state.transactions, []),
  )
  const tokenList = useAllTokenList()
  const [waitingTxs, setWaitingTxs] = useState({})
  useUpdateWaiting(waitingTxs)
  useEffect(() => {
    const update = () => {
      //when tx type is approve transaction
      const approveTxs = transactions.filter(
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
              updateTx(hash, {status: ShuttleStatus.success})
            }
          })
        })
      }

      // when tx type is common transacton
      let proArr = []
      const commonTxs = transactions.filter(
        item => item.tx_type === TypeTransaction.transaction,
      )
      commonTxs
        .filter(
          item =>
            item.status === ShuttleStatus.success ||
            item.status === ShuttleStatus.error,
        )
        .map(item => {
          removeTx(item?.hash)
          return item
        })

      const pendingCommonTxs = commonTxs.filter(
        item =>
          item.status === ShuttleStatus.pending ||
          item.status === ShuttleStatus.waiting,
      )
      const pendingTxs = {}
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
        const isOriginCfx = origin === KeyOfCfx
        if (
          fromChain === KeyOfCfx &&
          isOriginCfx &&
          type === 'out' &&
          status === ShuttleStatus.waiting
        ) {
          //native token on Conflux chain shuttle out
          pendingTxs[hash] = item
          setWaitingTxs({
            ...waitingTxs,
            ...pendingTxs,
          })
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
      Promise.all(proArr).then(response => {
        response.forEach((item, index) => {
          if (item) {
            removeTx(pendingCommonTxs[index]?.hash)
          }
        })
        requestUserOperationList(
          ProxyUrlPrefix.shuttleflow,
          null,
          cfxAddress,
          Object.values(StatusOperation),
          null,
          null,
          10000,
        ).then(list => {
          if (list) {
            const newList = list.map(item => mapData(item, tokenList))
            appendTxs(newList)
          }
        })
      })
    }
    update()
    // if (cfxAddress) {
    //   const timeInterval = setInterval(() => update(), 30000)
    //   return () => clearInterval(timeInterval)
    // }
  }, [cfxAddress])
}

const useUpdateWaiting = txs => {
  console.log('txs', txs)
  const waitingItems = Object.values(txs)
  console.log('waitingItems', waitingItems)
  let hasNativeToken = false
  const tokenArr = []
  const newWaitingArr = []
  let nativeItem = {}
  let shuttleAddress = ''
  waitingItems.forEach(item => {
    console.log('item', item)
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
  console.log('tokenArr', tokenArr)
  const {address: cfxAddress} = useWallet(KeyOfCfx)
  const {updateTx} = useTxState()
  console.log('shuttleAddress', shuttleAddress)
  const [balance, tokenBalances] = useMultipleBalance(shuttleAddress, tokenArr)
  console.log('balance', balance)
  console.log('tokenBalances', tokenBalances)

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
      console.log('amount', amount)
      updateTx(item?.hash, {amount: amount})
    })
  }, [cfxAddress, JSON.stringify(tokenBalances)])
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
  } = item
  const isCfxChain = from_chain === KeyOfCfx
  const newList = tokenList
    .filter(item => token === (isCfxChain ? item.ctoken : item.reference))
    .filter(item => item.to_chain === to_chain)
  const tokenInfo = (newList && newList[0]) || {}
  data.toToken = JSON.parse(JSON.stringify(tokenInfo))
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
  data.toAddress = to_addr
  data.tx_type = TypeTransaction.transaction
  data.hash = nonce_or_txid?.split('_')[0]
  return data
}

export const useTxData = multipleOrderedStatus => {
  const {transactions} = useTxState()
  const {address: cfxAddress} = useWallet(KeyOfCfx)
  const [arr, setArr] = useState([])

  const currentTimestamp = Date.now()
  useEffect(() => {
    let filteredTxs = transactions.filter(
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
      console.log('groupedArr', groupedArr)
      groupedArr.sort(function (a, b) {
        return b.timestamp - a.timestamp
      })
      newArr = newArr.concat(groupedArr)
      console.log('newArr', newArr)
    })
    setArr(newArr)
    console.log('arr', arr.length)
  }, [transactions])
  return arr
}
