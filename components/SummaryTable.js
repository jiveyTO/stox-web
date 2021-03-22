import styles from '../styles/TradeTable.module.css'

const SummaryTableRow = ({ row, headers, index }) => {
  const statsObj = row[1]

  const metricArray = []
  headers.map(metric => {
    if (metric === '$ Return') 
      metricArray.push(statsObj.returnDollar)
    else if (metric === 'Wins / Total / %')
      metricArray.push(`${statsObj.win} / ${statsObj.count} / ${Math.round(statsObj.win / statsObj.count * 100)}%`)
    else if (metric === 'Avg Return Per Trade')
      metricArray.push(Math.round(statsObj.totalPercentReturn/statsObj.count) + '%')

    return null
  })

  return (
    <>
    {
      metricArray.map((value, i) => (
        <td style={{ textAlign: 'center' }} key={index + 'metricArray' + i}>{value}</td>
      ))
    }
    </>
  )
}

const SummaryTable = ({ traderReturns, tickerReturns }) => {
  const dataArray = Object.entries(traderReturns)
  let boldUserRow = false

  if (Object.keys(tickerReturns).length > 0) {
    const tickerArray = Object.entries(tickerReturns)
    dataArray.push(...tickerArray)
    boldUserRow = true
  }

  const headers = ['Trader', '$ Return', 'Wins / Total / %', 'Avg Return Per Trade']
  dataArray.unshift(headers)

  return (
    <table className={styles['trade-table']}>
      <thead>
        <tr key={'sumThRow'}>
          {
            dataArray[0].map((cell, i) => (
              <th key={i + 'sumThCell'}>{cell}</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {

        dataArray.slice(1).map((row, i) => (
          <tr style={{ fontWeight: i === 0 && boldUserRow ? 'bold' : 'normal' }} key={i + 'sumBodyRow'}>
            {
              <>
                <td key={'sumBodyCell' + i}>
                  {row[0]}
                </td>
                <SummaryTableRow row={row} headers={headers.slice(1)} key={i + 'sumBodySTR'} index={i + 'sumBodySTR'} />
              </>
            }
          </tr>
        ))
        }
      </tbody>
    </table>
  )
}

export default SummaryTable
