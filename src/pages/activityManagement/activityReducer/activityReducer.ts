export interface ActivityPageStateType {
  keyword?: string,
  number: number,
  total: number,
  pageSize: number,
  activityData?: object[]
}

export type ActivityPageActionType = {
  nextState: any,
  type: ActionType
};

export type ActionType = 'request';

export const activityPageReducer = (state: ActivityPageStateType, action: ActivityPageActionType) => {
  switch (action.type) {
    case 'request':
      
      return {
        ...state
      };
    default:
      return {
        ...state
      };
  }
}
