import * as React from 'react';
import './manager.less';
import Table from './../../components/table/table';
import { TablePagination, TextField, Button } from '@material-ui/core';
import { ManagerPageStateType, managerPageReducer, ManagerInfoType } from './managerReducer/managerReducer';
import doService from './../../static/ts/axios';
import Message from './../../components/message/message';
import Loading from './../../components/loading/loading';
import CreateManager from './createManager';

export interface requestParamsType {
  number: number,
  size: number,
  deleteState: number,
  keyword?: string
}

export default (props: any) => {
  const theadeData = ['用户名', '角色', '操作'];

  //  用户列表初始数据
  const pageInit: ManagerPageStateType = {
    number: 0,  // 当前页，UI组件从0开始
    total: 0,
    size: 10,
    keyword: '',
    managerList: [],
    isEdit: false,
    editManagerInfo: {}
  };

  // keyword input
  const keywordInputRef = React.useRef<HTMLInputElement | null>(null);
  // on search button click
  function onSearchButtonClick() {
    let keyword = keywordInputRef.current!.value;
    dispatch({ type: 'keyword_search', arguments: { keyword: keyword } });
  }

  // on message
  const [onMessage, setMessage] = React.useState({isMessage: false, messageInfo: ''});

  function onMessageOpenOrClose() {
    setMessage({isMessage: false, messageInfo: ''});
  }

  // control createActivity dialog
  const [isOpen, setIsOpen] = React.useState(false);

  function createManager() {
    dispatch({ type: 'not_edit_manager' });
    shouldCreateActivity();
  }

  function shouldCreateActivity() {
    setIsOpen(!isOpen);
  }

  // 页面所有请求reducers
  const [state, dispatch] = React.useReducer(
    managerPageReducer,
    pageInit
  );

  // get activities lsit
  function getManagerList() {
    dispatch({type: 'request_start'});
    let data: requestParamsType = {
      number: state.number,
      size: state.size,
      deleteState: 0,
    };
    if (state.keyword) {
      data.keyword = state.keyword;
    }
    doService('/v1/user/list', 'POST', data).then(res => {
      if (res.code === 200) {
        let tag = res.values;
        dispatch({type: 'get_manager_data', arguments: {
          managerList: tag.content,
          number: tag.number,
          total: tag.totalElements,
          size: tag.size
        }});
      } else {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: res.description });
      }
      dispatch({type: 'request_end'});
    });
  }

  // do create an activity type
  function doCreateManager(val: ManagerInfoType) {
    dispatch({type: 'request_start'});
    doService('/v1/user/save', 'POST', val).then(res => {
      if (res.code === 200) {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: '创建人员成功' });
        shouldCreateActivity();
        getManagerList();
      } else {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: res.description });
      }
      dispatch({type: 'request_end'});
    });
  }

  // edit activity info
  function editManagerInfo(val: ManagerInfoType) {
    dispatch({ type: 'edit_manager_info', arguments: { managerInfo: val } });
    shouldCreateActivity();
  }

  // do edit activity info
  function doEditManager(val: ManagerInfoType) {
    dispatch({type: 'request_start'});
    doService('/v1/user/update', 'POST', val).then(res => {
      if (res.code === 200) {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: '编辑人员信息成功' });
        shouldCreateActivity();
        getManagerList();
      } else {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: res.description });
      }
      dispatch({type: 'request_end'});
    });
  }

  // delete one activity info
  function deleteManager(id: string) {
    dispatch({type: 'request_start'});
    doService('/v1/user/update', 'POST', { userId: id, deleteState: 1 }).then(res => {
      if (res.code === 200) {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: '删除人员成功' });
        getManagerList();
      } else {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: res.description });
      }
      dispatch({type: 'request_end'});
    });
  }

  React.useEffect(() => {
    getManagerList();
  }, [
    state.size,
    state.number,
    state.keyword
  ]);

  return (
    <div className='manager'>
      <div className='manager-search'>
        <TextField
          inputRef={keywordInputRef}
          label="关键字搜索"
          margin="normal"
          className='search-input'
          type='search'
        />
        <Button
          variant="contained"
          color="primary"
          className='search-btn'
          onClick={onSearchButtonClick}
        >搜索</Button>
      </div>
      <div className='page-operation'>
        <h2 className='page-title'>用户管理</h2>
        <Button
          variant="contained"
          color="primary"
          className='create-btn'
          onClick={createManager}
        >创建人员</Button>
      </div>
      <Table
        theadeData={theadeData}
      >
        {
          state.managerList.length > 0 ?
            state.managerList.map((val: ManagerInfoType, i: number) =>
              <tr key={i}>
                <td>{val.userName}</td>
                <td>{parseInt(`${val.roleId}`) === 1 ? '设计师' : '管理员'}</td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{marginRight: '1rem'}}
                    onClick={() => editManagerInfo(val)}
                  >编辑</Button>
                  <Button onClick={() => deleteManager(`${val.userId}`)} variant="contained" color="secondary" >删 除</Button>
                </td>
              </tr>
            ) : null
        }
      </Table>
      {
        state.managerList.length > 0 ? null : <p className='isEmpty'>无可用数据</p>
      }
      <div className='pagination'>
        <TablePagination
          count={state.total}
          labelRowsPerPage='每页数据条数'
          onChangePage={(_, number) => number > state.number ? dispatch({type: 'next_page'}) : dispatch({type: 'pre_page'})}
          page={state.number}
          rowsPerPage={state.size}
          rowsPerPageOptions={[10, 20, 30]}
          onChangeRowsPerPage={(e) => dispatch({ type: 'page_size_change', arguments: { size: parseInt(e.target.value) } })}
        />
      </div>

      {/* Message component */}
      <Message
        isOpen={onMessage.isMessage}
        children={onMessage.messageInfo}
        onMessageOpenOrClose={onMessageOpenOrClose}
      />
      {/* page loading */}
      {
        state.isLoading ? <Loading /> : null
      }

      {/* create a new manager */}
      <CreateManager
        state={state}
        isOpen={isOpen}
        showOrCloseDialog={shouldCreateActivity}
        doCreateManager={doCreateManager}
        doEditManager={doEditManager}
      />
    </div>
  )
}
