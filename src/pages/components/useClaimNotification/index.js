import {useTranslation} from 'react-i18next'
import {useLocation, useHistory} from 'react-router-dom'
import queryString from 'query-string'
import {ChainConfig} from '../../../constants/chainConfig'
import {Notification, Loading, Link} from '../../../components'
import {useIsMobile} from '../../../hooks'

const useClaimNotification = () => {
  const {t} = useTranslation()
  const {pathname, search} = useLocation()
  const history = useHistory()
  const isMobile = useIsMobile()
  const {fromChain, toChain, fromTokenAddress, ...others} =
    queryString.parse(search)
  const viewHistory = (
    <div
      className="flex items-center"
      aria-hidden="true"
      id="viewHistory1"
      onClick={() => {
        const pathWithQuery = queryString.stringifyUrl({
          url: '/history',
          query: {
            fromChain,
            toChain,
            fromTokenAddress,
            ...others,
          },
        })
        history.push(pathWithQuery)
      }}
    >
      <Link>{t('claimInHistory')}</Link>
    </div>
  )

  return function ({symbol, fromChain, toChain, value, key}) {
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
      duration: 10,
      placement: isMobile ? 'bottomRight' : 'topRight',
      bottom: isMobile ? 0 : 24,
      actions: viewHistory,
    })
  }
}

export default useClaimNotification
