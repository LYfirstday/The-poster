// 活动管理列表页面
import * as React from 'react';
import './activityManagement.less';
import Table from './../../components/table/table';
import { TextField, Button } from '@material-ui/core';
// import { PaginationState } from './../../static/ts/pagiationReducer';
import CreateActivity from './createActivity';

export default (props: any) => {
  const theadeData = ['活动名称', '活动说明', '操作'];

  //  活动列表初始数据
  // const pageInit = {
  //   current: 0,  // 当前页，UI组件从0开始
  //   total: 123,
  //   pageSize: 10,
  //   keyword: '',
  //   serviceUrl: '',  // 请求接口地址
  //   data: [{
  //     label: '1',
  //     label1: '1',
  //   }]
  // };

  // 关键字查询change事件
  const [keyword, setKeyword] = React.useState('');

  React.useEffect(() => {

  }, []);

  // 是否新建活动，懒加载
  const [isOpen, setIsOpen] = React.useState(false);


  function shouldCreateActivity() {
    setIsOpen(!isOpen);
  }

  return (
    <div className='activities'>
      <div className='activities-search'>
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
        >搜索</Button>
      </div>
      <div className='page-operation'>
        <h2 className='page-title'>活动管理</h2>
        <Button
          variant="contained"
          color="primary"
          className='create-btn'
          onClick={shouldCreateActivity}
        >创建活动</Button>
      </div>
      <Table
        theadeData={theadeData}
      >
        {/* {state.data.map((val:any, i: number) =>
          <tr key={i}>
            <td>{val.label1}</td>
            <td>{val.label2}</td>
            <td>
              <Button
                variant="contained"
                color="primary"
                style={{marginRight: '1rem'}}
                onClick={() => props.history.push('/index/userDetails')}
              >编辑</Button>
              <Button variant="contained" color="secondary" >删 除</Button>
            </td>
          </tr>
        )} */}
      </Table>
      <div className='pagination'>
        {/* <TablePagination
          count={state.total}
          labelRowsPerPage='每页数据条数'
          onChangePage={(_, number) => number > state.current ? dispatch({type: 'next'}) : dispatch({type: 'pre'})}
          page={state.current}
          rowsPerPage={state.pageSize}
          rowsPerPageOptions={[10, 20, 30]}
          onChangeRowsPerPage={(e) => dispatch({type: 'pageSize', state: {pageSize: e.target.value}})}
        /> */}
      </div>
      <CreateActivity
        isOpen={isOpen}
        showOrCloseDialog={shouldCreateActivity}
      />
    </div>
  )
}
