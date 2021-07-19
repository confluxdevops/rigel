/* eslint-disable no-debugger */
import create from 'zustand'
import {persist} from 'zustand/middleware'
import {TypeTransaction, ShuttleStatus} from '../constants'
import {KeyOfCfx} from '../constants/chainConfig'

let Store = null

// middleware: merge some data to original transaction data
// const mergeData = config => (set, get, api) => config(args => {
//   console.log("original applying", args)
//   const infoData={
//     local_timestamp:Date.now(),
//     local_txType:TypeTransaction.transaction
//   }
//   const mergedArgs={...infoData,...args}
//   set(mergedArgs)
//   console.log("new state", get())
// }, get, api)

const mergeData = data => {
  const isToChainCfx = data?.toChain === KeyOfCfx
  const infoData = {
    timestamp: Date.now(),
    tx_type: TypeTransaction.transaction,
    status: ShuttleStatus.pending,
    in_or_out: isToChainCfx ? 'in' : 'out',
  }
  const mergedData = {...infoData, ...data}
  return mergedData
}

export const createStore = () =>
  create(
    persist(
      (set, get) => ({
        transactions: [],
        //add to top
        unshiftTx: tx => {
          let trans = get().transactions
          trans?.unshift(mergeData(tx))
          set({transactions: trans || []})
        },
        updateTx: (hash, data) => {
          let trans = get().transactions
          const index = trans.findIndex(tran => tran.hash == hash)
          trans[index] = {...trans[index], ...data}
          set({transactions: trans})
        },
        //remove by key: hash
        removeTx: hash => {
          let trans = get().transactions
          const index = trans.findIndex(tran => tran.hash == hash)
          trans.splice(index, 1)
          set({transactions: trans})
        },
        //add to last
        appendTx: tx => {
          let trans = get().transactions
          trans?.push(tx)
          set({transactions: trans || []})
        },
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
