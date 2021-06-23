import {ContractConfig} from '../constants/contractConfig'
import {useContract as useContractPortal} from '../hooks/usePortal'
import {useContract as useContractWeb3} from '../hooks/useWeb3Network'
import {KeyOfMetaMask, KeyOfPortal} from '../constants/chainConfig'

export function useShuttleContract(contractType, chain) {
  const contractObj = ContractConfig[contractType]
  const {abi, wallet} = contractObj
  const addressOfChain = contractObj?.address?.[chain]
  let address = addressOfChain ? addressOfChain : contractObj?.address
  const contractPortal = useContractPortal(address, abi)
  const contractWeb3 = useContractWeb3(address, abi)
  let contract = {}
  switch (wallet) {
    case KeyOfMetaMask:
      contract = contractWeb3
      break
    case KeyOfPortal:
      contract = contractPortal
      break
  }
  return contract
}
