import {useTranslation} from 'react-i18next'
import {
  ChainConfig,
  KeyOfMetaMask,
  KeyOfPortal,
} from '../../../constants/chainConfig'
import {Notification, Loading} from '../../../components'
import {useIsMobile} from '../../../hooks'
import {ClaimButton} from '../../components'
import {ClaimButtonType} from '../../../constants'
import {useActiveWeb3React} from '../../../hooks/useWeb3Network'
import {useConnect as useConnectPortal} from '../../../hooks/usePortal'

import {useConnect as useConnectWeb3} from '../../../hooks/useWeb3Network'

const useClaimNotification = () => {
  const {t} = useTranslation()
  const isMobile = useIsMobile()
  const {library} = useActiveWeb3React()
  const connectObjPortal = useConnectPortal()
  const connectObjWeb3 = useConnectWeb3()

  return function ({symbol, fromChain, toChain, value, hash}) {
    let data = {}
    switch (ChainConfig[toChain]?.wallet) {
      case KeyOfMetaMask:
        data = connectObjWeb3
        break
      case KeyOfPortal:
        data = connectObjPortal
        break
    }
    const toAccountAddress = data?.address
    Notification.open({
      key: 'claimNotification',
      title: t('claimNotificationTitle'),
      icon: <Loading className="w-6 h-6" />,
      content: t('notificationDetail', {
        value,
        symbol,
        fromChain: ChainConfig[fromChain].shortName,
        toChain: ChainConfig[toChain].shortName,
      }),
      duration: 0,
      placement: isMobile ? 'bottomRight' : 'topRight',
      bottom: isMobile ? 0 : 24,
      actions: (
        <ClaimButton
          hash={hash}
          type={ClaimButtonType.common}
          library={library}
          toAccountAddress={toAccountAddress}
          onClickClaim={() => Notification.close('claimNotification')}
        />
      ),
    })
  }
}

export default useClaimNotification
