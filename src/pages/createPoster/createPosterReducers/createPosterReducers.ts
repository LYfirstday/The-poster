import { ControlPanelListType, ImgElementType, TextComStyleType, FontStyleImgType } from './../poster';
import { deepCopy, getElementDomId } from './../../../static/ts/tools';

// export type PageCheckedType = 'none' | 'image' | 'text';
// 当前页面选中元素状态，none:无选中元素，控制面板显示画板控制；image:选中图片元素，控制面
// 板显示图片控制面板；text：文本元素被选中;默认为none

const fontStyleImgList: FontStyleImgType[] = [
  {
    isChecked: false,
    alt: '加粗',
    src: require('./../../../static/imgs/overstriking.png'),
    type: 'fontWeight',
    value: 600
  },
  {
    isChecked: false,
    alt: '下划线',
    src: require('./../../../static/imgs/underline.png'),
    type: 'textDecoration',
    value: 'underline'
  },
  {
    isChecked: false,
    alt: '斜体',
    src: require('./../../../static/imgs/italic.png'),
    type: 'fontStyle',
    value: 'italic'
  },
  {
    isChecked: true,
    alt: '居左',
    src: require('./../../../static/imgs/text-algin-left.png'),
    type: 'textAlign',
    value: 'left'
  },
  {
    isChecked: false,
    alt: '居中',
    src: require('./../../../static/imgs/text-algin-center.png'),
    type: 'textAlign',
    value: 'center'
  },
  {
    isChecked: false,
    alt: '居右',
    src: require('./../../../static/imgs/text-algin-right.png'),
    type: 'textAlign',
    value: 'right'
  },
];

// 整个画板页面状态树
export interface CanvasPageState {
  // 保存画布数据相关每步操作状态，用于撤回操作，只保存数据相关改动操作，不保存ui变化操作
  // 图片和文本元素在移动过程中，保存mouseup时的状态，mousemove不保存;size改变一样，mouseups时保存状态
  pageStepState: object[],
  pageState: {
    imgsArrayList: ImgElementType[],    // 保存图片元素的数组
    textArrayList: TextComStyleType[],   // 保存文本元素的数组
    title: string,
    canvasBacInputValue: string,    // 用户输入的背景色值
    errorInfo: string,    // 提示错误信息
    canvasBacImgUrl?: string,  // 保存上传至服务器的背景图地址
    canvasBackground: string,  // 将背景图地址放入style中，用来在dom上显示
    controlPanelListInfo: ControlPanelListType[],  // 右侧浮动菜单列表
    activeElement: ImgElementType | TextComStyleType | {},
    pageCheckedType: string,
    activityPageUrl: string,    // 活动页面
  },
  isLoading: boolean,
  activityTypeId: string,  // 活动类型id
}

// 添加初始化文本元素
let initTextElement: TextComStyleType = {
  textElementOuterType: {
    transform: 'rotate(0)',
    top: '270px',
    left: '55px',
    zIndex: 999,
  },
  elementStyles: {
    fontFamily: 'sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    fontStyle: '',
    textAlign: 'left',
    top: '290px',
    left: '75px',
    minHeight: '21px',
    width: '300px',
    zIndex: 1,
    color: '#111111',
    lineHeight: 1.2
  },
  content: '选中文本元素，在控制板修改内容',
  isChecked: false,
  elementType: 'text',
  id: '',
  isAllowEdit: false,
  distanceY: 0,
  distanceX: 0,
  fontStyleImgList: deepCopy(fontStyleImgList)
};

// action type
export enum ActionType {
  BACKGROUND_COLOR = 'bacColor',    // 画布背景色板cahnge事件action
  ERROR_INFO = 'errorInfo',    // 输入错误背景色错误提示事件action
  BACKGROUND_IMAGE_URL = 'bacImgUrl',    // 上传背景色图片事件action
  FLOAT_MENU = 'floatMenu',    // 右侧浮动菜单change事件action
  ACTIVITY_URL = 'activityUrl',    // 添加活动页面
  PAGE_ELEMENT_CHANGE = 'page_element_change',    // 页面选中元素改变 PageCheckedType
  // ===========================图片元素action type
  IMAGE_ELEMENT_MOUSE_DOWN = 'image_element_mouse_down',
  IMAGE_ELEMENT_MOUSE_MOVE = 'image_element_mouse_move',
  IMAGE_ELEMENT_DELETE = 'image_element_delete',
  IMAGE_ELEMENT_SIZE_CHANGE_MOUSE_MOVE = 'image_element_size_change_mouse_move',
  IMAGE_ELEMENT_TOP_LEFT_ZINDEX_TRANSFORM_HEIGHT_WIDTH_CHANGE = 'image_element_top_left_zIndex_transform_h_w_change',
  // 图片元素表单元素值change事件action --- 角度变化
  IMAGE_ELEMENT_ROTAET_CHANGE = 'image_element_rotate_change',
  IMAGE_ELEMENT_IS_ALLOWED_EDIT = 'image_element_is_allowed_edit',
  // ==============================文本元素action type
  TEXT_ELEMENT_MOUSE_DOWN = 'text_element_mouse_down',
  TEXT_ELEMENT_MOUSE_MOVE = 'text_element_mouse_move',
  TEXT_ELEMENT_DELETE = 'text_element_delete',
  TEXT_ELEMENT_SIZE_CHANGE_MOUSE_MOVE = 'text_element_size_change_mouse_move',
  TEXT_ELEMENT_CONTROL_PANEL_FORM = 'text_element_control_panel_form',     // 文本元素控制板form表单数据change事件

  REQUEST_START = 'request_start',
  REQUEST_END = 'request_end',
  ACTIVITY_TYPE_CHANGE = 'activityType_change',  // 活动类型变化
}

export interface ActionTypeInfo {
  type: ActionType,
  state?: any
}

// 控制初始化页面状态撤回
// let index = 1;

export const CanvasPageReducer = (state: CanvasPageState, action: ActionTypeInfo) => {
  // index=1时，push页面最初状态
  // if (index === 1) {
  //   index = 2;
  //   state.pageStepState.push(state.pageState);
  // }
  let imageElementsList = state.pageState.imgsArrayList;
  let textElementsList = state.pageState.textArrayList;

  switch (action.type) {
    // 画布样式action================================================begin
    case ActionType.BACKGROUND_COLOR:
      return {
        ...state,
        pageState: {
          ...state.pageState,
          canvasBackground: `url(${state.pageState.canvasBacImgUrl}) no-repeat center ${action.state.bacColor}`,
          canvasBacInputValue: action.state.bacColor
        }
      };
    case ActionType.ERROR_INFO:
      return {
        ...state,
        pageState: {
          ...state.pageState,
          errorInfo: action.state.errorInfo
        }
      };
    case ActionType.BACKGROUND_IMAGE_URL:
      return {
        ...state,
        pageState: {
          ...state.pageState,
          canvasBacImgUrl: action.state.bacImgUrl,
          canvasBackground: `url('${action.state.bacImgUrl}') no-repeat center #fff`
        }
      };
    case ActionType.ACTIVITY_URL:
      return {
        ...state,
        pageState: {
          ...state.pageState,
          activityPageUrl: action.state.val
        }
      };
    // 画布样式action================================================end

    // 右侧浮动菜单action================================================begin
    case ActionType.FLOAT_MENU:
      let list = state.pageState.controlPanelListInfo;
      list.map((val, i) => {
        val.isActive = action.state.floatMenu === i ? true : false;
      });
      switch (action.state.floatMenu) {
        case 0:
          let newImgEL: ImgElementType = {
            elementType: 'image',
            id: getElementDomId('image'),
            isChecked: false,
            imgUrl: action.state.imgUrl,
            elementStyles: {
              height: '150px',
              width: '150px',
              top: '290px',
              left: '130px',
              zIndex: 1
            },
            outerElementStyles: {
              top: '270px',
              left: '110px',
              zIndex: 1,
              transform: 'rotate(0)',
            },
            isAllowEdit: false,
            distanceY: 0,
            distanceX: 0
          }
          newImgEL.imgUrl = action.state.imgUrl;
          newImgEL.id = getElementDomId('image');
          imageElementsList.push(newImgEL);

          return {
            ...state,
            pageState: {
              ...state.pageState,
              controlPanelListInfo: list,
              imgsArrayList: [
                ...imageElementsList
              ]
            }
          }
        case 1:
          let addTextList = state.pageState.textArrayList;
          let newTextEL = deepCopy(initTextElement);
          newTextEL.id = getElementDomId('text');
          addTextList.push(newTextEL);
          return {
            ...state,
            pageState: {
              ...state.pageState,
              controlPanelListInfo: list,
              textArrayList: [
                ...addTextList
              ]
            }
          }
        case 2:
          let stepList = state.pageStepState;
          let olderPageState = stepList.splice(stepList.length-2, 1)[0];
          return {
            ...state,
            pageState: {
              ...state.pageState,
              ...olderPageState
            }
          };
        default:
          return {
            ...state,
          };
      }
    // 右侧浮动菜单action================================================end

    // 图片元素action================================================begin
    case ActionType.IMAGE_ELEMENT_MOUSE_DOWN:
      let activeElement = {};
      imageElementsList.map(val => {
        if (action.state.elId === val.id) {
          val.isChecked = true;
          val.distanceY = action.state.distanceY;
          val.distanceX = action.state.distanceX;
          activeElement = val;
        } else {
          val.isChecked = false;
          val.distanceY = 0;
          val.distanceX = 0;
        }
      });
      // relieve text element isChecked state
      if (textElementsList.length > 0) {
        textElementsList.map(val => {
          val.isChecked = false;
        })
      }

      return {
        ...state,
        pageState: {
          ...state.pageState,
          pageCheckedType: 'image',
          activeElement: activeElement,
          title: '图片元素',
          imgsArrayList: [
            ...imageElementsList
          ],
          textElementsList: [
            ...textElementsList
          ]
        }
      }

    case ActionType.IMAGE_ELEMENT_MOUSE_MOVE:
      let thisImageElementMM = imageElementsList.filter(val => {
        return action.state.elId === val.id;
      })[0];
      // 设置外部容器的top left值
      thisImageElementMM.outerElementStyles.top = action.state.topMove;
      thisImageElementMM.outerElementStyles.left = action.state.leftMove;
      // 设置图片实际位置，因为外部容器的padding为20，所以加20
      thisImageElementMM.elementStyles.top = `${parseInt(action.state.topMove) + 20}px`;
      thisImageElementMM.elementStyles.left = `${parseInt(action.state.leftMove) + 20}px`;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...imageElementsList
          ]
        }
      }

    case ActionType.IMAGE_ELEMENT_DELETE:
      imageElementsList.splice(action.state.index, 1);

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...imageElementsList
          ]
        }
      }

    case ActionType.IMAGE_ELEMENT_SIZE_CHANGE_MOUSE_MOVE:
      let thisSizeChangeEl = imageElementsList.filter(val => {
        return action.state.elId === val.id;
      })[0];
      thisSizeChangeEl.elementStyles.height = `${action.state.height}px`;
      thisSizeChangeEl.elementStyles.width = `${action.state.width}px`
      thisSizeChangeEl.distanceY = action.state.distanceY;
      thisSizeChangeEl.distanceX = action.state.distanceX;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...imageElementsList
          ]
        }
      }

    case ActionType.IMAGE_ELEMENT_ROTAET_CHANGE:
      // 获取state中的该元素 isChecked为true(当触发mousedown事件时，isChecked为true),所以提交的form表单为选中的元素
      let thisRotateChangeElement = imageElementsList.filter(val => {
        return action.state.elId === val.id;
      })[0];
      thisRotateChangeElement.outerElementStyles = {
        ...thisRotateChangeElement.outerElementStyles,
        transform: action.state.value
      };

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...imageElementsList
          ]
        }
      };

    case ActionType.IMAGE_ELEMENT_IS_ALLOWED_EDIT:
      let thisAllowedEditElement = imageElementsList.filter(val => {
        return action.state.elId === val.id;
      })[0];
      thisAllowedEditElement.isAllowEdit = action.state.value;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...imageElementsList
          ]
        }
      }

    case ActionType.IMAGE_ELEMENT_TOP_LEFT_ZINDEX_TRANSFORM_HEIGHT_WIDTH_CHANGE:
      let type = action.state.type;
      let changedValue = action.state.value;

      let thisImageElementTLZT = imageElementsList.filter(val => {
        return action.state.elId === val.id;
      })[0];
      // when the changed style type is transform, only the outer container`s style
      if (type === 'transform') {
        thisImageElementTLZT.outerElementStyles.transform = `rotate(${parseInt(changedValue)}deg)`;
      } else if (type === 'height' || type === 'width') {  // only the inner dom`s style
        thisImageElementTLZT.elementStyles = {
          ...thisImageElementTLZT.elementStyles,
          [action.state.type]: `${parseInt(changedValue)}px`
        };
      } else {
        thisImageElementTLZT.elementStyles = {
          ...thisImageElementTLZT.elementStyles,
          [action.state.type]: action.state.type === 'zIndex'
                                                  ? parseInt(changedValue)
                                                  : `${parseInt(changedValue)}px`
        };
        thisImageElementTLZT.outerElementStyles = {
          ...thisImageElementTLZT.outerElementStyles,
          [action.state.type]: action.state.type === 'zIndex'
                                                  ? parseInt(changedValue)
                                                  : `${parseInt(changedValue) - 20}px`
        };
      }

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...imageElementsList
          ]
        }
      };

    // 点击页面空白处，图片元素和文本元素取消选中状态
    case ActionType.PAGE_ELEMENT_CHANGE:
      let typeValue = action.state.value;
      imageElementsList.map(val => {
        val.isChecked = false;
      })
      textElementsList.map(val => {
        val.isChecked = false;
      })

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...imageElementsList
          ],
          textArrayList: [
            ...textElementsList
          ],
          pageCheckedType: typeValue,
          title: '画布属性'
        }
      };
    // 图片元素action================================================end

    // 文本元素action==============================================================begin
    case ActionType.TEXT_ELEMENT_MOUSE_DOWN:
      let activeTextElement = {};
      textElementsList.map(val => {
        if (action.state.elId === val.id) {
          val.isChecked = true;
          val.distanceY = action.state.distanceY;
          val.distanceX = action.state.distanceX;
          activeTextElement = val;
        } else {
          val.isChecked = false;
          val.distanceY = 0;
          val.distanceX = 0;
        }
      });
      // relieve text element isChecked state
      if (imageElementsList.length > 0) {
        imageElementsList.map(val => {
          val.isChecked = false;
        })
      }

      return {
        ...state,
        pageState: {
          ...state.pageState,
          pageCheckedType: 'text',
          activeElement: activeTextElement,
          title: '文本元素',
          imgsArrayList: [
            ...imageElementsList
          ],
          textArrayList: [
            ...textElementsList
          ]
        }
      }

    case ActionType.TEXT_ELEMENT_MOUSE_MOVE:
      let thisTextElementMM = textElementsList.filter(val => {
        return action.state.elId === val.id;
      })[0];
      // 设置外部容器的top left值
      thisTextElementMM.textElementOuterType.top = action.state.topMove;
      thisTextElementMM.textElementOuterType.left = action.state.leftMove;
      // 设置文本元素实际位置，因为外部容器的padding为20，所以加20
      thisTextElementMM.elementStyles.top = `${parseInt(action.state.topMove) + 20}px`;
      thisTextElementMM.elementStyles.left = `${parseInt(action.state.leftMove) + 20}px`;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...textElementsList
          ]
        }
      }

    case ActionType.TEXT_ELEMENT_DELETE:
      textElementsList.splice(action.state.index, 1);

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...textElementsList
          ]
        }
      }

    case ActionType.TEXT_ELEMENT_SIZE_CHANGE_MOUSE_MOVE:
      let thisSizeChangeTextEl = textElementsList.filter(val => {
        return action.state.elId === val.id;
      })[0];

      thisSizeChangeTextEl.elementStyles.minHeight = `${action.state.minHeight}px`;
      thisSizeChangeTextEl.elementStyles.width = `${action.state.width}px`
      thisSizeChangeTextEl.distanceY = action.state.distanceY;
      thisSizeChangeTextEl.distanceX = action.state.distanceX;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...textElementsList
          ]
        }
      }

    case ActionType.TEXT_ELEMENT_CONTROL_PANEL_FORM:
      let thisTextElement = textElementsList.filter(val => {
        return action.state.elId === val.id;
      })[0];
      let styleType = action.state.styleType;
      let value = action.state.value;

      if (styleType === 'content') {
        thisTextElement.content = value;
      } else if (styleType === 'transform') {
        thisTextElement.textElementOuterType.transform = value;
      } else if (styleType === 'isAllowEdit') {
        thisTextElement.isAllowEdit = Boolean(value);
      } else if (styleType === 'width' || styleType === 'minHeight') {
        thisTextElement.elementStyles = {
          ...thisTextElement.elementStyles,
          [styleType]: `${value}px`
        };
      } else if (styleType === 'top' || styleType === 'left' || styleType === 'zIndex') {
        thisTextElement.elementStyles = {
          ...thisTextElement.elementStyles,
          [styleType]: styleType === 'zIndex' ? parseInt(value) : `${value}px`
        };
        // 因为外部容器有 20的padding  所以外部容器位置需要减去20
        thisTextElement.textElementOuterType = {
          ...thisTextElement.textElementOuterType,
          [styleType]: styleType === 'zIndex' ? parseInt(value) : `${parseInt(value) - 20}px`
        };
      } else {
        thisTextElement.elementStyles = {
          ...thisTextElement.elementStyles,
          [styleType]: value
        };
      }
      
      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...textElementsList
          ]
        }
      }

    // 文本元素action==============================================================end

    case ActionType.REQUEST_START:
      return {
        ...state,
        isLoading: true
      }
    case ActionType.REQUEST_END:
      return {
        ...state,
        isLoading: false
      }
    case ActionType.ACTIVITY_TYPE_CHANGE:
      return {
        ...state,
        activityTypeId: action.state.typeId
      }

    default:
      return state;
  }
}
