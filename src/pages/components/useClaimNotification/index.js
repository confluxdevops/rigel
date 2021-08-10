import {useTranslation} from 'react-i18next'
import {ChainConfig} from '../../../constants/chainConfig'
import {Notification, Button, Loading} from '../../../components'

const useClaimNotification = () => {
  const {t} = useTranslation()
  return ({symbol, fromChain, toChain, value, isMobile}) =>
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
      actions: <Button>{t('claim')}</Button>,
    })
}

export default useClaimNotification
