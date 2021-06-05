import { ReactElement } from 'react'
import styles from '../styles/TradeTable.module.css'

export interface SummaryReturns {
  key: string
  returnDollar: number
  principal: number
  win: number
  count: number
  totalPercentReturn: number
}

const SummaryTableRow = ({
  row,
  headers,
  index
}: {
  row: [string, SummaryReturns]
  headers: string[]
  index: any
}) => {
  const statsObj = row[1]

  const metricArray: string[] = []
  headers.map((metric) => {
    if (metric === '% Return')
      metricArray.push(`${Math.round((statsObj.returnDollar / statsObj.principal) * 100)}%`)
    else if (metric === '$ Return') metricArray.push(statsObj.returnDollar as any)
    else if (metric === 'Wins / Total / %')
      metricArray.push(
        `${statsObj.win} / ${statsObj.count} / ${Math.round(
          (statsObj.win / statsObj.count) * 100
        )}%`
      )

    return null
  })

  return (
    <>
      {metricArray.map((value, i) => (
        <td style={{ textAlign: 'center' }} key={index + 'metricArray' + i}>
          {value}
        </td>
      ))}
    </>
  )
}

const SummaryTable = ({
  traderReturns,
  tickerReturns
}: {
  traderReturns: { [key: string]: SummaryReturns }
  tickerReturns: { [key: string]: SummaryReturns }
}): ReactElement => {
  const dataArray: any[] = Object.entries(traderReturns)
  let boldUserRow = false

  if (Object.keys(tickerReturns).length > 0) {
    const tickerArray: [string, SummaryReturns][] = Object.entries(tickerReturns)
    dataArray.push(...tickerArray)
    boldUserRow = true
  }

  const headers = ['Trader', '% Return', '$ Return', 'Wins / Total / %']
  dataArray.unshift(headers)

  return (
    <table className={styles['trade-table']}>
      <thead>
        <tr key={'sumThRow'}>
          {dataArray[0].map((cell: string, i: number) => (
            <th key={i + 'sumThCell'}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataArray.slice(1).map((row: [string, SummaryReturns], i: number) => (
          <tr
            style={{ fontWeight: i === 0 && boldUserRow ? 'bold' : 'normal' }}
            key={i + 'sumBodyRow'}>
            {
              <>
                <td key={'sumBodyCell' + i}>{row[0]}</td>
                <SummaryTableRow
                  row={row}
                  headers={headers.slice(1)}
                  key={i + 'sumBodySTR'}
                  index={i + 'sumBodySTR'}
                />
              </>
            }
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SummaryTable
