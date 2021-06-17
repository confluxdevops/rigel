import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {BgArrowRight} from '../../../assets/svg'
import {WrapIcon} from '../../../components'
import {TokenIcon} from '../../components'
import {SupportedChains, KeyOfCfx} from '../../../constants/chainConfig'

function TokenSelect({token, onClick, type, chain}) {
  const symbol = chain === KeyOfCfx ? token?.csymbol : token?.reference_symbol
  const style = useMemo(() => {
    if (type === 'from') return 'text-gray-100'
    if (type === 'to') return 'text-gray-40'
  }, [type])

  return (
    <div
      className={`flex items-center bg-gray-10 ${
        type === 'from' ? 'cursor-pointer' : ''
      }`}
      onClick={e => onClick && onClick(e)}
      aria-hidden="true"
    >
      <TokenIcon token={token} chain={chain} size="small" />
      <span className={`ml-1 ${style}`}>{symbol}</span>
      {type === 'from' && (
        <WrapIcon type="circle" className="ml-1">
          <BgArrowRight />
        </WrapIcon>
      )}
    </div>
  )
}

TokenSelect.propTypes = {
  token: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['from', 'to']).isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default TokenSelect
