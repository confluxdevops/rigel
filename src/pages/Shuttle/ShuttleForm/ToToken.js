import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {SupportedChains} from '../../../constants/chainConfig'
import {AccountStatus} from '../../components'
import TokenSelect from './TokenSelect'

function ToToken({toChain, toToken}) {
  const {t} = useTranslation()

  return (
    <div className="flex flex-col flex-1 border border-gray-10 rounded px-3 py-4 justify-between">
      <div className="flex flex-1 justify-between">
        <span className="text-gray-40 text-xs">{t('receiveAs')}</span>
        <AccountStatus chain={toChain} size="medium" />
      </div>
      <div className="flex">
        <TokenSelect token={toToken} type="to" chain={toChain} />
      </div>
    </div>
  )
}

ToToken.propTypes = {
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  toToken: PropTypes.object,
}

export default ToToken
