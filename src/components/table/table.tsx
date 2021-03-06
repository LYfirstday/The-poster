import * as React from 'react';
import './table.less';

export interface TableProps {
  theadeData: Array<string>,
  children: any
}

export default (props: TableProps) => {

  return (
    <>
      <table className='table'>
        <thead className='thead'>
          <tr>
            {props.theadeData.map((val, i) =>
              <td key={`${val}_${i}`}>{val}</td>
            )}
          </tr>
        </thead>
        <tbody className='tbody'>
          {props.children}
        </tbody>
      </table>
    </>
  )
}
