import { useMemo } from 'react'
import { useTable, useSortBy, useFilters } from 'react-table'
import { columnsDef } from './tradeTableCols'
import { ColumnFilter } from './ColumnFilter'
import SummaryTable from './SummaryTable'
import mock_data from './tradeTableMockData.json'
import Image from 'next/image'
import styles from '../styles/TradeTable.module.css'

const ColumnHeaderTH = ({ column, index }) => {
  const headerProps = column.getHeaderProps()

  return (
    <th {...headerProps}>
      {column.render('Header')}
      <div>
        { column.canFilter ? column.render('Filter') : null }
        <span {...column.getSortByToggleProps()} className={styles.['sort-icon']}>
          { column.isSorted ? (column.isSortedDesc ? '⬇' : '⬆') : <Image src='/sort.png' width={10} height={10} /> }
        </span>
      </div>
    </th>
  )
}

const TradeTable = ({ trades }) => {
  const columns = useMemo(() => columnsDef, [])
  const data = useMemo(
    () => {
      console.log('recalculating trades in useMemo ...', trades)
      return trades
    },
    [trades]
  )

  const defaultColumn = useMemo(() => {
    return {
      Filter: ColumnFilter
    }
  }, [])

  const tableInst = useTable({
    columns: columns,
    data: data,
    defaultColumn
  }, useFilters, useSortBy)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInst

  const summaryData = {}
  const traderReturns = {}
  const tickerReturns = {}

  rows.map(row => {
    prepareRow(row)
    const trader = row.values.trader
    traderReturns[trader] ||= 0
    traderReturns[trader] += row.values.returnDollar 
  })
  summaryData.traderReturns = traderReturns

  if (Object.keys(traderReturns).length === 1) {
    rows.map(row => {
      prepareRow(row)
      const ticker = row.values.ticker
      tickerReturns[ticker] ||= 0
      tickerReturns[ticker] += row.values.returnDollar
    })
  }
  summaryData.tickerReturns = tickerReturns

  return (
  <>
    <SummaryTable {...summaryData} /><br></br>
    <table {...getTableProps} className={styles['trade-table']} >
      <thead>
        {
          headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map(column => (
                  <ColumnHeaderTH column={column} index={index} />
                ))
              }
            </tr>            
          ))
        }
      </thead>
      <tbody {...getTableBodyProps}>
        {
          rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {
                  row.cells.map(cell => (
                    <td {...cell.getCellProps()}>
                      { cell.render('Cell') }
                    </td>
                  ))
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
  </>
  )
}

export default TradeTable
