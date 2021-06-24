/**
 * data about shuttle, mainly various contract params
 */
import {useState, useEffect} from 'react'
import Big from 'big.js'
import {useShuttleContract} from './useShuttleContract'
import {ContractType} from '../constants/contractConfig'
import {KeyOfBtc, KeyOfCfx} from '../constants/chainConfig'
import {ZeroAddrHex} from '../constants'
import {useIsCfxChain} from '../hooks'
import {mapToken} from '../hooks/useTokenList'

export function useShuttleData() {}

/**
 *
 * @param {*} type 'obverse' 'reverse'
 * @param {*} chainOfContract which chain this contract in
 * @param {*} token
 * @returns
 */
export function useCustodianData(chainOfContract, token) {
  const {origin} = token
  const isCfxChain = useIsCfxChain(origin)
  const mapedToken = mapToken(token, isCfxChain)
  const {address, decimals, ctoken} = mapedToken
  let contractAddress = address
  if (ctoken === KeyOfCfx) {
    contractAddress = ZeroAddrHex
  }

  const obverseContract = useShuttleContract(
    ContractType.custodianImpl,
    chainOfContract,
  )
  const reverseContract = useShuttleContract(
    ContractType.custodianImplReverse,
    chainOfContract,
  )
  const contract = isCfxChain ? reverseContract : obverseContract
  const dicimalsNum = `1e${decimals}`
  const [contractData, setContractData] = useState({})
  useEffect(() => {
    Promise.all(
      [
        contract['burn_fee'](contractAddress),
        contract['mint_fee'](contractAddress),
        contract['wallet_fee'](contractAddress),
        contractAddress === KeyOfBtc
          ? contract['btc_minimal_burn_value']()
          : contract['minimal_mint_value'](contractAddress),
        contractAddress === KeyOfBtc
          ? contract['btc_minimal_burn_value']()
          : contract['minimal_burn_value'](contractAddress),
        contract['minimal_sponsor_amount'](),
        contract['safe_sponsor_amount'](),
      ].map(fn => fn.call()),
    )
      .then(data => {
        const [
          burn_fee,
          mint_fee,
          wallet_fee,
          minimal_mint_value,
          minimal_burn_value,
          minimal_sponsor_amount,
          safe_sponsor_amount,
        ] = data.map(x => Big(x))

        setContractData({
          in_fee: isCfxChain
            ? burn_fee.div(`${dicimalsNum}`)
            : mint_fee.div(`${dicimalsNum}`),
          out_fee: isCfxChain
            ? mint_fee.div(`${dicimalsNum}`)
            : burn_fee.div(`${dicimalsNum}`),
          wallet_fee: wallet_fee.div(`${dicimalsNum}`),
          minimal_in_value: isCfxChain
            ? minimal_burn_value.div(`${dicimalsNum}`)
            : minimal_mint_value.div(`${dicimalsNum}`),
          minimal_out_value: isCfxChain
            ? minimal_mint_value.div(`${dicimalsNum}`)
            : minimal_burn_value.div(`${dicimalsNum}`),
          minimal_sponsor_amount: minimal_sponsor_amount.div('1e18'),
          safe_sponsor_amount: safe_sponsor_amount.div('1e18'),
        })
      })
      .catch(() => {
        setContractData({})
      })
  }, [address, contract, contractAddress, dicimalsNum, isCfxChain])
  return contractData
}

export function useSponsorData(type = 'obverse', chainOfContract, token) {
  const {address} = token
  const obverseData = useShuttleContract(
    ContractType.tokenSponsor,
    chainOfContract,
  )
  const reverseData = useShuttleContract(
    ContractType.tokenSponsorReverse,
    chainOfContract,
  )
  const contract = type === 'obverse' ? obverseData : reverseData
  const [contractData, setContractData] = useState({})
  useEffect(() => {
    Promise.all(
      [contract['sponsorOf'](address), contract['sponsorValueOf'](address)].map(
        fn => fn.call(),
      ),
    )
      .then(data => {
        setContractData({
          sponsor: data[0],
          sponsorValue: Big(data[1]),
        })
      })
      .catch(() => {
        setContractData({})
      })
  }, [address, contract])
  return contractData
}
