import styles from '../styles/TradeTable.module.css'

const SummaryTable = ({ data }) => {
  const dataArray = Object.entries(data)
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
                <td>{cell}</td>
              ))
            }
          </tr>
        ))
      }
    </table>
  )
}

export default SummaryTable
