import create from 'zustand'

let Store = null

const createStore = () =>
  create(set => ({
    toBtcAddress: '',
    fromBtcAddress: '',
    tokenFromBackend: {},
    error: null,
    setFromBtcAddress: fromBtcAddress => set({fromBtcAddress}),
    setToBtcAddress: toBtcAddress => set({toBtcAddress}),
    setTokenFromBackend: tokenFromBackend => set({tokenFromBackend}),
    setError: error => set({error}),
  }))

export const useShuttleState = () => {
  if (!Store) Store = createStore()
  const useStore = Store
  const state = useStore()

  return state
}
