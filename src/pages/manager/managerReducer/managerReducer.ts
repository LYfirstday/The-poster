// 管理端用户管理页面

export interface ManagerPageStateType {
  keyword: string,
  number: number,
  size: number,
  total: number,
  managerList: ManagerInfoType[],
  isEdit: boolean,
  editManagerInfo: ManagerInfoType | {}
}

export interface ManagerInfoType {
  userName: string,
  roleId?: string,
  userId?: string,
  userPassword: string
}

export enum ActionType {
  REQUEST_START = 'request_start',                  // request begin
  REQUEST_END = 'request_end',                      // request end
  GET_MANAGER_DATA = 'get_manager_data',            // get manager list
  NEXT_PAGE = 'next_page',                          // next page
  PRE_PAGE = 'pre_page',                            // previous page
  PAGE_SIZE_CHANGE = 'page_size_change',            // on page size change
  EDIT_MANAGER_INFO = 'edit_manager_info',          // edit manager info
  NOT_EDIT_MANAGER = 'not_edit_manager',            // init create manager 
  KEYWORD_SEARCH = 'keyword_search'                 // keyword search
};

export interface PageActionType {
  arguments?: any,
  type: ActionType
}

export const managerPageReducer = (state: ManagerPageStateType, action: PageActionType) => {
  switch (action.type) {
    case ActionType.REQUEST_START:
      return {
        ...state,
        isLoading: true
      };
    case ActionType.GET_MANAGER_DATA:
      return {
        ...state,
        ...action.arguments,
        managerList: action.arguments.managerList
      }
    case ActionType.REQUEST_END:
      return {
        ...state,
        isLoading: false
      }
    case ActionType.NEXT_PAGE:
      return {
        ...state,
        number: state.number + 1
      }
    case ActionType.PRE_PAGE:
      return {
        ...state,
        number: state.number - 1
      }
    case ActionType.PAGE_SIZE_CHANGE:
      return {
        ...state,
        number: 0,
        size: action.arguments.size
      }
    case ActionType.KEYWORD_SEARCH:
      return {
        ...state,
        keyword: action.arguments.keyword
      }
    case ActionType.EDIT_MANAGER_INFO:
      return {
        ...state,
        isEdit: true,
        editManagerInfo: action.arguments.managerInfo
      }
    case ActionType.NOT_EDIT_MANAGER:
      return {
        ...state,
        isEdit: false,
        editManagerInfo: {}
      }
    default:
      return {
        ...state
      };
  }
}