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
    accessor: 'quantity'
  },
  {
    Header: 'Ticker',
    accessor: 'ticker'
  },
  {
    Header: 'Expiry',
    accessor: 'expiry',
    Cell: (props) => {
      return props.row.original.expiryStr }
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
    accessor: 'price'
  },
  {
    Header: '% Return',
    accessor: 'returnPercent'
  },
  {
    Header: '$ Return',
    accessor: 'returnDollar'
  },
  {
    Header: 'Closed Amt',
    accessor: 'closedAmt'
  },
  {
    Header: 'Expired Amt',
    accessor: 'expiredAmt'
  }
]