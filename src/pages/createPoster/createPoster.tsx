import * as React from 'react';
import './createPoster.less';
import CanvasControlCom from './canvasControlCom';
import { ControlPanelListType } from './poster';
import { CanvasPageState, CanvasPageReducer } from './createPosterReducers/createPosterReducers';
import CanvasImgCom from './canvasImgCom';


// 控制板右边浮动菜单
const controlPanelListInfo: ControlPanelListType[] = [
  {
    label: '加图片',
    imgUrl: require('./../../static/imgs/add-img.png'),
    isActive: false,
  },
  {
    label: '加文字',
    imgUrl: require('./../../static/imgs/add-img.png'),
    isActive: false,
  },
  {
    label: '撤回',
    imgUrl: require('./../../static/imgs/add-img.png'),
    isActive: false,
  },
  {
    label: '保存',
    imgUrl: require('./../../static/imgs/add-img.png'),
    isActive: false,
  },
];

// 页面初始状态
const pageInitState: CanvasPageState = {
  pageStepState: [],  // 存储页面每次修改的状态(不包括和画布无关的操作状态)
  imgsArrayList: [  // 储存画布图片元素数组
    {
      elementType: 'image',
      id: 'image1234',
      isChecked: false,
      imgUrl: require('./../../static/imgs/login-inner.png'),
      elementStyles: {
        height: '150px',
        width: '300px',
        top: '0',
        left: '0',
        transform: 'rotate(0)',
        zIndex: 1
      },
      outerElementStyles: {
        top: '272px',
        left: '36px'
      },
      isAllowEdit: false
    }
  ],
  title: '画布属性',
  canvasBacColor: '#ffffff',
  canvasBacInputValue: '#ffffff',
  errorInfo: '',
  canvasBacImgUrl: '',
  canvasBackground: `url('') no-repeat center #fff`,
  controlPanelListInfo: controlPanelListInfo
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

  return (
    <div className='create-poster'>
      <div className='create-poster-left'>
        {/* 左侧画板 */}
        <div className='poster-canvas' style={{background: state.canvasBackground}}>
          {/* 图片元素属性控制面板 */}
          <CanvasImgCom
            imgsArrayList={state.imgsArrayList}
            onImgMousedown={(e) => dispatch({type: 'imgMousedown', state: {event: e}})}
            onImgMousemove={(e) => dispatch({type: 'imgMousemove', state: {event: e}})}
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
          {/* // {state.controlPanelListInfo.map((val, i) =>
          //   <>
          //     <div
          //       className={val.isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
          //       key={`${val.label}_${i}`}
          //       // state传入点击的菜单脚标i值
          //       onClick={() => dispatch({type: 'floatMenu', state: {floatMenu: i}})}
          //     >
          //       <img src={val.imgUrl} />
          //       <span>{val.label}</span>
          //     </div>
          //     {
          //       i >= state.controlPanelListInfo.length - 1 ? null : <p className='nav' key={i}></p>
          //     }
          //   </>
          // )} */}
        </div>

        {/* 画布title */}
        <p className='contorl-panel-title'>{state.title}</p>

        {/* 画布元素各项选择控件 */}
        <div className='contorl-panel-items'>
          {/* 画布属性控制面板 */}
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
          />
          
        </div>
      </div>
    </div>
  )
}
