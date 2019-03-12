import * as React from 'react';
import './createPoster.less';
import CanvasControlCom from './canvasControlCom';
import { ControlPanelListType, FontStyleImgType } from './poster';
import CanvasControlImgCom, { imgFormValueType, PositionTopLeftType } from './canvasControlImgCom';
import { CanvasPageState, CanvasPageReducer } from './createPosterReducers/createPosterReducers';
import CanvasImgCom from './canvasImgCom';
import CanvasTextCom from './canvasTextCom';
import CanvasControlTextCom from './canvasControlTextCom';

// 控制板右边浮动菜单
const controlPanelListInfo: ControlPanelListType[] = [
  {
    label: '加图片',
    imgUrl: require('./../../static/imgs/add-img.png'),
    isActive: false,
  },
  {
    label: '加文字',
    imgUrl: require('./../../static/imgs/add-text.png'),
    isActive: false,
  },
  {
    label: '撤回',
    imgUrl: require('./../../static/imgs/get-back.png'),
    isActive: false,
  },
  {
    label: '保存',
    imgUrl: require('./../../static/imgs/save.png'),
    isActive: false,
  },
];
// 文本元素下面图片按钮列表
const fontStyleImgList: FontStyleImgType[] = [
  {
    isChecked: false,
    alt: '加粗',
    src: require('./../../static/imgs/overstriking.png'),
    type: 'fontWeight',
    value: 600
  },
  {
    isChecked: false,
    alt: '下划线',
    src: require('./../../static/imgs/underline.png'),
    type: 'textDecoration',
    value: 'underline'
  },
  {
    isChecked: false,
    alt: '斜体',
    src: require('./../../static/imgs/italic.png'),
    type: 'fontStyle',
    value: 'italic'
  },
  {
    isChecked: true,
    alt: '居左',
    src: require('./../../static/imgs/text-algin-left.png'),
    type: 'textAlign',
    value: 'left'
  },
  {
    isChecked: false,
    alt: '居中',
    src: require('./../../static/imgs/text-algin-center.png'),
    type: 'textAlign',
    value: 'center'
  },
  {
    isChecked: false,
    alt: '居右',
    src: require('./../../static/imgs/text-algin-right.png'),
    type: 'textAlign',
    value: 'right'
  },
];

// 页面初始状态
export const pageInitState: CanvasPageState = {
  pageStepState: [],  // 存储页面每次修改的状态(不包括和画布无关的操作状态)
  imgsArrayList: [  // 储存画布图片元素数组
    {
      elementType: 'image',
      id: 'image1234',
      isChecked: false,
      imgUrl: require('./../../static/imgs/login-inner.png'),
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
    },
    // {
    //   elementType: 'image',
    //   id: 'image125534',
    //   isChecked: false,
    //   imgUrl: require('./../../static/imgs/login-inner.png'),
    //   elementStyles: {
    //     height: '100px',
    //     width: '60px',
    //     top: '70px',
    //     left: '56px',
    //     zIndex: 1
    //   },
    //   outerElementStyles: {
    //     top: '50px',
    //     left: '36px',
    //     zIndex: 1,
    //     transform: 'rotate(0)',
    //   },
    //   isAllowEdit: false,
    //   distanceY: 0,
    //   distanceX: 0
    // }
  ],
  textArrayList: [
    {
      textElementOuterType: {
        transform: 'rotate(0)',
        top: '270px',
        left: '55px',
        zIndex: 1,
      },
      textElementInnerType: {
        fontFamily: '',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        fontStyle: '',
        textAlign: 'left',
        top: '290px',
        left: '75px',
        height: '21px',
        width: '300px',
        zIndex: 1,
      },
      content: '666阿斯达大神大神大神大神',
      isChecked: false,
      elementType: 'text',
      id: 'text123',
      isAllowEdit: false,
      distanceY: 0,
      distanceX: 0,
      fontStyleImgList: fontStyleImgList
    }
  ],
  title: '画布属性',
  canvasBacColor: '#ffffff',
  canvasBacInputValue: '#ffffff',
  errorInfo: '',
  canvasBacImgUrl: '',
  canvasBackground: `url('') no-repeat center #fff`,
  controlPanelListInfo: controlPanelListInfo,
  activeElement: {},
  pageCheckedType: 'none'
};

export default () => {

  const [state, dispatch] = React.useReducer(
    CanvasPageReducer,
    pageInitState
  );

  function addImgCom(e:any) {
    let file = e.target.files[0];
    let fileType = file.type.split('/')[1];
    let fileSize = file.size;
    // 判断图片类型、大小是否合规
    if (fileType !== 'jpg' && fileType !== 'jpeg' && fileType !== 'png') return;
    if (fileSize > 2097152) return;
    // 全部符合则上传图片至服务器，获取图片地址，生成图片元素
    let formData = new FormData();
    formData.append('file', file);
    dispatch({type: 'floatMenu', state: {floatMenu: 0, imgUrl: require('./../../static/imgs/login-inner.png')}})
  }

  React.useEffect(() => {
    let dom = document.querySelector('#createPoster') as HTMLElement;
    dom.addEventListener('click', pageEventListener, false)

    return () => {
      dom.removeEventListener('click', pageEventListener, false);
    }
  }, []);

  // 监听页面激活元素类型，显示不同属性面板，当点击空白处显示none，画布的控制面板
  function pageEventListener() {
    let el = event!.target as HTMLElement;
    if (el.classList.contains('create-poster-left') || el.classList.contains('poster-canvas')) {
      dispatch({ type: 'pageElementChange', state: {value: 'none'} });
    }
  }

  return (
    <div className='create-poster' id='createPoster'>
      <div className='create-poster-left'>
        {/* 左侧画板 */}
        <div
          className='poster-canvas'
          style={{background: state.canvasBackground}}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 图片元素属性控制面板 */}
          <CanvasImgCom
            imgsArrayList={state.imgsArrayList}
            onImgMousedown={(e, id, offsetTop, offsetLeft) => 
                            dispatch({      // 组件向action中传入event、当前选中元素id、元素本身的offsetTop offsetLeft值
                              type: 'imgMousedown', 
                              state: {
                                event: e, 
                                elId: id, 
                                offsetTop: offsetTop, 
                                offsetLeft: offsetLeft
                              }}
                            )}
            onImgMousemove={(e, id) => dispatch({type: 'imgMousemove', state: {event: e, elId: id}})}
            onImgMouseup={(e, id) => dispatch({type: 'imgMouseup', state: {event: e, elId: id}})}
            onDeleteImgClick={(i) => dispatch({type: 'deleteImgElement', state: {index: i}})}
            onImgSizeMousedown={(e, id, offsetTop, offsetLeft) =>
                                  dispatch({
                                    type: 'imgSizeMousedown',
                                    state: {
                                      event: e,
                                      elId: id,
                                      offsetTop: offsetTop,
                                      offsetLeft: offsetLeft}
                                  })
                                }
            onImgSizeMousemove={(e, id) => dispatch({type: 'imgSizeMousemove', state: {event: e, elId: id}})}
            onImgSizeMouseup={(e, id) => dispatch({type: 'imgSizeMouseup', state: {event: e, elId: id}})} 
          />

          {/* 文本元素 */}
          <CanvasTextCom
            textArrayList={state.textArrayList}
            onTextComMousedown={(e, id, offsetTop, offsetLeft) => dispatch({type: 'textMousedown', state: {event: e, id: id, offsetTop: offsetTop, offsetLeft: offsetLeft}})}
            onTextComMousemove={(e, id) => dispatch({type: 'textMousemove', state: {event: e, id: id}})}
            onTextComMouseup={(e, id) => dispatch({type: 'textMouseup', state: {event: e, id: id}})}
            onTextComSizeMousedown={(e, id) => dispatch({type: 'textSizeMousedown', state: {event: e, id: id}})}
            onTextComSizeMousemove={(e, id) => dispatch({type: 'textSizeMousemove', state: {event: e, id: id}})}
            onTextComSizeMouseup={(e, id) => dispatch({type: 'textSizeMouseup', state: {event: e, id: id}})}
          />
        </div>
      </div>

      {/* 右侧控制面板 contorl panel */}
      <div className='create-poster-right'>

        {/* 操作浮动面板 */}
        <div className='contorl-panel-right-float'>
          <div
            className={state.controlPanelListInfo[0].isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
            
          >
            <img src={state.controlPanelListInfo[0].imgUrl} />
            <span>{state.controlPanelListInfo[0].label}</span>
            <input
              type='file'
              className='add-img-com'
              onChange={(e) => addImgCom(e)}
            />
          </div>
          <p className='nav'></p>
          <div
            className={state.controlPanelListInfo[1].isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
            onClick={() => dispatch({type: 'floatMenu', state: {floatMenu: 1}})}
          >
            <img src={state.controlPanelListInfo[1].imgUrl} />
            <span>{state.controlPanelListInfo[1].label}</span>
          </div>
          <p className='nav'></p>
          <div
            className={state.controlPanelListInfo[2].isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
            onClick={() => dispatch({type: 'floatMenu', state: {floatMenu: 2}})}
          >
            <img src={state.controlPanelListInfo[2].imgUrl} />
            <span>{state.controlPanelListInfo[2].label}</span>
          </div>
          <p className='nav'></p>
          <div
            className={state.controlPanelListInfo[3].isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
            onClick={() => dispatch({type: 'floatMenu', state: {floatMenu: 3}})}
          >
            <img src={state.controlPanelListInfo[3].imgUrl} />
            <span>{state.controlPanelListInfo[3].label}</span>
          </div>
        </div>

        {/* 画布title */}
        <p className='contorl-panel-title'>{state.title}</p>

        {/* 画布基本元素各项选择控件 */}
        <div className='contorl-panel-items'>

          {/* 画布属性控制面板 */}
          {
            state.pageCheckedType === 'none' ?
              <CanvasControlCom
                color={state.canvasBacColor}
                colorValue={state.canvasBacInputValue}
                errorInfo={state.errorInfo}
                // state 传入改变后的颜色值
                onColorChange={(val: string) => dispatch({type: 'bacColor', state: {bacColor: val}})}
                // state 传入改变后的颜色值
                onColorValueChange={(val: string) => dispatch({type: 'bacColorValue', state: {bacColorValue: val}})}
                // state 传入错误提示info
                onErrorInfoChange={(val: string) => dispatch({type: 'errorInfo', state: {errorInfo: val}})}
              /> : null
          }

          {/* 图片元素控制面板 */}
          {
            state.pageCheckedType === 'image' ?
              <CanvasControlImgCom
                activeImgObject={state.activeElement}
                onImgElementFormRotateChange={(val: imgFormValueType) => dispatch({
                  type: 'imgElementFormRotate',
                  state: {
                    imgFormValue: val
                  }
                })}
                onImgElementFormIsEditChange={(val: boolean) => dispatch({
                  type: 'imgElementFormIsEdit',
                  state: {
                    isAllowEdit: val
                  }
                })}
                onImgElementPositionTopLeftChange={(val: PositionTopLeftType) => dispatch({
                  type: 'imgElementPositionTopLeft',
                  state: {
                    formValue: val
                  }
                })}
                onImgElementHieghtWidthChange={(val: any) => dispatch({
                  type: 'imgElementHieghtWidth',
                  state: {
                    formVal: {
                      ...val
                    }
                  }
                })}
              /> : null
          }
          {
            state.pageCheckedType === 'text' ?
              <CanvasControlTextCom
                activeElement={state.activeElement}
                onTopLeftZIndexChange={val => dispatch({type: 'textFormTopLeftZIndex', state: {val: val}})}
                onTextComFormItemChange={(val, type, value) => dispatch({type: 'textFormItemChange', state: {val: val, type: type, value: value}})}
              /> : null
          }
        </div>
      </div>
    </div>
  )
}
