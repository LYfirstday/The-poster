// 分页器action type值
export type paginationActionType = 'init' | 'next' | 'pre' | 'pageSize' | 'keyword';
// 分页器变量状态类型
export type PaginationState = {
  current: number,
  total: number,
  pageSize: number,
  serviceUrl: string,
  keyword?: string,
  data?: object[]
}
// 变更的数据action类型
export interface PaginationAction {
  type: paginationActionType,
  state?: any  // 数据
}

// 分页查询reducer
export const paginationReducer = (state: PaginationState, action: PaginationAction) => {
  switch (action.type) {
    case 'init':
      console.log(state)
      return state;
    case 'next':
      return {
        ...state,
        current: state.current + 1
      };
    case 'pre':
      return {
        ...state,
        current: state.current - 1
      };
    case 'pageSize':
      return {
        ...state,
        pageSize: action.state.pageSize
      };
    case 'keyword':
      console.log(action);
      return {
        ...state,
        keyword: action.state.keyword
      };
    default:
      return action.state;
  }
}
