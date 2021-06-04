import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {Dropdown, WrapIcon, MenuItem} from '../../../components'
import {notConnected, connected} from '../../../assets/images'
import {WalletConfig} from '../../../constants/chainConfig'
import {shortenAddress} from '../../../utils/address'
import {ArrowDownWithBg, ArrowUpWithBg} from '../../../assets/svg'

// const connectData = [
//   {type: 'portal', chain:'cfx', address: 'cfx:asfasfasd...'},
//   {type: 'metamask', chain:'eth', false, address: null},
// ]
function WalletHub({connectData, history = []}) {
  console.log(history)
  const [arrow, setArrow] = useState('down')
  const onVisibleChange = visible => {
    if (visible) setArrow('top')
    if (arrow === 'top') setArrow('down')
  }
  const clickHandler = key => {
    console.log(key)
  }
  const menu = (
    <>
      <MenuItem itemKey="antgroup" onClick={clickHandler} selected={false}>
        1st menu item
      </MenuItem>
      <MenuItem itemKey="aliyun" onClick={clickHandler} selected={false}>
        2nd menu item
      </MenuItem>
      <MenuItem itemKey="luohanacademy" onClick={clickHandler} selected={true}>
        3rd menu item
      </MenuItem>
      <MenuItem itemKey="danger" onClick={clickHandler} selected={false}>
        a danger item
      </MenuItem>
    </>
  )
  const {t} = useTranslation()
  const connectedData = connectData.filter(data => !!data.address)
  const unConnectedData = connectData.filter(data => !data.address)
  const length = connectedData.length
  let children
  if (length === 0) {
    children = (
      <div className="h-8 px-3 flex items-center border rounded-full border-primary text-primary">
        <img src={notConnected} alt="not connected" className="w-2 h-2 mr-1" />
        <span>{t('connectWallet')}</span>
      </div>
    )
  } else if (length === 1) {
    children = (
      <div className="h-8 bg-gray-20 flex items-center pl-3 rounded-full">
        {WalletConfig[unConnectedData[0].type].icon()}
        <div className="h-full border border-gray-20 flex items-center rounded-full ml-1 px-3">
          <img src={connected} alt="connected" className="w-2 h-2 mr-1" />
          <span className="mr-1">{shortenAddress(connectData[0].address)}</span>
          <WrapIcon size="w-4 h-4" className="text-gray-40">
            {arrow === 'down' ? <ArrowDownWithBg /> : <ArrowUpWithBg />}
          </WrapIcon>
        </div>
      </div>
    )
  }
  return (
    <Dropdown
      trigger={['click']}
      overlay={menu}
      onVisibleChange={visible => onVisibleChange(visible)}
    >
      {children}
    </Dropdown>
  )
}

WalletHub.propTypes = {
  connectData: PropTypes.object.isRequiredisRequired,
  history: PropTypes.array,
}

export default WalletHub
