import {ChainConfig} from '../../../constants/chainConfig'
import {Notification} from '../../../components'

const useTransactionNotification = () => {
  return ({symbol, fromChain, toChain, value, isMobile}) =>
    Notification.open({
      title: `${value} ${symbol} from ${ChainConfig[fromChain].shortName} to ${ChainConfig[toChain].shortName}`,
      type: 'success',
      content: 'View in history',
      duration: 0,
      placement: isMobile ? 'bottomRight' : 'topRight',
      bottom: isMobile ? 0 : 24,
      className: `bg-${ChainConfig[fromChain].wallet} h-32`,
    })
}

export default useTransactionNotification
