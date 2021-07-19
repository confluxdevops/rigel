import PropTypes from 'prop-types'
import HistoryItem from './HistoryItem'
import {useTranslation} from 'react-i18next'

function History({historyData}) {
  const {t} = useTranslation()
  return (
    <div className="flex flex-col items-center bg-gray-0 w-full md:w-110 rounded-2.5xl py-6 shadow-common">
      <span className="inline-block mb-2 text-gray-100 text-base">
        {t('history.title')}
      </span>
      {historyData.map((item, index) => (
        <HistoryItem key={index} historyItemData={item} />
      ))}
    </div>
  )
}

History.propTypes = {
  historyData: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default History
