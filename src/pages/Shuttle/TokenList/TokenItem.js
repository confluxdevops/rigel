import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import _ from 'underscore'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {SupportedChains} from '../../../constants/chainConfig'
import {TokenIcon} from '../../components'
import {WrapIcon, Toast} from '../../../components'
import {BgPlus, BgCopy} from '../../../assets/svg'
import {shortenAddress} from '../../../utils/address'
import useAddTokenToMetamask from '../../../hooks/useAddTokenToMetamask'
import {useIsCfxChain} from '../../../hooks'
import {useIsNativeToken} from '../../../hooks/useWallet'

function TokenItem({chain, token, selectedToken, onClick, ...props}) {
  const {address, display_symbol, display_name} = token
  const {addToken, success} = useAddTokenToMetamask(token)
  const isCfxChain = useIsCfxChain(chain)
  const isNativeToken = useIsNativeToken(chain, token)
  const tokenAddress = shortenAddress(chain, address, 'contract')
  const {t} = useTranslation()
  const [copied, setCopied] = useState(false)

  const getSelectedStyle = () => {
    if (_.isEqual(token, selectedToken)) {
      return 'bg-gray-10'
    }
    return 'bg-gray-0 hover:bg-gray-10'
  }

  const onAddToken = e => {
    e.stopPropagation()
    if (success) return
    addToken()
  }

  return (
    <div
      aria-hidden="true"
      onClick={() => onClick && onClick(token)}
      className={`px-6 flex justify-between items-center w-full h-14 flex-shrink-0 cursor-pointer ${getSelectedStyle()}`}
      {...props}
    >
      <div className="flex items-center">
        <TokenIcon size="large" chain={chain} token={token} showAlarm={true} />
        <div className="flex flex-col ml-2">
          <span className="text-gray-100">{display_symbol}</span>
          <span className="text-gray-40 text-xs">{display_name}</span>
        </div>
      </div>
      <div className="flex">
        {tokenAddress && (
          <span className="text-xs text-primary">{tokenAddress}</span>
        )}
        {!isCfxChain && !isNativeToken && (
          <WrapIcon
            type="circle"
            className="ml-1 cursor-pointer"
            onClick={e => onAddToken(e)}
          >
            <BgPlus />
          </WrapIcon>
        )}
        {isCfxChain && (
          <WrapIcon
            type="circle"
            className="ml-1 cursor-pointer relative"
            onClick={e => e.stopPropagation()}
          >
            <CopyToClipboard text={address} onCopy={() => setCopied(true)}>
              <BgCopy />
            </CopyToClipboard>
            <Toast
              content={t('copiedSuccess')}
              open={copied}
              type="line"
              onClose={() => setCopied(false)}
              className="top-5 right-5"
            />
          </WrapIcon>
        )}
      </div>
    </div>
  )
}

TokenItem.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  selectedToken: PropTypes.object.isRequired,
  token: PropTypes.object.isRequired,
  onClick: PropTypes.func,
}

export default TokenItem
