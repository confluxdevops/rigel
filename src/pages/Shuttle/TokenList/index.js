import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import queryString from 'query-string'
import {SupportedChains} from '../../../constants/chainConfig'
import {ArrowLeft} from '../../../assets/svg'
import {useMapTokenList} from '../../../hooks/useTokenList'
import TokenSearch from './TokenSearch'
import CommonTokens from './CommonTokens'
import TokenItem from './TokenItem'
import {useHistory, useLocation} from 'react-router-dom'

function TokenList({chain, selectedToken}) {
  const {t} = useTranslation()
  const location = useLocation()
  const history = useHistory()
  const tokenList = useMapTokenList(chain)
  const onClick = token => {
    const {...others} = queryString.parse(location.search)
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromTokenAddress: token.address,
      },
    })
    history.push(pathWithQuery)
  }
  return (
    <div className="flex flex-col items-center bg-gray-0 w-110 rounded-2.5xl py-6 shadow-common">
      <div className="flex justify-center items-center relative w-full mb-4 px-6">
        <ArrowLeft className="text-gray-40 absolute left-6 w-6 h-6" />
        <span className="text-base text-gray-100">{t('selectToken')}</span>
      </div>
      <div className="px-6 w-full">
        <TokenSearch />
      </div>
      <CommonTokens chain={chain} selectedToken={selectedToken}></CommonTokens>
      <div className="flex flex-col w-full overflow-y-hidden">
        <span className="text-gray-40 mb-1 px-6">{t('tokenList')}</span>
        <div className="flex flex-col overflow-auto">
          {tokenList.map((token, index) => (
            <TokenItem
              key={index}
              token={token}
              chain={chain}
              selectedToken={selectedToken}
              onClick={onClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

TokenList.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  selectedToken: PropTypes.object,
}

export default TokenList
