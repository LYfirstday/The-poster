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
    color: '#111111'
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
export type ActionType = 'bacColor'    // 画布背景色板cahnge事件action
                       | 'errorInfo'    // 输入错误背景色错误提示事件action
                       | 'bacImgUrl'    // 上传背景色图片事件action
                       | 'floatMenu'    // 右侧浮动菜单change事件action
                       | 'activityUrl'    // 添加活动页面

                       // ===========================图片元素action type
                       | 'image_element_mouse_down'
                       | 'image_element_mouse_move'
                       | 'image_element_delete'
                       | 'image_element_size_change_mouse_move'
                       | 'image_element_top_left_zIndex_transform_h_w_change'
                       | 'image_element_rotate_change'     // 图片元素表单元素值change事件action --- 角度变化
                       | 'image_element_is_allowed_edit'
                       | 'page_element_change'    // 页面选中元素改变 PageCheckedType

                       // ==============================文本元素action type
                       | 'text_element_mouse_down'
                       | 'text_element_mouse_move'
                       | 'text_element_delete'
                       | 'text_element_size_change_mouse_move'
                       | 'fontFamily'
                       | 'fontSize'
                       | 'textFormTopLeftZIndex'    // 文本元素Top Left ZIndex三个属性表单变化时的action
                       | 'textFormItemChange'   // 文本元素自有属性表单值变化时的action
                       | 'textComFontSizeFontFamily'    // 文本元素字号、字体改变action
                       | 'allowTextComEdited'  // 是否允许文本元素可编辑
                       | 'textComTramsformChange'    // 文本元素旋转角度变化action
                       | 'textComContentChage'  //  文本内容变化
                       | 'request_start'
                       | 'request_end'
                       | 'activityType_change'  // 活动类型变化

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
    case 'bacColor':
      return {
        ...state,
        pageState: {
          ...state.pageState,
          canvasBackground: `url(${state.pageState.canvasBacImgUrl}) no-repeat center ${action.state.bacColor}`,
          canvasBacInputValue: action.state.bacColor
        }
      };
    case 'errorInfo':
      return {
        ...state,
        pageState: {
          ...state.pageState,
          errorInfo: action.state.errorInfo
        }
      };
    case 'bacImgUrl':
      return {
        ...state,
        pageState: {
          ...state.pageState,
          canvasBacImgUrl: action.state.bacImgUrl,
          canvasBackground: `url('${action.state.bacImgUrl}') no-repeat center #fff`
        }
      };
    case 'activityUrl':
      return {
        ...state,
        pageState: {
          ...state.pageState,
          activityPageUrl: action.state.val
        }
      };
    // 画布样式action================================================end

    // 右侧浮动菜单action================================================begin
    case 'floatMenu':
      let list = state.pageState.controlPanelListInfo;
      list.map((val, i) => {
        val.isActive = action.state.floatMenu === i ? true : false;
      });
      switch (action.state.floatMenu) {
        case 0:
          let addImgList = state.pageState.imgsArrayList;
          let newImgEL = {
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
          addImgList.push(newImgEL);

          return {
            ...state,
            pageState: {
              ...state.pageState,
              controlPanelListInfo: list,
              imgsArrayList: [
                ...addImgList
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
            pageState: {
              ...state.pageState,
            }
          };
      }
    // 右侧浮动菜单action================================================end

    // 图片元素action================================================begin
    case 'image_element_mouse_down':
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

    case 'image_element_mouse_move':
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

    case 'image_element_delete':
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

    case 'image_element_size_change_mouse_move':
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

    case 'image_element_rotate_change':
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

    case 'image_element_is_allowed_edit':
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

    case 'image_element_top_left_zIndex_transform_h_w_change':
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
    case 'page_element_change':
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
    case 'text_element_mouse_down':
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

    case 'text_element_mouse_move':
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

    case 'text_element_delete':
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

    case 'text_element_size_change_mouse_move':
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

    case 'textFormTopLeftZIndex':
      let changeValue = action.state.val;
      let itemChangeElZindexList = state.pageState.textArrayList;
      let itemChangeEl = itemChangeElZindexList.filter(val => {
        return val.isChecked === true;
      })[0];
      let outerValue = {
        top: `${parseInt(changeValue.top) - 20}px`,
        left: `${parseInt(changeValue.left) - 20}px`,
        zIndex: parseInt(changeValue.zIndex),
      };
      let innerValue = {
        top: `${parseInt(changeValue.top)}px`,
        left: `${parseInt(changeValue.left)}px`,
        zIndex: parseInt(changeValue.zIndex),
      };
      itemChangeEl.textElementOuterType = {
        ...itemChangeEl.textElementOuterType,
        ...outerValue
      };
      itemChangeEl.elementStyles = {
        ...itemChangeEl.elementStyles,
        ...innerValue
      };

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...itemChangeElZindexList
          ]
        }
      };

    case 'textFormItemChange':
      let formItemList = state.pageState.textArrayList;
      let formItemChangeEl = formItemList.filter(val => {
        return val.isChecked === true;
      })[0];
      // 获取字体属性按钮类型
      let formItemType = action.state.type;
      // 获取控制字体属性选中列表
      let fontStyleImgList = formItemChangeEl.fontStyleImgList;
      
      // 当点击的按钮类型为textAlign时，修改按钮激活状态，三个按钮只能有一个处于激活
      if (formItemType === 'textAlign') {
        switch (action.state.value) {
          case 'left':
            fontStyleImgList[3].isChecked = true;
            fontStyleImgList[4].isChecked = false;
            fontStyleImgList[5].isChecked = false;
            break;
          case 'center':
            fontStyleImgList[3].isChecked = false;
            fontStyleImgList[4].isChecked = true;
            fontStyleImgList[5].isChecked = false;
            break;
          case 'right':
            fontStyleImgList[3].isChecked = false;
            fontStyleImgList[4].isChecked = false;
            fontStyleImgList[5].isChecked = true;
            break;
          default:
            break;
        }
        formItemChangeEl.elementStyles.textAlign = action.state.value;
      } else if ('minHeight' === formItemType || 'width' === formItemType || 'color' === formItemType) {
        formItemChangeEl.elementStyles[formItemType] = formItemType === 'color' ? action.state.value : `${action.state.value}px`;
      } else {
        let activeFontStyle = fontStyleImgList.filter(val => {
          return val.type === formItemType;
        })[0];
        // 如果按钮即将设为false，未激活状态，则将样式取消
        activeFontStyle.isChecked = !activeFontStyle.isChecked;
        if ((activeFontStyle.isChecked) === false) {
          switch (formItemType) {
            case 'fontWeight':
              formItemChangeEl.elementStyles.fontWeight = 500;
              break;
            case 'textDecoration':
              formItemChangeEl.elementStyles.textDecoration = 'none';
              break;
            case 'fontStyle':
              formItemChangeEl.elementStyles.fontStyle = '';
              break;
            default:
              break;
          }
        } else {
          formItemChangeEl.elementStyles[formItemType] = `${action.state.value}`;
        }
      }
      formItemChangeEl.elementStyles = {
        ...formItemChangeEl.elementStyles,
      };

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...formItemList
          ]
        }
      };

    case 'textComFontSizeFontFamily':
      let fontStyleList = state.pageState.textArrayList;
      let fontStyleChangeEl = fontStyleList.filter(val => {
        return val.isChecked === true;
      })[0];
      let fontStyleType = action.state.type;
      fontStyleChangeEl.elementStyles[fontStyleType] = action.state.value;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...fontStyleList
          ]
        }
      };

    case 'allowTextComEdited':
      let canEditedList = state.pageState.textArrayList;
      let canEditedEl = canEditedList.filter(val => {
        return val.isChecked === true;
      })[0];
      canEditedEl.isAllowEdit = !canEditedEl.isAllowEdit;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...canEditedList
          ]
        }
      };

    case 'textComTramsformChange':
      let transformList = state.pageState.textArrayList;
      let transformEl = transformList.filter(val => {
        return val.isChecked === true;
      })[0];
      transformEl.textElementOuterType.transform = action.state.value;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...transformList
          ]
        }
      };
      
    case 'textComContentChage':
      let contentList = state.pageState.textArrayList;
      let contentEl = contentList.filter(val => {
        return val.isChecked === true;
      })[0];
      contentEl.content = action.state.content;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...contentList
          ]
        }
      }
    // 文本元素action==============================================================end

    case 'request_start':
      return {
        ...state,
        isLoading: true
      }
    case 'request_end':
      return {
        ...state,
        isLoading: false
      }
    case 'activityType_change':
      return {
        ...state,
        activityTypeId: action.state.typeId
      }

    default:
      return state;
  }
}
