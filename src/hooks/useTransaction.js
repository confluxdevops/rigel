/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import {useCallback, useEffect} from 'react'
import useSWR from 'swr'
import {ProxyUrlPrefix} from '../constants'
import {useWallet} from '../hooks/useWallet'
import {
  StatusOperation,
  Millisecond,
  StatusShuttleTx,
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

//update the local data intervally
export const useUpdateData = () => {
  const {address: cfxAddress} = useWallet(KeyOfCfx)
  const {data: btcData} = useSWR(
    cfxAddress
      ? [
          ProxyUrlPrefix.shuttleflow,
          'in',
          cfxAddress,
          Object.values(StatusOperation),
          KeyOfBtc,
          KeyOfCfx,
        ]
      : null,
    requestUserOperationList,
  )
  const {data: cfxData} = useSWR(
    cfxAddress
      ? [
          ProxyUrlPrefix.shuttleflow,
          'out',
          cfxAddress,
          Object.values(StatusOperation),
          KeyOfCfx,
          null,
        ]
      : null,
    requestUserOperationList,
  )
  return {}
}

export const useFilterData = () => {
  const {address: cfxAddress} = useWallet(KeyOfCfx)
  const {library} = useActiveWeb3React()
  const {transactions, removeTx, appendTx, updateTx} = useTxState(
    useCallback(state => state.transactions, []),
  )
  const currentTimestamp = Date.now()
  const tokenList = useAllTokenList()
  useEffect(() => {
    // let doingTxs=transactions
    // .filter((tx) => tx?.timestamp >= currentTimestamp - Millisecond.day)// recent 24 hours
    // .filter(
    //   (tx) =>
    //     tx?.status === StatusShuttleTx.pending ||
    //     tx?.status === StatusShuttleTx.waiting
    // )

    //when tx type is approve transaction
    const approveTxs = transactions.filter(
      item => item.tx_type === TypeTransaction.approve,
    )
    const pendingApproveTxs = approveTxs.filter(
      item => item.status === StatusShuttleTx.pending,
    )
    if (library) {
      pendingApproveTxs.forEach(item => {
        const {hash} = item
        library.getTransactionReceipt(hash).then(res => {
          if (res?.status) {
            updateTx(hash, {status: StatusShuttleTx.success})
          }
        })
      })
    }

    // when tx type is common transacton
    let proArr = []
    debugger
    const commonTxs = transactions.filter(
      item => item.tx_type === TypeTransaction.transaction,
    )
    const filteredTxs = commonTxs
      .filter(
        item =>
          item.status === StatusShuttleTx.success ||
          item.status === StatusShuttleTx.error,
      )
      .map(item => {
        removeTx(item?.hash)
        return item
      })
    const pendingCommonTxs = commonTxs.filter(
      item =>
        item.status === StatusShuttleTx.pending ||
        item.status === StatusShuttleTx.waiting,
    )
    pendingCommonTxs.forEach(item => {
      const {hash, in_or_out: type, fromChain, toChain, toToken} = item
      const {origin} = toToken
      const isOriginCfx = origin === KeyOfCfx
      proArr.push(
        requestUserOperationByHash(
          ProxyUrlPrefix.shuttleflow,
          hash,
          type,
          origin,
          isOriginCfx && toChain === KeyOfCfx ? fromChain : KeyOfCfx,
        ),
      )
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
          newList.map(item => appendTx(item))
        }
      })
    })
    // const {data:listData}=useSWR(cfxAddress?[ProxyUrlPrefix.shuttleflow,null,cfxAddress,Object.values(StatusOperation),null,null,10000]:null)
    // console.log('listData',listData)
  }, [cfxAddress, transactions])
}

/**
 * Get tokenInfo from tokenList by token address
 * Transfer api data to local data
 */
function mapData(item = {}, tokenList) {
  const data = {}
  if (!item) return {}
  const {from_chain, to_chain, token} = item
  const isCfxChain = from_chain === KeyOfCfx
  const newList = tokenList
    .filter(item => token === (isCfxChain ? item.ctoken : item.reference))
    .filter(item => item.to_chain === to_chain)
  const tokenInfo = (newList && newList[0]) || {}
  data.toToken = JSON.parse(JSON.stringify(tokenInfo))
  data.response = item
  data.decimals = tokenInfo?.decimals
  data.status = StatusShuttleTx.pending
  if (item.status === 'confirming' || item.status === 'doing') {
    data.status = StatusShuttleTx.pending
  }
  if (item.status === 'finished') {
    data.status = 'success'
  }
  if (item.status === 'invalid') {
    data.status = 'error'
  }
  data.timestamp = item.timestamp
  data.in_or_out = item.in_or_out
  data.tx_type = TypeTransaction.transaction
  data.hash = item.nonce_or_txid?.split('_')[0]
  return data
}

export const useTxData = () => {
  const {transactions, updateTx} = useTxState()
  const {address: cfxAddress} = useWallet(KeyOfCfx)
  const {address: web3Address} = useWallet(KeyOfEth)
  const {library} = useActiveWeb3React()
  const currentTimestamp = Date.now()
  let filteredTxs = transactions
    .filter(tx => tx?.local_timestamp >= currentTimestamp - Millisecond.day) // recent 24 hours
    .filter(
      tx =>
        tx?.fromAddress === cfxAddress ||
        tx?.fromAddress === web3Address ||
        (tx?.fromChain === KeyOfBtc && tx?.toAddress === cfxAddress),
    )
    .filter(
      tx =>
        tx?.status === StatusShuttleTx.pending ||
        tx?.status === StatusShuttleTx.waiting,
    )
    .forEach(item => {
      const {type, hash} = item
      //only the chain based on ethereum need approve
      if (library && type === TypeTransaction.approve) {
        library.getTransactionReceipt(hash).then(res => {
          if (res?.status) {
            updateTx(hash, {status: StatusShuttleTx.success})
          }
        })
      }
      if (type === TypeTransaction.transaction) {
        //
      }
    })

  //approve, transaction: common uncommon
  return filteredTxs
}
