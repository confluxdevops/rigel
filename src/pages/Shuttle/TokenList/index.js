import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {SupportedChains} from '../../../constants/chainConfig'
import {ArrowLeft} from '../../../assets/svg'
import {useMapTokenList} from '../../../hooks/useTokenList'
import TokenSearch from './TokenSearch'
import CommonTokens from './CommonTokens'
import TokenItem from './TokenItem'

const selectedToken = {
  burn_fee: '5834000',
  // ctoken: 'cfxtest:acbp2sm9d1ajzthsep0nkmpm0su0n4dzmeexzdcksf',
  decimals: 6,
  icon: 'https://conflux-static.oss-cn-beijing.aliyuncs.com/icons/default.png',
  id: 58,
  in_token_list: 1,
  is_admin: 0,
  minimal_burn_value: '19527000',
  minimal_mint_value: '0',
  mint_fee: '0',
  // name: 'conflux USD Tether',
  origin: 'eth',
  address: '0xae080e58d91cf0b8a8de18ddcf92b9e5fbfadec5',
  name: 'USD Tether',
  symbol: 'usdt',
  sponsor: 'cfxtest:aajbjw3xb9u581j4hn0n15ys7t6f61kr1628kf304y',
  sponsor_value: '2999860445361000000',
  supported: 1,
  // symbol: 'cUSDT',
  to_chain: 'cfx',
  total_supply: '99997085589000000000000',
  wallet_fee: '0',
}

function TokenList({chain}) {
  const {t} = useTranslation()
  const tokenList = useMapTokenList(chain)
  return (
    <div className="flex flex-col items-center bg-gray-0 w-110 rounded-2.5xl py-6 shadow-common">
      <div className="flex justify-center items-center relative w-full mb-4 px-6">
        <ArrowLeft className="text-gray-40 absolute left-6" />
        <span className="text-base text-gray-100">{t('selectToken')}</span>
      </div>
      <div className="px-6 w-full">
        <TokenSearch />
      </div>
      <CommonTokens chain={chain} selectedToken={selectedToken}></CommonTokens>
      <div className="flex flex-col w-full overflow-y-hidden">
        <span className="text-gray-40 inline-block mb-1 px-6">
          {t('tokenList')}
        </span>
        <div className="flex flex-col overflow-auto">
          {tokenList.map((token, index) => (
            <TokenItem
              key={index}
              token={token}
              chain={chain}
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
