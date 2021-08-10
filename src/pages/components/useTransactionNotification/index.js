import queryString from 'query-string'
import {useTranslation} from 'react-i18next'
import {useHistory, useLocation} from 'react-router-dom'
import {
  ChainConfig,
  KeyOfPortal,
  KeyOfMetaMask,
} from '../../../constants/chainConfig'
import {Notification, Link} from '../../../components'

const useTransactionNotification = () => {
  const {t} = useTranslation()
  const location = useLocation()
  const history = useHistory()
  const {
    fromChain: pathFromChain,
    toChain: pathToChain,
    fromTokenAddress,
    ...others
  } = queryString.parse(location.search)
  return ({symbol, fromChain, toChain, value, isMobile}) =>
    Notification.open({
      title: t('notificationDetail', {
        value,
        symbol,
        fromChain: ChainConfig[fromChain].shortName,
        toChain: ChainConfig[toChain].shortName,
      }),
      type: 'success',
      content: (
        <div
          aria-hidden="true"
          onClick={() => {
            const pathWithQuery = queryString.stringifyUrl({
              url: '/history',
              query: {
                ...others,
                fromChain: pathFromChain,
                toChain: pathToChain,
                fromTokenAddress,
              },
            })
            history.push(pathWithQuery)
          }}
        >
          <Link className="!justify-start">{t('viewInHistory')}</Link>
        </div>
      ),
      duration: 0,
      placement: isMobile ? 'bottomRight' : 'topRight',
      bottom: isMobile ? 0 : 24,
      className: `${
        ChainConfig[fromChain].wallet === KeyOfPortal
          ? 'bg-portal'
          : ChainConfig[fromChain].wallet === KeyOfMetaMask
          ? 'bg-metamask'
          : ''
      } h-32`,
    })
}

export default useTransactionNotification
