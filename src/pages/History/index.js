import HistoryItem from './HistoryItem'
import {useTranslation} from 'react-i18next'
import {useTxData} from '../../hooks/useTransaction'
import {ShuttleStatus} from '../../constants'

function History() {
  const historyData = useTxData([
    ShuttleStatus.pending,
    ShuttleStatus.waiting,
    ShuttleStatus.success,
    ShuttleStatus.error,
  ])
  console.log('historyData', historyData)
  const {t} = useTranslation()
  return (
    <div
      className="flex flex-col items-center bg-gray-0 w-full md:w-110 rounded-2.5xl py-6 shadow-common"
      id="history"
    >
      <span className="inline-block mb-2 text-gray-100 text-base">
        {t('history.title')}
      </span>
      <div className="flex flex-col w-full overflow-y-auto">
        {historyData.map((item, index) => (
          <HistoryItem key={index} historyItemData={item} />
        ))}
      </div>
    </div>
  )
}

export default History
