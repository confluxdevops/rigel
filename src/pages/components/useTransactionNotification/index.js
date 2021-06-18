import {ChainConfig} from '../../../constants/chainConfig'
import {Notification, Link} from '../../../components'
import {useIsMobie} from '../../../hooks'

const useTransactionNotification = ({token, fromChain, toChain, value}) => {
  const isMobile = useIsMobie()
  const {symbol} = token
  const openNotification = () =>
    Notification.open({
      title: `${value} ${symbol} from ${ChainConfig[fromChain].shortName} to ${ChainConfig[toChain].shortName}`,
      type: 'success',
      content: <Link>View in history</Link>,
      duration: 3,
      placement: isMobile ? 'bottomRight' : 'topRight',
      bottom: isMobile ? 0 : 24,
      className: `bg-${ChainConfig[fromChain].wallet}'`,
    })
  return openNotification
}

export default useTransactionNotification
