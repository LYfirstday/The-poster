// 活动管理列表页面
import * as React from 'react';
import './activityManagement.less';
import Table from './../../components/table/table';
import { TextField, Button, TablePagination } from '@material-ui/core';
import CreateActivity from './createActivity';
import doService from './../../static/ts/axios';
import { activityPageReducer, ActivityPageStateType, ActivityData } from './activityReducer/activityReducer';
import Loading from './../../components/loading/loading';
import Message from './../../components/message/message';
import { createActivityParamsType } from './createActivity';

export interface requestParamsType {
  number: number,
  size: number,
  deleteState: number,
  keyword?: string
}

export default () => {
  const theadeData = ['活动名称', '活动说明', '操作'];

  //  活动列表初始数据
  const pageInit: ActivityPageStateType = {
    number: 0,  // 当前页，UI组件从0开始
    total: 0,
    pageSize: 10,
    keyword: '',
    activityData: [],
    isLoading: false,
    isEdit: false,
    editActivityInfo: {}
  };

  // keyword input
  const keywordInputRef = React.useRef<HTMLInputElement | null>(null);

  const [state, dispatch] = React.useReducer(
    activityPageReducer,
    pageInit
  );

  // on search button click
  function onSearchButtonClick() {
    let keyword = keywordInputRef.current!.value;
    dispatch({ type: 'keyword_search', arguments: { keyword: keyword } });
  }

  // when the params(pageSize, number, keyword) has changed, it will call getActivityData Function
  React.useEffect(() => {
    getActivityData();
  }, [
    state.pageSize,
    state.number,
    state.keyword
  ]);

  // control createActivity dialog
  const [isOpen, setIsOpen] = React.useState(false);

  function createActivity() {
    dispatch({ type: 'not_edit_activity' });
    shouldCreateActivity();
  }

  function shouldCreateActivity() {
    setIsOpen(!isOpen);
  }

  // on message
  const [onMessage, setMessage] = React.useState({isMessage: false, messageInfo: ''});

  function onMessageOpenOrClose() {
    setMessage({isMessage: false, messageInfo: ''});
  }

  // get activities lsit
  function getActivityData() {
    dispatch({type: 'request_start'});
    let data: requestParamsType = {
      number: state.number,
      size: state.pageSize,
      deleteState: 0,
    };
    if (state.keyword) {
      data.keyword = state.keyword;
    }
    doService('/v1/postertype/list', 'POST', data).then(res => {
      if (res.code === 200) {
        let tag = res.values;
        dispatch({type: 'get_activity_data', arguments: {
          activityData: tag.content,
          number: tag.number,
          total: tag.totalElements,
          pageSize: tag.size
        }});
      } else {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: res.description });
      }
      dispatch({type: 'request_end'});
    });
  }

  // do create an activity type
  function doCreateActivity(val: createActivityParamsType) {
    dispatch({type: 'request_start'});
    doService('/v1/postertype/save', 'POST', val).then(res => {
      if (res.code === 200) {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: '创建活动类型成功' });
        shouldCreateActivity();
        getActivityData();
      } else {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: res.description });
      }
      dispatch({type: 'request_end'});
    });
  }

  // do edit activity info
  function doEditActivity(val: createActivityParamsType) {
    dispatch({type: 'request_start'});
    doService('/v1/postertype/update', 'POST', val).then(res => {
      if (res.code === 200) {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: '编辑活动类型成功' });
        shouldCreateActivity();
        getActivityData();
      } else {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: res.description });
      }
      dispatch({type: 'request_end'});
    });
  }

  // edit activity info
  function editActivityInfo(id: string, typeName: string, typeContext: string) {
    let data: ActivityData = {
      typeId: id,
      typeName: typeName,
      typeContext: typeContext,
    };
    dispatch({ type: 'edit_activity_info', arguments: { activityInfo: data } });
    shouldCreateActivity();
  }

  // delete one activity info
  function deleteActivity(id: string) {
    dispatch({type: 'request_start'});
    doService('/v1/postertype/update', 'POST', { typeId: id, deleteState: 1 }).then(res => {
      if (res.code === 200) {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: '删除活动成功' });
        getActivityData();
      } else {
        setMessage({ isMessage: !onMessage.isMessage, messageInfo: res.description });
      }
      dispatch({type: 'request_end'});
    });
  }

  return (
    <div className='activities'>
      <div className='activities-search'>
        <TextField
          label="关键字搜索"
          inputRef={keywordInputRef}
          margin="normal"
          className='search-input'
          type='search'
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onSearchButtonClick}
          className='search-btn'
        >搜索</Button>
      </div>
      <div className='page-operation'>
        <h2 className='page-title'>活动管理</h2>
        <Button
          variant="contained"
          color="primary"
          className='create-btn'
          onClick={createActivity}
        >创建活动</Button>
      </div>
      <Table
        theadeData={theadeData}
      >
      {
        state.activityData.length > 0 ?
          state.activityData.map((val: any, i: number) =>
            <tr key={`${i}`}>
              <td>{val.typeName}</td>
              <td>{val.typeContext}</td>
              <td>
                <Button
                  variant="contained"
                  color="primary"
                  style={{marginRight: '1rem'}}
                  onClick={() => editActivityInfo(val.typeId, val.typeName, val.typeContext)}
                >编辑</Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteActivity(val.typeId)}
                >删 除</Button>
              </td>
            </tr>
          ) : null
      }
      </Table>
      {
        state.activityData.length > 0 ? null : <p className='isEmpty'>无可用数据</p>
      }
      <div className='pagination'>
        <TablePagination
          count={state.total}
          labelRowsPerPage='每页数据条数'
          onChangePage={(_, number) => number > state.number
                          ?
                            dispatch({ type: 'next_page' })
                          :
                            dispatch({ type: 'pre_page' })}
          page={state.number}
          rowsPerPage={state.pageSize}
          rowsPerPageOptions={[10, 20, 30]}
          onChangeRowsPerPage={(e) => dispatch({ type: 'page_size_change', arguments: { pageSize: parseInt(e.target.value) } })}
        />
      </div>
      <CreateActivity
        state={state}
        isOpen={isOpen}
        showOrCloseDialog={shouldCreateActivity}
        doCreateActivity={doCreateActivity}
        doEditActivity={doEditActivity}
      />
      {
        state.isLoading ? <Loading /> : null
      }
      <Message
        isOpen={onMessage.isMessage}
        children={onMessage.messageInfo}
        onMessageOpenOrClose={onMessageOpenOrClose}
      />
    </div>
  )
}
