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

export enum ActionType {
  REQUEST_START = 'request_start',                // request begin
  REQUEST_END = 'request_end',                    // request end
  GET_ACTIVITY_DATA = 'get_activity_data',        // get activities list
  NEXT_PAGE = 'next_page',                        // next page
  PRE_PAGE = 'pre_page',                          // previous page
  PAGE_SIZE_CHANGE = 'page_size_change',          // on page size change
  EDIT_ACTIVITY_INFO = 'edit_activity_info',      // edit activity info
  NOT_EDIT_ACTIVITY = 'not_edit_activity',        // init create activity
  KEYWORD_SEARCH = 'keyword_search',              // keyword search
}


export const activityPageReducer = (state: ActivityPageStateType, action: ActivityPageActionType) => {
  switch (action.type) {
    case ActionType.REQUEST_START:
      return {
        ...state,
        isLoading: true
      };
    case ActionType.GET_ACTIVITY_DATA:
      return {
        ...state,
        ...action.arguments,
        activityData: action.arguments.activityData
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
        pageSize: action.arguments.pageSize
      }
    case ActionType.KEYWORD_SEARCH:
      return {
        ...state,
        keyword: action.arguments.keyword
      }
    case ActionType.EDIT_ACTIVITY_INFO:
      return {
        ...state,
        isEdit: true,
        editActivityInfo: action.arguments.activityInfo
      }
    case ActionType.NOT_EDIT_ACTIVITY:
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
