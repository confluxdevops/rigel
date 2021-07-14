import create from 'zustand'
import {persist} from 'zustand/middleware'
import {TypeTransaction, StatusShuttleTx} from '../constants'

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
  const infoData = {
    local_timestamp: Date.now(),
    type: TypeTransaction.transaction,
    status: StatusShuttleTx.pending,
  }
  const mergedData = {...infoData, ...data}
  return mergedData
}

export const createStore = () =>
  create(
    persist(
      (set, get) => ({
        transactions: [],
        addTx: tx => {
          let trans = get().transactions
          trans?.unshift(mergeData(tx))
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
