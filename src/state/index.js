import create from 'zustand'

let Store = null

const createStore = () =>
  create(set => ({
    toBtcAddress: '',
    fromBtcAddress: '',
    setFromBtcAddress: fromBtcAddress => set({fromBtcAddress}),
    setToBtcAddress: toBtcAddress => set({toBtcAddress}),
  }))

export const useShuttleState = () => {
  if (!Store) Store = createStore()
  const useStore = Store
  const state = useStore()

  return state
}
