import styles from '../styles/TradeTable.module.css'

const SummaryTable = ({ traderReturns, tickerReturns }) => {
  const dataArray = Object.entries(traderReturns)
  let boldUserRow = false

  if (Object.keys(tickerReturns).length > 0) {
    const tickerArray = Object.entries(tickerReturns)
    dataArray.push(...tickerArray)
    boldUserRow = true
  }
  dataArray.unshift(['Trader', '$ Return'])

  return (
    <table className={styles['trade-table']}>
      {
        dataArray.map((row, i) => (
          (i === 0) ?
          <thead>
            <tr>
              {
                row.map(cell => (
                  <th>{cell}</th>
                ))
              }
            </tr>
          </thead>
            :
          <tr>
            {
              row.map(cell => (
                <td style={{ fontWeight: i===1 && boldUserRow ? 'bold' : 'normal' }}>
                  {cell}
                </td>
              ))
            }
          </tr>
        ))
      }
    </table>
  )
}

export default SummaryTable
