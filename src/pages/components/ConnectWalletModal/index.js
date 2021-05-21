import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'

import {Modal, Loading, Button} from '../../../components'
import Config, {SupportedChains} from '../../../constants/chainConfig'
import {TypeConnectWallet} from '../../../constants'
import {errorOutlind} from '../../../assets/images'

function ConnectWalletModal({open = false, type, chain}) {
  const {t} = useTranslation()
  const walletConfig = Config[chain].wallet
  const walletName = walletConfig.name
  const onInstall = () => {
    window.open(walletConfig.website, '_blank')
  }
  //TODO: try to connect
  const onTry = () => {}
  let content
  if (type === TypeConnectWallet.uninstalled) {
    content = (
      <div className="flex flex-col items-center">
        <div className="font-bold text-gray-100 text-base mb-2">
          {t('installWallet')}
        </div>
        <div className="text-gray-60 leading-5">
          <div>{t('installTipOne', {walletName})}</div>
          <div>{t('installTipTwo')}</div>
        </div>
      </div>
    )
    return (
      <Modal
        content={content}
        open={open}
        closable
        actions={
          <Button
            fullWidth
            onClick={onInstall}
            className="text-base text-gray-0  h-12"
          >
            {t('installWallet', {walletName})}
          </Button>
        }
      />
    )
  } else if (type === TypeConnectWallet.loading) {
    content = (
      <div className="flex flex-col items-center">
        <Loading />
        <div className="font-bold text-gray-100 text-base mb-2 mt-3">
          {t('connectWallet')}
        </div>
        <div className="text-gray-60 leading-5">
          {t('loginAndAuth', {walletName})}
        </div>
      </div>
    )
    return <Modal content={content} open={open} closable />
  } else if (type === TypeConnectWallet.error) {
    content = (
      <div className="flex flex-col items-center">
        <img src={errorOutlind} alt="error" className="w-12 h-12" />
        <div className="text-error text-base font-bold leading-6 mb-2 mt-2">
          {t('errorConnecting')}
        </div>
        <div className="text-gray-60 leading-5">
          {t('loginAndAuth', {walletName})}
        </div>
      </div>
    )
    return (
      <Modal
        content={content}
        open={open}
        closable
        actions={
          <Button
            fullWidth
            onClick={onTry}
            className="text-base text-gray-0 h-12"
          >
            {t('tryAgain')}
          </Button>
        }
      />
    )
  }
}

ConnectWalletModal.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(TypeConnectWallet)).isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ConnectWalletModal
