import { ControlPanelListType, ImgElementType, TextComStyleType } from './../poster';

// 当前页面选中元素状态，none:无选中元素，控制面板显示画板控制；image:选中图片元素，控制面
// 板显示图片控制面板；text：文本元素被选中;默认为none
export type PageCheckedType = 'none' | 'image' | 'text';
import { rotateValueFilter } from './../../../static/ts/tools';

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
    canvasBackground: string,  // 将背景图地址放入style中
    controlPanelListInfo: ControlPanelListType[],  // 右侧浮动菜单列表
    activeElement: ImgElementType | TextComStyleType | {},
    pageCheckedType: PageCheckedType,
    activityPageUrl: string,    // 活动页面
  }
}

// action type
export type ActionType = 'bacColor'    // 画布背景色板cahnge事件action
                       | 'errorInfo'    // 输入错误背景色错误提示事件action
                       | 'bacImgUrl'    // 上传背景色图片事件action
                       | 'floatMenu'    // 右侧浮动菜单change事件action
                       | 'addImgElement'    // 添加图片元素事件
                       | 'activityUrl'    // 添加活动页面

                       // ===========================图片元素action type
                       | 'imgMousedown'    // 图片元素鼠标按下事件action
                       | 'imgMousemove'    // 图片元素鼠标移动事件action
                       | 'imgMouseup'      // 图片元素鼠标弹起事件action
                       | 'deleteImgElement'    // 删除图片元素事件action
                       | 'imgSizeMousedown'    // 图片元素右下角改变图片大小的鼠标按下事件action
                       | 'imgSizeMousemove'    // 图片元素右下角改变图片大小的鼠标移动事件action
                       | 'imgSizeMouseup'      // 图片元素右下角改变图片大小的鼠标弹起事件action
                       | 'imgElementFormRotate'     // 图片元素表单元素值change事件action --- 角度变化
                       | 'imgElementFormIsEdit'     // 图片元素表单元素值change事件action --- 是否可编辑变化
                       | 'imgElementPositionTopLeft'    // 图片元素表单元素值change事件action --- 位置、层级变化
                       | 'imgElementHieghtWidth'    // 图片元素表单元素值change事件action --- 宽高变化
                       | 'pageElementChange'    // 页面选中元素改变 PageCheckedType

                       // ==============================文本元素action type
                       | 'fontFamily'
                       | 'fontSize'
                       | 'textMousedown'    // 改变文本元素位置时鼠标事件
                       | 'textMousemove'
                       | 'textMouseup'
                       | 'textSizeMousedown'    // 改变文本元素大小时鼠标事件
                       | 'textSizeMousemove'
                       | 'textSizeMouseup'
                       | 'textFormTopLeftZIndex'    // 文本元素Top Left ZIndex三个属性表单变化时的action
                       | 'textFormItemChange'   // 文本元素自有属性表单值变化时的action
                       | 'textComFontSizeFontFamily'    // 文本元素字号、字体改变action
                       | 'allowTextComEdited'  // 是否允许文本元素可编辑
                       | 'textComTramsformChange'    // 文本元素旋转角度变化action

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
        ...state
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
          return {
            ...state,
            pageState: {
              ...state.pageState,
              controlPanelListInfo: list
            }
          }
        case 2:  // 撤回一步
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
    case 'addImgElement':
      return {
        ...state
      }
    // 右侧浮动菜单action================================================end

    // 图片元素action================================================begin
    case 'imgMousedown':
      // 获取当前选中元素的clientY、clientX, 元素id
      let event = action.state.event;
      let distanceYDown = event.clientY - action.state.offsetTop;
      let distanceXDown = event.clientX - action.state.offsetLeft;
      let elId = action.state.elId;
      // 获取state中的该元素
      let listImgs = state.pageState.imgsArrayList;
      let thisImgDown = listImgs.filter(val => {
        return elId === val.id;
      })[0];

      listImgs.map(val => {
        if (elId === val.id) {
          val.distanceY = distanceYDown;
          val.distanceX = distanceXDown;
          val.isChecked = true;
        } else {
          val.isChecked = false;
        }
      })
      state.pageState.textArrayList.map(val => {
        val.isChecked = false;
      })

      return {
        ...state,
        pageState: {
          ...state.pageState,
          pageCheckedType: 'image',
          title: '图片属性',
          activeElement: thisImgDown,
          imgsArrayList: [
            ...listImgs
          ]
        }
      };;
    case 'imgMousemove':
      let eventMove = action.state.event;
      // 获取该元素的id
      let elIdMove = action.state.elId;
      // 获取state中的该元素
      let listImgsMove = state.pageState.imgsArrayList;
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
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...listImgsMove
          ]
        }
      };
    case 'imgMouseup':
      // 获取该元素的id
      let elIdUp = action.state.elId;
      // 获取state中的该元素
      let listImgsUp = state.pageState.imgsArrayList;
      let thisImgUp = listImgsUp.filter(val => {
        return elIdUp === val.id;
      })[0];
      thisImgUp.distanceY = 0;
      thisImgUp.distanceX = 0;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...listImgsUp,
          ]
        }
      };
    case 'deleteImgElement':
      let delList = state.pageState.imgsArrayList;
      let dIndex = action.state.index;
      delList.splice(dIndex, 1);

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...delList
          ]
        }
      };
    case 'imgSizeMousedown':
      // 获取当前选中元素的clientY、clientX, 元素id
      let eventSize = action.state.event;
      let elIdSize = action.state.elId;
      // 获取state中的该元素
      let listImgsSize = state.pageState.imgsArrayList;

      let thisImgSize = listImgsSize.filter(val => {
        return elIdSize === val.id;
      })[0];
      listImgsSize.map(val => {
        if (elIdSize === val.id) {
          val.distanceY = eventSize.clientY;
          val.distanceX = eventSize.clientX;
          val.isChecked = true;
        } else {
          val.isChecked = false;
        }
      })
      state.pageState.textArrayList.map(val => {
        val.isChecked = false;
      })

      return {
        ...state,
        pageState: {
          ...state.pageState,
          pageCheckedType: 'image',
          title: '图片属性',
          activeElement: thisImgSize,
          imgsArrayList: [
            ...listImgsSize
          ]
        }
      };
    case 'imgSizeMousemove':
      let eventSizeMove = action.state.event;
      // 获取该元素的id
      let elIdSizeMove = action.state.elId;
      // 获取state中的该元素
      let listImgsSizeMove = state.pageState.imgsArrayList;
      let thisImgSizeMove = listImgsSizeMove.filter(val => {
        return elIdSizeMove === val.id;
      })[0];

      // 鼠标mousedown时记录的位置
      let disYSize = thisImgSizeMove.distanceY;
      let disXSize = thisImgSizeMove.distanceX;
      // 当前图片宽高
      let imgHieght = parseInt(thisImgSizeMove.elementStyles.height);
      let imgWidth = parseInt(thisImgSizeMove.elementStyles.width);
      // 当前鼠标移动时和mousedowen记录的位置 差值
      // Y轴差值
      let diffDisY = eventSizeMove.clientY - disYSize;
      // X轴差值
      let diffDisX = eventSizeMove.clientX - disXSize;
      // console.log(diffDisY, diffDisX)
      // 设置图片大小
      // 图片宽、高 = 旧的宽、高值 - 鼠标移动的距离
      // 将图片以中心视为坐标轴，分四个象限，右下角控制宽高按钮在不同象限设置宽高数据不同
      // 图片旋转的角度
      let rotateDeg: number = parseInt(rotateValueFilter(thisImgSizeMove.outerElementStyles.transform));

      // 获取图片第一在坐标系第一象限x轴临界值角度
      let rotateValue: number = Math.round(Math.atan(imgHieght/imgWidth) / (Math.PI / 180));

      // 在第一象限时 X轴增大，图片高度增大；Y轴增大，图片宽度减小
      if (rotateDeg <= -rotateValue && rotateDeg >= -(90 + rotateValue)) {
        thisImgSizeMove.elementStyles.width = `${imgWidth + (disYSize - eventSizeMove.clientY)}px`;
        thisImgSizeMove.elementStyles.height = `${imgHieght + diffDisX}px`;
      }

      // 在第二象限时 X轴增大，图片宽度增大；Y轴增大，图片高度增大
      if (rotateDeg > -rotateValue && rotateDeg < (90 - rotateValue)) {
        thisImgSizeMove.elementStyles.height = `${imgHieght + diffDisY}px`;
        thisImgSizeMove.elementStyles.width = `${imgWidth + diffDisX}px`;
      }

      // 在第三象限时  Y轴增大，图片宽度增大；X轴增大，图片高度减小
      if (rotateDeg >= (90 - rotateValue) && rotateDeg <= (90 + rotateValue)) {
        thisImgSizeMove.elementStyles.width = `${imgWidth + (eventSizeMove.clientY - disYSize)}px`;
        thisImgSizeMove.elementStyles.height = `${imgHieght + (disXSize - eventSizeMove.clientX)}px`;
      }

      // 在第四象限时  X轴增大，图片宽度减小；Y轴增大，图片高度增大
      if ((rotateDeg > (90 + rotateValue) && rotateDeg <= 180) || (rotateDeg < -(90 + rotateValue) && rotateDeg >= -180)) {
        thisImgSizeMove.elementStyles.height = `${imgHieght + (disYSize - eventSizeMove.clientY)}px`;
        thisImgSizeMove.elementStyles.width = `${imgWidth + (disXSize - eventSizeMove.clientX)}px`;
      }

      // !!! 因为要给高、宽赋值，所以每次计算差值都要从最新的鼠标位置计算，将最新的event事件鼠标的位置重新赋值给dis
      thisImgSizeMove.distanceX = eventSizeMove.clientX;
      thisImgSizeMove.distanceY = eventSizeMove.clientY;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...listImgsSizeMove
          ]
        }
      };
    case 'imgSizeMouseup':
      // 获取该元素的id
      let elIdUpSize = action.state.elId;
      // 获取state中的该元素
      let listImgsUpSize = state.pageState.imgsArrayList;
      let thisImgUpSize = listImgsUpSize.filter(val => {
        return elIdUpSize === val.id;
      })[0];
      // 初始化dis值
      thisImgUpSize.distanceY = 0;
      thisImgUpSize.distanceX = 0;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...listImgsUpSize
          ]
        }
      };
    case 'imgElementFormRotate':
      // 获取state中的该元素 isChecked为true(当触发mousedown事件时，isChecked为true),所以提交的form表单为选中的元素
      let elementList = state.pageState.imgsArrayList;
      let thisElement = elementList.filter(val => {
        return val.isChecked === true;
      })[0];
      thisElement.outerElementStyles = {
        ...thisElement.outerElementStyles,
        ...action.state.imgFormValue
      };

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...elementList
          ]
        }
      };
    case 'imgElementFormIsEdit':
      let elementListIsEdit = state.pageState.imgsArrayList;
      let thisElementIsEdit = elementListIsEdit.filter(val => {
        return val.isChecked === true;
      })[0];
      thisElementIsEdit.isAllowEdit = action.state.isAllowEdit;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...elementListIsEdit
          ]
        }
      };;
    case 'imgElementPositionTopLeft':
      let elementListIsPositonTopLeft = state.pageState.imgsArrayList;
      let thisElementIsPositonTopLeft = elementListIsPositonTopLeft.filter(val => {
        return val.isChecked === true;
      })[0];
      let {
        top,
        left,
        zIndex
      } = action.state.formValue;
      // 页面状态数需要加上px，表单不需要px
      thisElementIsPositonTopLeft.outerElementStyles = {
        ...thisElementIsPositonTopLeft.outerElementStyles,
        ...action.state.formValue,
        top: `${parseInt(top)}px`,
        left: `${parseInt(left)}px`,
      };
      thisElementIsPositonTopLeft.elementStyles = {
        ...thisElementIsPositonTopLeft.elementStyles,
        top: `${parseInt(top) + 20}px`,
        left: `${parseInt(left) + 20}px`,
        zIndex: zIndex
      };

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...elementListIsPositonTopLeft
          ]
        }
      };
    case 'imgElementHieghtWidth':
      let elementListHeightWidth = state.pageState.imgsArrayList;
      let thisElementListHeightWidth = elementListHeightWidth.filter(val => {
        return val.isChecked === true;
      })[0];
      let {
        height,
        width
      } = action.state.formVal;
      // 页面状态数需要加上px，表单不需要px
      thisElementListHeightWidth.elementStyles.height = `${height}px`;
      thisElementListHeightWidth.elementStyles.width = `${width}px`;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...elementListHeightWidth
          ]
        }
      };
    // 点击页面空白处，图片元素和文本元素取消选中状态
    case 'pageElementChange':
      let typeValue = action.state.value;
      let pageChangeListImgs = state.pageState.imgsArrayList;
      let pageChangeListText = state.pageState.textArrayList;
      pageChangeListImgs.map(val => {
        val.isChecked = false;
      })
      pageChangeListText.map(val => {
        val.isChecked = false;
      })

      return {
        ...state,
        pageState: {
          ...state.pageState,
          imgsArrayList: [
            ...pageChangeListImgs
          ],
          textArrayList: [
            ...pageChangeListText
          ],
          pageCheckedType: typeValue,
          title: '画布属性'
        }
      };
    // 图片元素action================================================end

    // 文本元素action==============================================================begin
    case 'textMousedown':
      // 获取当前选中元素的clientY、clientX, 元素id
      let eventText = action.state.event;
      let distanceYTextDown = eventText.clientY - action.state.offsetTop;
      let distanceXTextDown = eventText.clientX - action.state.offsetLeft;
      let elIdText = action.state.id;
      // 获取state中的该元素
      let listText = state.pageState.textArrayList;
      let thisTextDown = listText.filter(val => {
        return elIdText === val.id;
      })[0];
      listText.map(val => {
        if (elIdText === val.id) {
          val.distanceY = distanceYTextDown;
          val.distanceX = distanceXTextDown;
          val.isChecked = true;
        } else {
          val.isChecked = false;
        }
      })
      state.pageState.imgsArrayList.map(val => {
        val.isChecked = false;
      })

      return {
        ...state,
        pageState: {
          ...state.pageState,
          pageCheckedType: 'text',
          title: '文本属性',
          activeElement: thisTextDown,
          textArrayList: [
            ...listText
          ],
        }
      };
    case 'textMousemove':
      let eventTextMove = action.state.event;
      // 获取该元素的id
      let moveTextId = action.state.id;
      // 获取state中的该元素
      let listTextMove = state.pageState.textArrayList;
      let thisTextMove = listTextMove.filter(val => {
        return moveTextId === val.id;
      })[0];
      let disYTextMove = thisTextMove.distanceY;
      let disXTextMove = thisTextMove.distanceX;
      let topTextMove = `${eventTextMove.clientY - disYTextMove}px`;
      let leftTextMove = `${eventTextMove.clientX - disXTextMove}px`;
      // 设置外部容器的top left值
      thisTextMove.textElementOuterType.top = topTextMove;
      thisTextMove.textElementOuterType.left = leftTextMove;
      // 设置图片实际位置，因为外部容器的padding为20，所以加20
      thisTextMove.textElementInnerType.top = `${parseInt(topTextMove) + 20}px`;
      thisTextMove.textElementInnerType.left = `${parseInt(leftTextMove) + 20}px`;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...listTextMove
          ]
        }
      };
    case 'textMouseup':
      let upTextId = action.state.id;
      let listTextUp = state.pageState.textArrayList;
      let thisTextUp = listTextUp.filter(val => {
        return upTextId === val.id;
      })[0];
      thisTextUp.distanceY = 0;
      thisTextUp.distanceX = 0;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...listTextUp
          ]
        }
      };
    case 'textSizeMousedown':
      // 获取当前选中元素的clientY、clientX, 元素id
      let eventTextSize = action.state.event;
      let textSizeId = action.state.id;
      // 获取state中的该元素
      let listTextSize = state.pageState.textArrayList;

      let thisTextSize = listTextSize.filter(val => {
        return textSizeId === val.id;
      })[0];
      listTextSize.map(val => {
        if (textSizeId === val.id) {
          val.distanceY = eventTextSize.clientY;
          val.distanceX = eventTextSize.clientX;
          val.isChecked = true;
        } else {
          val.isChecked = false;
        }
      })
      state.pageState.imgsArrayList.map(val => {
        val.isChecked = false;
      })

      return {
        ...state,
        pageState: {
          ...state.pageState,
          pageCheckedType: 'text',
          title: '文本属性',
          textArrayList: [
            ...listTextSize
          ],
          activeElement: thisTextSize
        }
      };
    case 'textSizeMousemove':
      let eventTextSizeMove = action.state.event;
      // 获取该元素的id
      let textSizeMoveId = action.state.id;
      // 获取state中的该元素
      let listTextSizeMove = state.pageState.textArrayList;
      let thisTextSizeMove = listTextSizeMove.filter(val => {
        return textSizeMoveId === val.id;
      })[0];

      // 鼠标mousedown时记录的位置
      let disYTextSize = thisTextSizeMove.distanceY;
      let disXTextSize = thisTextSizeMove.distanceX;
      // 当前图片宽高
      let textHieght = parseInt(thisTextSizeMove.textElementInnerType.height);
      let textWidth = parseInt(thisTextSizeMove.textElementInnerType.width);
      // 当前鼠标移动时和mousedowen记录的位置 差值
      // Y轴差值
      let diffTextDisY = eventTextSizeMove.clientY - disYTextSize;
      // X轴差值
      let diffTextDisX = eventTextSizeMove.clientX - disXTextSize;
      // console.log(diffDisY, diffDisX)
      // 设置图片大小
      // 图片宽、高 = 旧的宽、高值 - 鼠标移动的距离
      // 将图片以中心视为坐标轴，分四个象限，右下角控制宽高按钮在不同象限设置宽高数据不同
      // 图片旋转的角度
      let rotateDegText: number = parseInt(rotateValueFilter(thisTextSizeMove.textElementOuterType.transform));

      // 获取图片第一在坐标系第一象限x轴临界值角度
      let rotateValueText: number = Math.round(Math.atan(textHieght/textWidth) / (Math.PI / 180));

      // 在第一象限时 X轴增大，图片高度增大；Y轴增大，图片宽度减小
      if (rotateDegText <= -rotateValueText && rotateDegText >= -(90 + rotateValueText)) {
        thisTextSizeMove.textElementInnerType.width = `${textWidth + (disYTextSize - eventTextSizeMove.clientY)}px`;
        thisTextSizeMove.textElementInnerType.height = `${textHieght + diffTextDisX}px`;
      }

      // 在第二象限时 X轴增大，图片宽度增大；Y轴增大，图片高度增大
      if (rotateDegText > -rotateValueText && rotateDegText < (90 - rotateValueText)) {
        thisTextSizeMove.textElementInnerType.height = `${textHieght + diffTextDisY}px`;
        thisTextSizeMove.textElementInnerType.width = `${textWidth + diffTextDisX}px`;
      }

      // 在第三象限时  Y轴增大，图片宽度增大；X轴增大，图片高度减小
      if (rotateDegText >= (90 - rotateValueText) && rotateDegText <= (90 + rotateValueText)) {
        thisTextSizeMove.textElementInnerType.width = `${textWidth + (eventTextSizeMove.clientY - disYTextSize)}px`;
        thisTextSizeMove.textElementInnerType.height = `${textHieght + (disXTextSize - eventTextSizeMove.clientX)}px`;
      }

      // 在第四象限时  X轴增大，图片宽度减小；Y轴增大，图片高度增大
      if ((rotateDegText > (90 + rotateValueText) && rotateDegText <= 180) || (rotateDegText < -(90 + rotateValueText) && rotateDegText >= -180)) {
        thisTextSizeMove.textElementInnerType.height = `${textHieght + (disYTextSize - eventTextSizeMove.clientY)}px`;
        thisTextSizeMove.textElementInnerType.width = `${textWidth + (disXTextSize - eventTextSizeMove.clientX)}px`;
      }

      // !!! 因为要给高、宽赋值，所以每次计算差值都要从最新的鼠标位置计算，将最新的event事件鼠标的位置重新赋值给dis
      thisTextSizeMove.distanceX = eventTextSizeMove.clientX;
      thisTextSizeMove.distanceY = eventTextSizeMove.clientY;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...listTextSizeMove
          ]
        }
      };
    case 'textSizeMouseup':
      let upSizeTextId = action.state.id;
      let listSizeTextUp = state.pageState.textArrayList;
      let thisSizeTextUp = listSizeTextUp.filter(val => {
        return upSizeTextId === val.id;
      })[0];
      thisSizeTextUp.distanceY = 0;
      thisSizeTextUp.distanceX = 0;

      return {
        ...state,
        pageState: {
          ...state.pageState,
          textArrayList: [
            ...listSizeTextUp
          ]
        }
      };
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
      itemChangeEl.textElementInnerType = {
        ...itemChangeEl.textElementInnerType,
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
        formItemChangeEl.textElementInnerType.textAlign = action.state.value;
      } else if ('height' === formItemType || 'width' === formItemType || 'color' === formItemType) {
        formItemChangeEl.textElementInnerType[formItemType] = formItemType === 'color' ? action.state.value : `${action.state.value}px`;
      } else {
        let activeFontStyle = fontStyleImgList.filter(val => {
          return val.type === formItemType;
        })[0];
        // 如果按钮即将设为false，未激活状态，则将样式取消
        activeFontStyle.isChecked = !activeFontStyle.isChecked;
        if ((activeFontStyle.isChecked) === false) {
          switch (formItemType) {
            case 'fontWeight':
              formItemChangeEl.textElementInnerType.fontWeight = 500;
              break;
            case 'textDecoration':
              formItemChangeEl.textElementInnerType.textDecoration = 'none';
              break;
            case 'fontStyle':
              formItemChangeEl.textElementInnerType.fontStyle = '';
              break;
            default:
              break;
          }
        } else {
          formItemChangeEl.textElementInnerType[formItemType] = `${action.state.value}`;
        }
      }
      formItemChangeEl.textElementInnerType = {
        ...formItemChangeEl.textElementInnerType,
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
      fontStyleChangeEl.textElementInnerType[fontStyleType] = action.state.value;

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
            ...transformList,
            transformEl
          ]
        }
      };
    // 文本元素action==============================================================end
    default:
      return state;
  }
}
