import * as React from 'react';
import './posters.less';
import { TextField, Button } from '@material-ui/core';
import PostersCardList from './postersCardList';
import { posterReducers, projectStateType } from './posterReducer/posterReducer';



export default () => {

  // 关键字查询
  const [keyword, setKeyword] = React.useState('');
  // 模板发布状态
  const projectStateValue: projectStateType[] = [
    {
      label: '已发布',
      isActive: true,
      value: 0
    },
    {
      label: '未发布',
      isActive: false,
      value: 1
    },
    {
      label: '全部',
      isActive: false,
      value: 2
    },
  ];
  // 初始状态
  const initState = {
    current: 0,
    pageSize: 10,
    total: 0,
    keyword: '',
    data: [],
    projectStateType: projectStateValue
  };

  const [state, dispatch] = React.useReducer(
    posterReducers,
    initState
  );

  const onSubmit = () => {
    console.log(keyword);
  }

  const onProjectStateChange = (typeId: number) => {
    dispatch({type: 'activity', state: {activityType: typeId}});
  }

  return (
    <div className='poster'>
      {/* 搜索栏 */}
      <div className='poster-search'>
        <form>
          <div className='poster-search-form'>
            <TextField
              id="outlined-uncontrolled"
              label="输入关键字搜索模板"
              margin="normal"
              variant="outlined"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className='poster-form-input'
            />
            <Button
              variant="contained"
              color="primary"
              type='submit'
              onClick={onSubmit}
              className='poster-search-btn'
            >搜 索</Button>
          </div>
        </form>
      </div>

      {/* 条件筛选 */}
      <div className='conditions-filter'>
        <div className='conditions-filter-activity'>
          <span className='title'>活动: </span>
          <div className='filter-items'>
            <span className='filter-item filter-item-active'>全部</span>
          </div>
        </div>
        <div className='conditions-filter-state'>
          <span className='title'>状态: </span>
          <div className='filter-items'>
            {
              state.projectStateType.map((val, i) =>
                <span
                  key={`${i}${val.value}`}
                  onClick={() => onProjectStateChange(val.value)}
                  className={val.isActive ? 'filter-item filter-item-active' : 'filter-item'}
                >{val.label}</span>
              )
            }
          </div>
        </div>
      </div>

      {/* 模板卡片列表 */}
      <PostersCardList
        data={state.data}
      />
    </div>
  )
}
