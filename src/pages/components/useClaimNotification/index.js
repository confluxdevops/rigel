import {useTranslation} from 'react-i18next'
import {ChainConfig} from '../../../constants/chainConfig'
import {Notification, Loading} from '../../../components'
import {useIsMobile} from '../../../hooks'
import {ClaimButton} from '../../components'
import {ClaimButtonType} from '../../../constants'
import {useActiveWeb3React} from '../../../hooks/useWeb3Network'

const useClaimNotification = () => {
  const {t} = useTranslation()
  const isMobile = useIsMobile()
  const {library} = useActiveWeb3React()
  return ({symbol, fromChain, toChain, value, hash}) =>
    Notification.open({
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
        >
          {}
        </ClaimButton>
      ),
    })
}

export default useClaimNotification
