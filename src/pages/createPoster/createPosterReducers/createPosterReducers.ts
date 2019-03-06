import { ControlPanelListType, ImgElementType } from './../poster';

// 整个画板页面状态树
export interface CanvasPageState {
  pageStepState: object[],  // 保存画布数据相关每步操作状态，用与撤回操作，只保存数据相关改动操作，不保存ui变化操作
  imgsArrayList: ImgElementType[],
  title: string,
  canvasBacColor: string,
  canvasBacInputValue: string,
  errorInfo: string,
  canvasBacImgUrl?: string,  // 保存上传至服务器的背景图地址
  canvasBackground: string,  // 将背景图地址放入style中
  controlPanelListInfo: ControlPanelListType[],  // 右侧浮动菜单列表
}

// action type
export type ActionType = 'bacColor'    // 背景色板cahnge事件action
                       | 'bacColorValue'    // 用户输入背景色change事件action
                       | 'errorInfo'    // 输入错误背景色错误提示事件action
                       | 'bacImgUrl'    // 上传背景色图片事件action
                       | 'floatMenu'    // 右侧浮动菜单change事件action
                       | 'imgMousedown'    // 图片元素鼠标按下事件action
                       | 'imgMousemove'    // 图片元素鼠标移动事件action

export interface ActionTypeInfo {
  type: ActionType,
  state?: any
}

export const CanvasPageReducer = (state: CanvasPageState, action: ActionTypeInfo) => {
  switch (action.type) {
    case 'bacColor':
      return {
        ...state,
        canvasBackground: `url(${state.canvasBacImgUrl}) no-repeat center ${action.state.bacColor}`
      };
    case 'bacColorValue':
      return {
        ...state,
        canvasBacInputValue: action.state.bacColorValue
      };
    case 'errorInfo':
      return {
        ...state,
        errorInfo: action.state.errorInfo
      };
    case 'bacImgUrl':
      return state;
    case 'floatMenu':
      let list = state.controlPanelListInfo;
      list.map((val, i) => {
        val.isActive = action.state.floatMenu === i ? true : false;
      });
      switch (action.state.floatMenu) {
        case 0:
          console.log(action.state)
          return {
            ...state,
            controlPanelListInfo: list
          };
        default:
          return {
            ...state,
            controlPanelListInfo: list
          };
      }
    case 'imgMousedown':
      console.log(action.state)
      return state;
    case 'imgMousemove':
      console.log(action.state)
      return state;
    default:
      return state;
  }
}
