import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {SupportedChains} from '../../../constants/chainConfig'
import {ArrowLeft} from '../../../assets/svg'
import {useMapTokenList} from '../../../hooks/useTokenList'
import TokenSearch from './TokenSearch'
import CommonTokens from './CommonTokens'
import TokenItem from './TokenItem'

function TokenList({fromChain, toChain, selectedToken, onSelectToken, onBack}) {
  const {t} = useTranslation()
  const tokenList = useMapTokenList(fromChain, toChain)
  return (
    <div className="flex flex-col items-center bg-gray-0 w-110 rounded-2.5xl py-6 shadow-common">
      <div className="flex justify-center items-center relative w-full mb-4 px-6">
        <ArrowLeft
          className="text-gray-40 absolute left-6 w-6 h-6"
          onClick={() => onBack && onBack()}
        />
        <span className="text-base text-gray-100">{t('selectToken')}</span>
      </div>
      <div className="px-6 w-full">
        <TokenSearch />
      </div>
      <CommonTokens
        fromChain={fromChain}
        toChain={toChain}
        selectedToken={selectedToken}
        onSelect={onSelectToken}
      />
      <div className="flex flex-col w-full overflow-y-hidden">
        <span className="text-gray-40 mb-1 px-6">{t('tokenList')}</span>
        <div className="flex flex-col overflow-auto">
          {tokenList.map((token, index) => (
            <TokenItem
              key={index}
              token={token}
              chain={fromChain}
              selectedToken={selectedToken}
              onClick={onSelectToken}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

TokenList.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  selectedToken: PropTypes.object,
  onSelectToken: PropTypes.func,
  onBack: PropTypes.func,
}

export default TokenList