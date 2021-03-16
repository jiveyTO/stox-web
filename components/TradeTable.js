import { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import { columnsDef } from './tradeTableCols'
import mock_data from './tradeTableMockData.json'
import styles from '../styles/TradeTable.module.css'

const TradeTable = ({ trades }) => {
  const columns = useMemo(() => columnsDef, [])
  const data = useMemo(() => {
    console.log('recalculating trades in useMemo ...', trades)
    return trades
  },
  [trades]
  )

  const tableInst = useTable({
    columns: columns,
    data: data
  }, useSortBy)

  const { 
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInst

  return (
    <table {...getTableProps} className={styles['trade-table']} >
      <thead>
        {
          headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      { column.isSorted ? (column.isSortedDesc ? '⬇' : '⬆') : '' }
                    </span>
                  </th>
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
  )
}

export default TradeTable
