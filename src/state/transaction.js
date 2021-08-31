import create from 'zustand'
import {persist} from 'zustand/middleware'
import fromEntries from 'object.fromentries'
import {TypeTransaction, ShuttleStatus} from '../constants'
import {KeyOfCfx} from '../constants/chainConfig'

let Store = null

const mergeData = data => {
  const isToChainCfx = data?.toChain === KeyOfCfx ? true : false
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
        transactions: {},
        setTransactions: transactions => {
          console.warn(
            'setTransactions-first-length',
            Object.values(get().transactions).length,
          )
          console.warn('setTransactions-first', get().transactions)
          set({transactions: fromEntries(transactions)})
          console.warn(
            'setTransactions-last-length',
            Object.values(get().transactions).length,
          )
          console.warn('setTransactions-last', get().transactions)
        },
        unshiftTx: tx => {
          console.warn('unshiftTx-tx', tx)
          console.warn('unshiftTx-tx-hash', tx.hash)
          let trans = get().transactions
          trans[tx.hash] = mergeData(tx)
          console.warn(
            'unshiftTx-Transactions-first-length',
            Object.values(get().transactions).length,
          )
          console.warn('unshiftTx-Transactions-first', get().transactions)
          set({transactions: trans})
          console.warn(
            'unshiftTx-Transactions-last-length',
            Object.values(get().transactions).length,
          )
          console.warn('unshiftTx-Transactions-last', get().transactions)
        },
        claimedTxs: {},
        setClaimedTxs: claimedTxs => {
          console.warn(
            'setClaimedTxs-Transactions-first-length',
            Object.values(get().transactions).length,
          )
          console.warn('setClaimedTxs-Transactions-first', get().transactions)
          set({claimedTxs: fromEntries(claimedTxs)})
          console.warn(
            'setClaimedTxs-Transactions-last-length',
            Object.values(get().transactions).length,
          )
          console.warn('setClaimedTxs-Transactions-last', get().transactions)
        },
        setTx: (hash, value) => {
          console.warn('setTx-hash', hash)
          console.warn(
            'setTx-Transactions-first-length',
            Object.values(get().transactions).length,
          )
          console.warn('setTx-Transactions-first', get().transactions)
          let trans = get().claimedTxs
          trans[hash] = value
          set({claimedTxs: trans})
          console.warn(
            'setTx-Transactions-last-length',
            Object.values(get().transactions).length,
          )
          console.warn('setTx-Transactions-last', get().transactions)
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
