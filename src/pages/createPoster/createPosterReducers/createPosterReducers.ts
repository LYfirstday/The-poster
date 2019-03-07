import { ControlPanelListType, ImgElementType } from './../poster';

// 当前页面选中元素状态，none:无选中元素，控制面板显示画板控制；image:选中图片元素，控制面
// 板显示图片控制面板；text：文本元素被选中;默认为none
export type PageCheckedType = 'none' | 'image' | 'text';

// 整个画板页面状态树
export interface CanvasPageState {
  pageStepState: object[],  // 保存画布数据相关每步操作状态，用与撤回操作，只保存数据相关改动操作，不保存ui变化操作
  imgsArrayList: ImgElementType[],    // 保存图片元素的数组
  title: string,
  canvasBacColor: string,    // 画布背景颜色
  canvasBacInputValue: string,    // 用户输入的背景色值
  errorInfo: string,    // 提示错误信息
  canvasBacImgUrl?: string,  // 保存上传至服务器的背景图地址
  canvasBackground: string,  // 将背景图地址放入style中
  controlPanelListInfo: ControlPanelListType[],  // 右侧浮动菜单列表
  activeElement: ImgElementType | {},
  pageCheckedType: PageCheckedType
}

// action type
export type ActionType = 'bacColor'    // 画布背景色板cahnge事件action
                       | 'bacColorValue'    // 用户输入背景色change事件action
                       | 'errorInfo'    // 输入错误背景色错误提示事件action
                       | 'bacImgUrl'    // 上传背景色图片事件action
                       | 'floatMenu'    // 右侧浮动菜单change事件action
                       | 'addImgElement'    // 添加图片元素事件
                       | 'imgMousedown'    // 图片元素鼠标按下事件action
                       | 'imgMousemove'    // 图片元素鼠标移动事件action
                       | 'imgMouseup'      // 图片元素鼠标弹起事件action
                       | 'deleteImgElement'    // 删除图片元素事件action
                       | 'imgSizeMousedown'    // 图片元素右下角改变图片大小的鼠标按下事件action
                       | 'imgSizeMousemove'    // 图片元素右下角改变图片大小的鼠标移动事件action
                       | 'imgSizeMouseup'      // 图片元素右下角改变图片大小的鼠标弹起事件action
                       | 'imgElementForm'      // 图片元素表单元素值change事件action

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
    case 'addImgElement':
      return {
        ...state
      }
    case 'imgMousedown':
      // 获取当前选中元素的clientY、clientX, 元素id
      let event = action.state.event;
      let distanceYDown = event.clientY - action.state.offsetTop;
      let distanceXDown = event.clientX - action.state.offsetLeft;
      let elId = action.state.elId;
      // 获取state中的该元素
      let listImgs = state.imgsArrayList;
      let thisImgDown = listImgs.filter(val => {
        return elId === val.id;
      })[0];
      thisImgDown.distanceY = distanceYDown;
      thisImgDown.distanceX = distanceXDown;
      return {
        ...state,
        pageCheckedType: 'image',
        title: '图片属性',
        activeElement: thisImgDown,
        imgsArrayList: [
          ...listImgs
        ]
      };
    case 'imgMousemove':
      let eventMove = action.state.event;
      // 获取该元素的id
      let elIdMove = action.state.elId;
      // 获取state中的该元素
      let listImgsMove = state.imgsArrayList;
      let thisImgMove = listImgsMove.filter(val => {
        return elIdMove === val.id;
      })[0];
      let disY = thisImgMove.distanceY;
      let disX = thisImgMove.distanceX;
      let topMove = `${eventMove.clientY - disY}px`;
      let leftMove = `${eventMove.clientX - disX}px`;
      // 设置外部容器的top left值
      thisImgMove.outerElementStyles.top = topMove;
      thisImgMove.outerElementStyles.left = leftMove;
      // 设置图片实际位置，因为外部容器的padding为20，所以加20
      thisImgMove.elementStyles.top = `${parseInt(topMove) + 20}px`;
      thisImgMove.elementStyles.left = `${parseInt(leftMove) + 20}px`;

      return {
        ...state,
        imgsArrayList: [
          ...listImgsMove
        ]
      };
    case 'imgMouseup':
      // 获取该元素的id
      let elIdUp = action.state.elId;
      // 获取state中的该元素
      let listImgsUp = state.imgsArrayList;
      let thisImgUp = listImgsUp.filter(val => {
        return elIdUp === val.id;
      })[0];
      thisImgUp.distanceY = 0;
      thisImgUp.distanceX = 0;

      return {
        ...state,
        imgsArrayList: [
          ...listImgsUp,
        ]
      };
    case 'deleteImgElement':
      let delList = state.imgsArrayList;
      let dIndex = action.state.index;
      delList.splice(dIndex, 1);
      return {
        ...state,
        imgsArrayList: [
          ...delList
        ]
      };
    case 'imgSizeMousedown':
      // 获取当前选中元素的clientY、clientX, 元素id
      let eventSize = action.state.event;
      let elIdSize = action.state.elId;
      // 获取state中的该元素
      let listImgsSize = state.imgsArrayList;
      listImgsSize.map(val => {
        if (elIdSize === val.id) {
          val.distanceY = eventSize.clientY;
          val.distanceX = eventSize.clientX;
        }
      })
      return {
        ...state,
        pageCheckedType: 'image',
        title: '图片属性',
        imgsArrayList: [
          ...listImgsSize
        ]
      };
    case 'imgSizeMousemove':
      let eventSizeMove = action.state.event;
      // 获取该元素的id
      let elIdSizeMove = action.state.elId;
      // 获取state中的该元素
      let listImgsSizeMove = state.imgsArrayList;
      let thisImgSizeMove = listImgsSizeMove.filter(val => {
        return elIdSizeMove === val.id;
      })[0];
      let disYSize = thisImgSizeMove.distanceY;
      let disXSize = thisImgSizeMove.distanceX;
      // 设置图片大小
      // 图片宽、高 = 旧的宽、高值 - 鼠标移动的距离
      thisImgSizeMove.elementStyles.height = `${parseInt(thisImgSizeMove.elementStyles.height) - (disYSize - eventSizeMove.clientY)}px`;
      thisImgSizeMove.elementStyles.width = `${parseInt(thisImgSizeMove.elementStyles.width) - (disXSize - eventSizeMove.clientX)}px`;
      // !!! 因为要给高、宽赋值，所以每次计算差值都要从最新的鼠标位置计算，将最新的event事件鼠标的位置重新赋值给dis
      thisImgSizeMove.distanceX = eventSizeMove.clientX;
      thisImgSizeMove.distanceY = eventSizeMove.clientY;
      return {
        ...state,
        imgsArrayList: [
          ...listImgsSizeMove
        ]
      };
    case 'imgSizeMouseup':
      // 获取该元素的id
      let elIdUpSize = action.state.elId;
      // 获取state中的该元素
      let listImgsUpSize = state.imgsArrayList;
      let thisImgUpSize = listImgsUpSize.filter(val => {
        return elIdUpSize === val.id;
      })[0];
      // 初始化dis值
      thisImgUpSize.distanceY = 0;
      thisImgUpSize.distanceX = 0;
      return {
        ...state,
        imgsArrayList: [
          ...listImgsUpSize,
        ]
      };
    case 'imgElementForm':
      return state;
    default:
      return state;
  }
}
