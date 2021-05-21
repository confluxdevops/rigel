import PropTypes from 'prop-types'
import {Modal, Loading, Button} from '../../../components'
import Config, {SupportedChains} from '../../../constants/chainConfig'
import errorImg from '../../../assets/images/error.svg'

const TypeUninstalled = 'uninstalled'
const TypeLoading = 'loading'
const TypeError = 'error'

function ConnectWalletModal({open = false, type, chain}) {
  const walletConfig = Config[chain].wallet
  const walletName = walletConfig.name
  const onInstall = () => {
    window.open(walletConfig.website, '_blank')
  }
  //TODO: try to connect
  const onTry = () => {}
  let content
  if (type === TypeUninstalled) {
    content = (
      <div className="flex flex-col items-center">
        <div className="font-bold text-gray-100 text-base mb-2">
          Install Wallet
        </div>
        <div className="text-gray-60 leading-5">
          <div> You will need to install {walletName} to continue. </div>
          <div>Once you have installed, go ahead and refresh the page.</div>
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
            className="text-base text-gray-0"
          >
            Install {walletName} Wallet
          </Button>
        }
      />
    )
  } else if (type === TypeLoading) {
    content = (
      <div className="flex flex-col items-center">
        <Loading />
        <div className="font-bold text-gray-100 text-base mb-2 mt-3">
          Connect Wallet
        </div>
        <div className="text-gray-60 leading-5">
          Please login and authorize access to your {walletName} accounts to
          continue.
        </div>
      </div>
    )
    return <Modal content={content} open={open} closable />
  } else if (type === TypeError) {
    content = (
      <div className="flex flex-col items-center">
        <img src={errorImg} alt="error" className="w-12 h-12" />
        <div className="text-error text-base font-bold leading-6 mb-2 mt-2">
          Error Connecting
        </div>
        <div className="text-gray-60 leading-5">
          Please login and authorize access to your {walletName} accounts to
          continue.
        </div>
      </div>
    )
    return (
      <Modal
        content={content}
        open={open}
        closable
        actions={
          <Button fullWidth onClick={onTry} className="text-base text-gray-0">
            Try again
          </Button>
        }
      />
    )
  }
}

ConnectWalletModal.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.oneOf([TypeUninstalled, TypeLoading, TypeError]).isRequired,
  chain: PropTypes.oneOf(SupportedChains).isRequired,
}

export default ConnectWalletModal
