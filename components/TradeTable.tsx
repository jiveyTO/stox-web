import { useState, useMemo, useCallback, ReactElement } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter, Row } from 'react-table'
import { columnsDef } from './tradeTableCols'
import { ColumnFilter } from './ColumnFilter'
import SummaryTable, { SummaryReturns } from './SummaryTable'
import Image from 'next/image'
import styles from '../styles/TradeTable.module.css'
import { Select } from '@shopify/polaris'

const ColumnHeaderTH = ({ column, index }: { column: any; index: any }) => {
  const headerProps = column.getHeaderProps()

  return (
    <th {...headerProps} key={index + 'ColHeadTH'}>
      {column.render('Header')}
      <div>
        {column.canFilter ? column.render('Filter') : null}
        <span {...column.getSortByToggleProps()} className={styles['sort-icon']}>
          {column.isSorted ? (
            column.isSortedDesc ? (
              '⬇'
            ) : (
              '⬆'
            )
          ) : (
            <Image src="/sort.png" width={10} height={10} />
          )}
        </span>
      </div>
    </th>
  )
}

// ------------------------------
// start: setup status filter
// ------------------------------
const StatusFilter = ({ setFilter }: { setFilter: any }) => {
  const [selected, setSelected] = useState('all')

  const handleSelectChange = useCallback((value) => {
    setFilter(value)
    setSelected(value)
  }, [])

  const options = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'Closed', value: 'closed' },
    { label: 'Expired', value: 'expired' }
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

const statusFilterFunction = (rows: Row[], ids: any[], query: string) => {
  return rows.filter((row) => {
    if (query === 'all') return true
    else if (query === 'open')
      return row.values.expiredAmt === 0 && row.values.closedAmt !== row.values.quantity
    else if (query === 'closed')
      return row.values.action === 'STC' || row.values.action === 'BTC' || row.values.expiredAmt > 0
    else if (query === 'expired') return row.values.expiredAmt > 0
  })
}

// ------------------------------
// end: setup status filter
// ------------------------------

const TradeTable = ({ trades }: { trades: any }): ReactElement => {
  // setup the table
  const columns = useMemo(() => columnsDef, [])
  const data = useMemo(() => {
    console.log('recalculating trades in useMemo ...', trades)
    return trades
  }, [trades])

  const defaultColumn: any = useMemo(() => {
    return {
      Filter: ColumnFilter
    }
  }, [])

  const tableInst = useTable(
    {
      columns,
      data,
      defaultColumn,
      globalFilter: statusFilterFunction
    },
    useGlobalFilter,
    useFilters,
    useSortBy
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } =
    tableInst

  //style the table
  const getRowProps = (row: Row, r: number) => {
    const ret = row.values?.returnDollar
    const closed = row.values?.quantity === row.values?.closedAmt

    return {
      style: {
        color: ret > 0 ? 'green' : ret === 0 ? 'black' : closed ? 'grey' : 'red'
      },
      key: r
    }
  }

  // ------------------------------
  // start: setup the summary table
  // ------------------------------

  const returnUpdate = (obj: { [key: string]: SummaryReturns }, row: Row, type: string) => {
    // guard clause to ignore BTO or STO trades that have been subsequently closed
    if (row.values?.returnDollar === null || row.values?.returnPercent === null) return

    const t: string = row.values[type]
    obj[t] ||= {
      key: t,
      returnDollar: 0,
      principal: 0,
      win: 0,
      count: 0,
      totalPercentReturn: 0
    }

    obj[t].returnDollar ||= 0
    obj[t].returnDollar += row.values.returnDollar

    obj[t].principal ||= 0
    obj[t].principal += (row.original as any).principal

    obj[t].win ||= 0
    obj[t].count ||= 0
    obj[t].count++
    if (row.values.returnDollar > 0) obj[t].win++

    obj[t].totalPercentReturn ||= 0
    obj[t].totalPercentReturn += row.values.returnPercent
  }

  const summaryData: {
    traderReturns: { [key: string]: SummaryReturns }
    tickerReturns: { [key: string]: SummaryReturns }
  } = {
    traderReturns: {},
    tickerReturns: {}
  }

  // tally up the metrics for each trader
  const traderReturns = {}
  rows.map((row) => {
    prepareRow(row)
    returnUpdate(traderReturns, row, 'trader')
  })
  summaryData.traderReturns = traderReturns

  // when just one trader is filtered then display their ticker breakdown too
  const tickerReturns = {}
  if (Object.keys(traderReturns).length === 1) {
    rows.map((row) => {
      prepareRow(row)
      returnUpdate(tickerReturns, row, 'ticker')
    })
  }
  summaryData.tickerReturns = tickerReturns
  // ------------------------------
  // end: setup the summary table
  // ------------------------------

  return (
    <>
      <SummaryTable {...summaryData} />
      <br></br>
      <StatusFilter setFilter={setGlobalFilter}></StatusFilter>
      <table {...getTableProps} className={styles['trade-table']}>
        <thead>
          {headerGroups.map((headerGroup, h) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={'headerGroupProps' + h}>
              {headerGroup.headers.map((column, j) => (
                <ColumnHeaderTH column={column} index={j + 'B'} key={j + 'B'} />
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps}>
          {rows.map((row, r) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps(getRowProps(row, r))} key={'rowProps' + r}>
                {row.cells.map((cell, c) => (
                  <td {...cell.getCellProps()} key={'cellProps1' + r + c}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default TradeTable
