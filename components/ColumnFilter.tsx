import { useState } from 'react'
import { useAsyncDebounce } from 'react-table'

export const ColumnFilter = ({ column }: { column: any }) => {
  const { filterValue, setFilter } = column
  const [value, setValue] = useState(filterValue)

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined)
  }, 900)

  return (
    <input
      value={value || ''}
      onChange={(e) => {
        setValue(e.target.value)
        onChange(e.target.value)
      }}
    />
  )
}
