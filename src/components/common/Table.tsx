import React from 'react'
import { cn } from '../../utils/cn'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  headers: string[]
  data: React.ReactNode[][]
}

const Table: React.FC<TableProps> = ({ headers, data, className, ...props }) => {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { Table }