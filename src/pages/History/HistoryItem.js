import PropTypes from 'prop-types'

function HistoryItem({historyData}) {
  console.log(historyData)
  return <div>HistoryItem</div>
}

HistoryItem.propTypes = {
  historyData: PropTypes.object.isRequired,
}

export default HistoryItem
