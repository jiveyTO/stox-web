import { useState, useMemo, useCallback } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import { columnsDef } from './tradeTableCols'
import { ColumnFilter } from './ColumnFilter'
import SummaryTable from './SummaryTable'
import mock_data from './tradeTableMockData.json'
import Image from 'next/image'
import styles from '../styles/TradeTable.module.css'
import { Select } from '@shopify/polaris'

const ColumnHeaderTH = ({ column, index }) => {
  const headerProps = column.getHeaderProps()

  return (
    <th {...headerProps} key={index+'ColHeadTH'}>
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

// ------------------------------
// start: setup status filter
// ------------------------------
const StatusFilter = ({ setFilter }) => {
  const [selected, setSelected] = useState('all')

  const handleSelectChange = useCallback(
    value => {
      setFilter(value)
      setSelected(value)
    }, [])

  const options = [
    {label: 'All', value: 'all'},
    {label: 'Open', value: 'open'},
    {label: 'Closed', value: 'closed'},
    {label: 'Expired', value: 'expired'}
  ]

  return (
    <div className={styles['status-filter']}>
      <Select
        label="Status"
        options={options}
        onChange={handleSelectChange}
        value={selected}
        labelInline={true}
      />
    </div>
  )
}

const statusFilterFunction = (rows, ids, query) => {
  return rows.filter(
    row => {
      if (query === 'all') return true
      else if (query === 'open') return (row.values.expiredAmt === 0 && row.values.closedAmt !== row.values.quantity)
      else if (query === 'closed') return (row.values.action === 'STC' || row.values.action === 'BTC' || row.values.expiredAmt > 0)
      else if (query === 'expired') return (row.values.expiredAmt > 0)
    }
  )
}

// ------------------------------
// end: setup status filter
// ------------------------------

const TradeTable = ({ trades }) => {
  // setup the table
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
    defaultColumn,
    globalFilter: statusFilterFunction
  }, useGlobalFilter, useFilters, useSortBy)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter
  } = tableInst

  //style the table
  const getRowProps = (row, r) => {
    const ret = row.values?.returnDollar
    const closed = row.values?.quantity === row.values?.closedAmt
    
    return ({
      style: {
        color: ret > 0 ? 'green' : ret === 0 ? 'black' : closed ? 'grey' : 'red'
      },
      key: r
    })
  }

  // ------------------------------
  // start: setup the summary table
  // ------------------------------
  // setup the summary table
  const returnUpdate = (obj, row, type) => {
    // guard clause to ignore BTO or STO trades that have been subsequently closed
    if (row.values?.returnDollar === null || row.values?.returnPercent === null) return

    const t = row.values[type]
    obj[t] ||= {}

    obj[t].returnDollar ||= 0
    obj[t].returnDollar += row.values.returnDollar 
    
    obj[t].principal ||= 0
    obj[t].principal += row.original.principal

    obj[t].win ||= 0
    obj[t].count ||= 0
    obj[t].count++
    if (row.values.returnDollar > 0) obj[t].win++

    obj[t].totalPercentReturn ||= 0
    obj[t].totalPercentReturn += row.values.returnPercent
  }

  const summaryData = {
    traderReturns: null,
    tickerReturns: null
  }
  const traderReturns = {}

  // tally up the metrics for each trader
  rows.map(row => {
    prepareRow(row)
    returnUpdate(traderReturns, row, 'trader')
  })
  summaryData.traderReturns = traderReturns

  // when just one trader is filtered then display their ticker breakdown too
  const tickerReturns = {}
  if (Object.keys(traderReturns).length === 1) {
    rows.map(row => {
      prepareRow(row)
      returnUpdate(tickerReturns, row, 'ticker')
    })
  }
  summaryData.tickerReturns = tickerReturns
  // ------------------------------
  // end: setup the summary table
  // ------------------------------

  // display the summary table and the data table
  return (
  <>
    <SummaryTable {...summaryData} /><br></br>
    <StatusFilter setFilter={setGlobalFilter}></StatusFilter>
    <table {...getTableProps} className={styles['trade-table']}>
      <thead>
        {
          headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column, j) => (
                  <ColumnHeaderTH column={column} index={j+'B'} key={j+'B'} />
                ))
              }
            </tr>            
          ))
        }
      </thead>
      <tbody {...getTableBodyProps}>
        {
          rows.map((row, r) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps(getRowProps(row, r))} >
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
