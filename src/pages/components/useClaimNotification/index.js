import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'
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
  const {pathname} = useLocation()
  const isMobile = useIsMobile()
  const {library} = useActiveWeb3React()
  const connectObjPortal = useConnectPortal()
  const connectObjWeb3 = useConnectWeb3()

  return function ({symbol, fromChain, toChain, value, hash, key}) {
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
    if (pathname === '/') return null
    Notification.open({
      key: 'claimNotification' + key,
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
          onClickClaim={() => Notification.close('claimNotification' + key)}
        />
      ),
    })
  }
}

export default useClaimNotification
