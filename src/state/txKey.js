/**
 * mainly for the local cfx-out transactions
 */
import create from 'zustand'
import {persist} from 'zustand/middleware'

let Store = null

export const createStore = () =>
  create(
    persist(
      (set, get) => ({
        txKeys: [],
        //add to last
        appendKey: key => {
          let txKeys = get().txKeys
          if (txKeys.indexOf(key) !== -1) txKeys?.push(key)
          set({txKeys: txKeys || []})
        },
      }),
      {
        name: 'txKeys', // unique name
        getStorage: () => localStorage,
      },
    ),
  )

export const useTxKeys = () => {
  if (!Store) Store = createStore()
  const useStore = Store
  const state = useStore()
  return state
}
