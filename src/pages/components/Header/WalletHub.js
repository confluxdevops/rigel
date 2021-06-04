import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {Dropdown} from '../../../components'
import {notConnected} from '../../../assets/images'
import {WalletConfig} from '../../../constants/chainConfig'

// const connectData = [
//   {type: 'portal', connected: true, address: 'cfx:asfasfasd...'},
//   {type: 'metamask', connected: false, address: null},
// ]
function WalletHub({connectData, history = []}) {
  console.log(history)
  const {t} = useTranslation()
  const connectedData = connectData.filter(data => data.connected)
  const unConnectedData = connectData.filter(data => !data.connected)
  const length = connectedData.length
  let children
  if (length === 0) {
    children = (
      <div className="h-8 px-3 flex items-center border border-primary text-primary">
        <img src={notConnected} alt="not connected" className="w-2 h-2 mr-1" />
        <span>{t('connectWallet')}</span>
      </div>
    )
  } else if (length === 1) {
    children = <div>{WalletConfig[unConnectedData[0].type].icon()}</div>
  }
  return <Dropdown trigger={['click']}>{children}</Dropdown>
}

WalletHub.propTypes = {
  connectData: PropTypes.object.isRequiredisRequired,
  history: PropTypes.array,
}

export default WalletHub
