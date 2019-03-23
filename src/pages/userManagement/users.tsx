import * as React from 'react';
import './users.less';
import Table from './../../components/table/table';
import { TablePagination, TextField, Button } from '@material-ui/core';
import { paginationReducer, PaginationState } from './../../static/ts/pagiationReducer';

export default (props: any) => {
  const theadeData = ['用户昵称', '微信号', '性别', '海报模板流量', '操作'];

  //  用户列表初始数据
  const pageInit: PaginationState = {
    current: 0,  // 当前页，UI组件从0开始
    total: 123,
    pageSize: 10,
    keyword: '',
    serviceUrl: '',  // 请求接口地址
    data: [{
      label: '1',
      label1: '1',
      label2: '1',
      label3: '1',
    }]
  };

  // 页面所有请求reducers
  const [state, dispatch] = React.useReducer(
    paginationReducer,
    pageInit
  );

  // 关键字查询change事件
  const [keyword, setKeyword] = React.useState('');

  React.useEffect(() => {
    dispatch({type: 'init'});
  }, []);

  return (
    <div className='users'>
      <div className='user-search'>
        <TextField
          label="关键字搜索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          margin="normal"
          className='search-input'
          type='search'
        />
        <Button
          variant="contained"
          color="primary"
          className='search-btn'
          onClick={() => dispatch({type: 'keyword', state: {keyword: keyword}})}
        >搜索</Button>
      </div>
      <h2 className='page-title'>用户管理</h2>
      <Table
        theadeData={theadeData}
      >
        {state.data.map((val:any, i: number) =>
          <tr key={`${val.label}_${i}`}>
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
