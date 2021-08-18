import create from 'zustand'
import {persist} from 'zustand/middleware'
import fromEntries from 'object.fromentries'

let Store = null

export const createStore = () =>
  create(
    persist(
      (set, get) => ({
        claimedTxs: {},
        setClaimedTxs: claimedTxs => {
          set({claimedTxs: fromEntries(claimedTxs)})
        },
        setTx: (hash, value) => {
          let trans = get().claimedTxs
          trans[hash] = value
          set({claimedTxs: trans})
        },
      }),
      {
        name: 'claimedTxs', // unique name
        getStorage: () => localStorage,
      },
    ),
  )

export const useClaimedTxState = () => {
  if (!Store) Store = createStore()
  const useStore = Store
  const state = useStore()
  return state
}
