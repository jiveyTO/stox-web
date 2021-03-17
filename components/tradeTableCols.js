
export const columnsDef = [
  {
    Header: 'Trader',
    accessor: 'trader'
  },
  {
    Header: 'Action',
    accessor: 'action'
  },
  {
    Header: 'Quantity',
    accessor: 'quantity',
    disableFilters: true
  },
  {
    Header: 'Ticker',
    accessor: 'ticker'
  },
  {
    Header: 'Expiry',
    accessor: 'expiry',
    Cell: (props) => {
      return props.row.original.expiryStr
    },
    disableFilters: true
  },
  {
    Header: 'Strike',
    accessor: 'strike'
  },
  {
    Header: 'Type',
    accessor: 'type'
  },
  {
    Header: 'Price',
    accessor: 'price',
    disableFilters: true
  },
  {
    Header: '% Return',
    accessor: 'returnPercent',
    disableFilters: true
  },
  {
    Header: '$ Return',
    accessor: 'returnDollar',
    disableFilters: true
  },
  {
    Header: 'Closed Amt',
    accessor: 'closedAmt',
    disableFilters: true
  },
  {
    Header: 'Expired Amt',
    accessor: 'expiredAmt',
    disableFilters: true
  }
]
