// 分页器action type值
export type paginationActionType = 'init' | 'next' | 'pre' | 'pageSize';
// 分页器变量状态类型
export interface PaginationState {
  current: number,
  total: number,
  pageSize: number,
  keyword?: string,
  data?: object[]
}
// 变更的数据action类型
export interface PaginationAction {
  type: paginationActionType,
  state?: any  // 数据
}

export const paginationReducer = (state: PaginationState, action: PaginationAction) => {
  switch (action.type) {
    case 'init':
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
    default:
      return action.state;
  }
}
