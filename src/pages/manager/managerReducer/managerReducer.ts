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

export type ActionType = 'request_start'            // request begin
                       | 'get_manager_data'         // get manager list
                       | 'request_end'              // request end
                       | 'next_page'                // next page
                       | 'pre_page'                 // previous page
                       | 'page_size_change'         // on page size change
                       | 'edit_manager_info'        // edit manager info
                       | 'not_edit_manager'         // init create manager
                       | 'keyword_search'           // keyword search

export interface PageActionType {
  arguments?: any,
  type: ActionType
}

export const managerPageReducer = (state: ManagerPageStateType, action: PageActionType) => {
  switch (action.type) {
    case 'request_start':
      return {
        ...state,
        isLoading: true
      };
    case 'get_manager_data':
      return {
        ...state,
        ...action.arguments,
        managerList: action.arguments.managerList
      }
    case 'request_end':
      return {
        ...state,
        isLoading: false
      }
    case 'next_page':
      return {
        ...state,
        number: state.number + 1
      }
    case 'pre_page':
      return {
        ...state,
        number: state.number - 1
      }
    case 'page_size_change':
      return {
        ...state,
        number: 0,
        size: action.arguments.size
      }
    case 'keyword_search':
      return {
        ...state,
        keyword: action.arguments.keyword
      }
    case 'edit_manager_info':
      return {
        ...state,
        isEdit: true,
        editManagerInfo: action.arguments.managerInfo
      }
    case 'not_edit_manager':
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