import * as React from 'react';
import './users.less';
import Table from './../../components/table/table';
import { TablePagination, TextField, Button } from '@material-ui/core';
import { paginationReducer } from './../../static/ts/pagiationReducer';

export default (props: any) => {
  const theadeData = ['用户昵称', '微信号', '性别', '海报模板流量', '操作'];

  //  用户列表初始数据
  const pageInit = {
    current: 0,
    total: 123,
    pageSize: 10,
    keyword: '',
    data: [{
      label: '1',
      label1: '1',
      label2: '1',
      label3: '1',
    }]
  };
  const [state, dispatch] = React.useReducer(
    paginationReducer,
    pageInit
  );

  React.useEffect(() => {
    dispatch({type: 'init'});
  }, []);

  return (
    <div className='users'>
      <div className='user-search'>
        <TextField
          label="关键字搜索"
          // value={account.userName}
          // onChange={(e) => setAccount({userName: e.target.value, password: account.password})}
          margin="normal"
          className='search-input'
          type='search'
        />
        <Button variant="contained" color="primary" className='search-btn'>搜索</Button>
      </div>
      <h2 className='page-title'>用户管理</h2>
      <Table
        theadeData={theadeData}
      >
        {state.data.map((val:any, i: number) =>
          <tr key={i}>
            <td>{val.label}</td>
            <td>{val.label1}</td>
            <td>{val.label2}</td>
            <td>{val.label3}</td>
            <td>
              <Button
                variant="contained"
                color="primary"
                style={{marginRight: '1rem'}}
                onClick={() => props.history.push('/index/userDetails')}
              >查看详情</Button>
              <Button variant="contained" color="secondary" >删 除</Button>
            </td>
          </tr>
        )}
      </Table>
      <div className='pagination'>
        <TablePagination
          count={state.total}
          labelRowsPerPage='每页数据条数'
          onChangePage={(_, number) => number > state.current ? dispatch({type: 'next'}) : dispatch({type: 'pre'})}
          page={state.current}
          rowsPerPage={state.pageSize}
          rowsPerPageOptions={[10, 20, 30]}
          onChangeRowsPerPage={(e) => dispatch({type: 'pageSize', state: {pageSize: e.target.value}})}
        />
      </div>
    </div>
  )
}
