import {useTranslation} from 'react-i18next'
import QRCode from 'qrcode.react'
import {useShuttleState} from '../../../state'
import {CopyIcon, AlertTriangle} from '../../../assets/svg'

function BtcConfirmTips() {
  const {t} = useTranslation()
  const {btcAddress} = useShuttleState()

  return (
    <div className="flex w-110 flex-col mt-6 bg-gray-10 -mb-6 px-6 pb-6 pt-4 text-gray-80 text-xs">
      <span>{t('tips.btcWalletTip')}</span>
      <span>{t('tips.fromBtcAddressTip')}</span>
      <span>{t('tips.fromBtcGasTip')}</span>
      <div className="flex mt-6 w-full">
        <QRCode value={btcAddress} size={112} />
        <div className="flex flex-1 flex-col">
          <div className="flex w-full h-8 px-3 py-2 items-center mb-2">
            <div className="flex flex-1">
              <span className="inline-block max-w-full overflow-ellipsis break-words text-gray-80 text-xs">
                {btcAddress}
              </span>
            </div>
            <CopyIcon className="text-gray-40 w-4 h-4" />
          </div>
          <div className="flex flex-col w-full bg-warning-10 p-3">
            <span className="text-warning-dark text-xs">
              <AlertTriangle className="mr-2 w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BtcConfirmTips
