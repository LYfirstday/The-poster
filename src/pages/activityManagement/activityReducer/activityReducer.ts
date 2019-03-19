export type ActivityData = {
  typeName: string,
  typeContext: string,
  typeId?: string
};
export interface ActivityPageStateType {
  keyword?: string,
  number: number,
  total: number,
  pageSize: number,
  activityData: ActivityData[],
  isLoading: boolean,
  isEdit: boolean,
  editActivityInfo: ActivityData | {}
}

export type ActivityPageActionType = {
  arguments?: any,
  type: ActionType
};

export type ActionType = 'request_start'            // request begin
                       | 'get_activity_data'        // get activities list
                       | 'request_end'              // request end
                       | 'next_page'                // next page
                       | 'pre_page'                 // previous page
                       | 'page_size_change'         // on page size change
                       | 'edit_activity_info'       // edit activity info
                       | 'not_edit_activity'        // init create activity
                       | 'keyword_search'           // keyword search


export const activityPageReducer = (state: ActivityPageStateType, action: ActivityPageActionType) => {
  switch (action.type) {
    case 'request_start':
      return {
        ...state,
        isLoading: true
      };
    case 'get_activity_data':
      return {
        ...state,
        ...action.arguments,
        activityData: action.arguments.activityData
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
        pageSize: action.arguments.pageSize
      }
    case 'keyword_search':
      return {
        ...state,
        keyword: action.arguments.keyword
      }
    case 'edit_activity_info':
      return {
        ...state,
        isEdit: true,
        editActivityInfo: action.arguments.activityInfo
      }
    case 'not_edit_activity':
      return {
        ...state,
        isEdit: false,
        editActivityInfo: {}
      }
    default:
      return {
        ...state
      };
  }
}
