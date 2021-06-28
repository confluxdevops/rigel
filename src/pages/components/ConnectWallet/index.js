import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {
  ChainConfig,
  WalletConfig,
  SupportedChains,
} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {ConnectWalletModal} from '../../components'
import {Button, Tag} from '../../../components'
import {TypeConnectWallet} from '../../../constants'

function ConnectWallet({size = 'medium', chain, className = '', ...props}) {
  const {t} = useTranslation()
  const [open, setOpen] = useState(false)
  const {type, setType, tryActivate} = useWallet(chain)
  const walletConfig = WalletConfig[ChainConfig[chain]?.wallet]
  const walletIcon = walletConfig?.icon(`${className} !w-3 !h-3`)
  const onConnect = () => {
    setOpen(true)
    if (type === TypeConnectWallet.loading) {
      tryActivate()
    }
    if (type === TypeConnectWallet.error) {
      setType(TypeConnectWallet.loading)
      tryActivate()
    }
  }

  const onClose = () => {
    setOpen(false)
  }
  if (!walletConfig) return null
  return (
    <>
      {size === 'medium' && (
        <Tag
          className={className}
          onClick={onConnect}
          icon={walletIcon}
          {...props}
        >
          {t('connect')}
        </Tag>
      )}
      {size === 'large' && (
        <Button
          fullWidth
          size="small"
          className={className}
          onClick={onConnect}
          variant="outlined"
          startIcon={walletIcon}
          {...props}
        >
          {`${t('connect')} ${walletConfig?.name}`}
        </Button>
      )}
      {open && (
        <ConnectWalletModal
          type={type}
          chain={chain}
          open={open}
          onClose={onClose}
        />
      )}
    </>
  )
}
ConnectWallet.propTypes = {
  size: PropTypes.oneOf(['medium', 'large']).isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
}

export default ConnectWallet
