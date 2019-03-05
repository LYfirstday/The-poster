// action Type
type actionType = 'init' | 'next' | 'pre' | 'keyword' | 'release' | 'activity';

// 发布状态类型
export type projectStateType = {
  label: string,
  isActive: boolean,
  value: number
};

// 查询语句传参类型
export interface PosterQueryType {
  current?: number,
  pageSize?: number,
  keyword?: string,
  releaseType?: number,  // 发布状态类型
  activityType?: number
}

// 页面state
export interface PosterQueryDataType {
  current: number,
  pageSize: number,
  total: number,
  data: object[] | [],  // 接口返回数据
  projectStateType: projectStateType[],  // 项目状态
}

type PosterActionType = {
  type: actionType,
  state: PosterQueryType
};

export const posterReducers = (state: PosterQueryDataType, action: PosterActionType) => {
  switch (action.type) {
    case 'init':  // 初始化页面数据
      return state;
    case 'activity':  // 过滤项目状态
      let list = state.projectStateType;
      list.map(val => {
        val.isActive = action.state.activityType === val.value ? true : false
      })
      return {
        ...state,
        projectStateType: list
      };
    default:
      return state;
  }
}
