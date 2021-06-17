import create from 'zustand'

let Store = null

const createStore = () =>
  create(set => ({
    btcAddress: '',
    setBtcAddress: btcAddress => set({btcAddress}),
  }))

export const useState = () => {
  if (!Store) Store = createStore()
  const useStore = Store
  const state = useStore()

  return state
}
