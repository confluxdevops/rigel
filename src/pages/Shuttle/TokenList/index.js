import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {SupportedChains} from '../../../constants/chainConfig'
import {ArrowLeft} from '../../../assets/svg'
import {useTokenList} from '../../../hooks/useTokenList'
import TokenSearch from './TokenSearch'
import CommonTokens from './CommonTokens'
import TokenItem from './TokenItem'

const selectedToken = {
  burn_fee: '5834000',
  ctoken: 'cfxtest:acbp2sm9d1ajzthsep0nkmpm0su0n4dzmeexzdcksf',
  decimals: 6,
  icon: 'https://conflux-static.oss-cn-beijing.aliyuncs.com/icons/default.png',
  id: 58,
  in_token_list: 1,
  is_admin: 0,
  minimal_burn_value: '19527000',
  minimal_mint_value: '0',
  mint_fee: '0',
  name: 'conflux USD Tether',
  origin: 'eth',
  reference: '0xae080e58d91cf0b8a8de18ddcf92b9e5fbfadec5',
  reference_name: 'USD Tether',
  reference_symbol: 'usdt',
  sponsor: 'cfxtest:aajbjw3xb9u581j4hn0n15ys7t6f61kr1628kf304y',
  sponsor_value: '2999860445361000000',
  supported: 1,
  symbol: 'cUSDT',
  to_chain: 'cfx',
  total_supply: '99997085589000000000000',
  wallet_fee: '0',
}

function TokenList({chain}) {
  const {t} = useTranslation()
  const tokenList = useTokenList(chain)
  console.log(tokenList)
  return (
    <div className="flex flex-col items-center bg-gray-0 w-110 rounded-2.5xl p-6">
      <div className="flex justify-center items-center relative w-full mb-4">
        <ArrowLeft className="text-gray-40 absolute left-0" />
        <span className="text-base text-gray-100">{t('selectToken')}</span>
      </div>
      <TokenSearch value="" />
      <CommonTokens chain="eth" selectedToken={selectedToken}></CommonTokens>
      <div className="flex flex-col w-full">
        <span className="text-gray-40 inline-block mb-1">{t('tokenList')}</span>
        <div className="flex flex-col flex-1 overflow-auto -mx-6">
          {tokenList.map((token, index) => (
            <TokenItem
              key={index}
              token={token}
              chain="eth"
              selectedToken={selectedToken}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

TokenList.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default TokenList
