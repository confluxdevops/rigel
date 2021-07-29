import create from 'zustand'
import {persist} from 'zustand/middleware'
import {TypeTransaction, ShuttleStatus} from '../constants'
import {KeyOfCfx} from '../constants/chainConfig'

let Store = null

const mergeData = data => {
  const isToChainCfx = data?.toChain === KeyOfCfx ? true : false
  const {fromChain, toToken} = data
  let status = ShuttleStatus.pending
  if (fromChain === KeyOfCfx && toToken?.origin === KeyOfCfx) {
    // conflux native token shuttle out
    status = ShuttleStatus.waiting
  }
  const infoData = {
    timestamp: Date.now(),
    tx_type: TypeTransaction.transaction,
    status,
    in_or_out: isToChainCfx ? 'in' : 'out',
  }
  const mergedData = {...infoData, ...data}
  return mergedData
}

export const createStore = () =>
  create(
    persist(
      (set, get) => ({
        transactions: {},
        setTransactions: transactions => {
          set({transactions: Object.fromEntries(transactions)})
        },
        unshiftTx: tx => {
          let trans = get().transactions
          const {fromChain, shuttleAddress, toToken = {}} = tx
          const {origin, ctoken} = toToken
          const isCfxChainOut = fromChain === KeyOfCfx && origin === KeyOfCfx
          const transArr = Object.values(trans)
          const waitingCfxOutTrans = transArr.filter(
            tran =>
              tran?.shuttleAddress === shuttleAddress &&
              tran?.toToken?.ctoken === ctoken &&
              tran?.status === ShuttleStatus.waiting,
          )
          if (!(isCfxChainOut && waitingCfxOutTrans.length > 0)) {
            trans[tx.hash] = mergeData(tx)
          }
          set({transactions: trans})
        },
        // updateTx: (hash, data) => {
        //   let trans = get().transactions
        //   const index = trans.findIndex(tran => tran.hash == hash)
        //   trans[index] = {...trans[index], ...data}
        //   set({transactions: trans})
        // },
        // //remove by key: hash
        // removeTx: hash => {
        //   let trans = get().transactions
        //   const index = trans.findIndex(tran => tran.hash == hash)
        //   trans.splice(index, 1)
        //   set({transactions: trans})
        // },
        // //add to last
        // appendTx: tx => {
        //   let trans = get().transactions
        //   trans?.push(tx)
        //   set({transactions: trans || []})
        // },
        // appendTxs: txs => {
        //   let trans = get().transactions
        //   let newTrans = JSON.parse(JSON.stringify(trans))
        //   newTrans = newTrans?.concat(txs)
        //   set({transactions: newTrans})
        // },
        // removeTxs: hashs => {
        //   let trans = get().transactions
        //   let newTrans = JSON.parse(JSON.stringify(trans))
        //   hashs.forEach(hash => {
        //     const index = newTrans.findIndex(tran => tran.hash == hash)
        //     newTrans.splice(index, 1)
        //   })
        //   set({transactions: newTrans})
        // },
      }),
      {
        name: 'transactions', // unique name
        getStorage: () => localStorage,
      },
    ),
  )

export const useTxState = () => {
  if (!Store) Store = createStore()
  const useStore = Store
  const state = useStore()
  return state
}
