import * as React from 'react';
import './createPoster.less';
import CanvasControlCom from './canvasControlCom';
import { ControlPanelListType, ImgElementType, TextComStyleType } from './poster';
import CanvasControlImgCom from './canvasControlImgCom';
import { CanvasPageState, CanvasPageReducer } from './createPosterReducers/createPosterReducers';
// import CanvasImgCom from './canvasImgCom';
// import CanvasTextCom from './canvasTextCom';
import CanvasControlTextCom from './canvasControlTextCom';
import { rotateValueFilter } from './../../static/ts/tools';
import Loading from './../../components/loading/loading';
import doService from './../../static/ts/axios';
import { ActivityData } from './../activityManagement/activityReducer/activityReducer';
import Message from './../../components/message/message';
import ImageElementComponent from './imageElementComponent/imageElementComponent';
import TextElementComponent from './textElementComponent/textElementComponent';

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
    label: '预览',
    imgUrl: require('./../../static/imgs/get-back.png'),
    isActive: false,
  },
  {
    label: '保存',
    imgUrl: require('./../../static/imgs/save.png'),
    isActive: false,
  },
];

// 页面初始状态
export const pageInitState: CanvasPageState = {
  pageStepState: [],
  pageState: {
    imgsArrayList: [],  // 储存画布图片元素数组
    textArrayList: [],
    title: '画布属性',
    canvasBacInputValue: '#ffffff',
    errorInfo: '',
    canvasBacImgUrl: '',
    canvasBackground: `url('') no-repeat center #fff`,
    controlPanelListInfo: controlPanelListInfo,
    activeElement: {},
    pageCheckedType: 'none',
    activityPageUrl: ''
  },
  isLoading: false,
  activityTypeId: ''
};

export default () => {

  const [state, dispatch] = React.useReducer(
    CanvasPageReducer,
    pageInitState
  );

  function addImgCom(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files![0];
    let fileType = file.type.split('/')[1];
    let fileSize = file.size;
    // 判断图片类型、大小是否合规
    if (fileType !== 'jpg' && fileType !== 'jpeg' && fileType !== 'png') return;
    if (fileSize > 2097152) return;
    // 全部符合则上传图片至服务器，获取图片地址，生成图片元素
    let formData = new FormData();
    formData.append('file', file);
    dispatch({ type: 'request_start' });

    doService('/v1/file/upload', 'POST', formData).then(res => {
      if (res.code === 200) {
        dispatch({type: 'floatMenu', state: {floatMenu: 0, imgUrl: res.values}});
      } else {
        setMessage({isMessage: true, messageInfo: res.description});
      }
      dispatch({ type: 'request_end' });
    });
    
  }

  React.useEffect(() => {
    let dom = document.querySelector('#createPoster') as HTMLElement;
    dom.addEventListener('click', pageEventListener, false);
    getActivityList();
    return () => {
      dom.removeEventListener('click', pageEventListener, false);
    }
  }, []);

  // 监听页面激活元素类型，显示不同属性面板，当点击空白处显示none，画布的控制面板
  function pageEventListener() {
    let el = event!.target as HTMLElement;
    if (el.classList.contains('create-poster-left') || el.classList.contains('poster-canvas')) {
      dispatch({ type: 'page_element_change', state: {value: 'none'} });
      dispatch({type: 'errorInfo', state: {errorInfo: ''}})
    }
  }

  // 获取活动类型
  const [activityList, setActivityList] = React.useState<ActivityData[]>([]);

  function getActivityList() {
    dispatch({ type: 'request_start' });
    doService('/v1/postertype/list', 'POST', {}).then(res => {
      if (res.code === 200) {
        let list: ActivityData[] = res.values.content;
        setActivityList(list);
        dispatch({ type: 'request_end' });
      } else {
        dispatch({ type: 'request_end' });
      }
    });
  }

  // 撤回操作点击事件
  // function onGoBackClick() {
  //   console.log(state.pageStepState)
  //   if (state.pageStepState.length <= 1) {
  //     dispatch({type: 'errorInfo', state: {errorInfo: '已经到底啦~'}});
  //     return;
  //   }
  //   dispatch({type: 'floatMenu', state: {floatMenu: 2}});
  // }

  // draw the elements whitch rendered in class'poster-canvas' dom to the canvas
  function drawElement() {
    let canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    let context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.clearRect(0, 0, canvas.width, canvas.height);
    let data = state.pageState;
    context.globalCompositeOperation = 'destination-over';
    // 获取排序后的图片元素数组，zIndex越大越靠前，利用 destination-over属性，后渲染的元素在原元素底下渲染
    // 第一个选然层级比较高的元素
    let imageElementsList = sort(data.imgsArrayList);
    let textElementsList = data.textArrayList;
    drawImage(context, imageElementsList);
    drawText(context, textElementsList);
    // 作为背景图，最后再渲染
    drawBackgroundImage(context, state.pageState.canvasBacImgUrl, canvas);
  }

  function sort(arr: ImgElementType[]): ImgElementType[] {
    for(let x = 0; x < arr.length; x ++) {
      for(let y = 0; y < arr.length - 1 - x; y++) {
        if (parseInt(`${arr[y].elementStyles.zIndex}`) < parseInt(`${arr[y+1].elementStyles.zIndex}`)) {
          [arr[y], arr[y+1]] = [arr[y+1], arr[y]];
        }
      }
    }
    return arr;
  }

  function drawBackgroundImage(context: CanvasRenderingContext2D, imgUrl: string, canvas: HTMLCanvasElement) {
    let bacImg = new Image();
    bacImg.setAttribute('crossOrigin', 'anonymous');
    bacImg.onload = function() {
      context.drawImage(bacImg, 0, 0, canvas.width, canvas.height);
    }
    bacImg.src = imgUrl;
  }

  function drawImage(context: CanvasRenderingContext2D, imgsList: ImgElementType[]) {
    if (imgsList.length > 0) {
      imgsList.map(val => {
        let img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function() {
          // 获取图片元素宽、高、left、top值
          let elementHeight = parseInt(val.elementStyles.height);
          let elementWidth = parseInt(val.elementStyles.width);
          let elementLeft = parseInt(val.elementStyles.left);
          let elementTop = parseInt(val.elementStyles.top);
          // 当有元素需要旋转时，并且以元素中心为旋转点时，需要将canvas坐标系0，0点移动到旋转元素中心上
          // 围绕图片中心旋转 计算公式：( 图片宽度 / 2 [+ 图片x轴坐标], 图片高度 / 2 [+ 图片y轴坐标] )
  
          // 设置画布旋转中心，设置为将要画的图片的中心
          context.translate(elementWidth / 2 + elementLeft, elementHeight / 2 + elementTop);
  
          // 将画布旋转，角度为：图片的角度 * Math.PI / 180
          context.rotate(parseInt(rotateValueFilter(val.outerElementStyles.transform)) * Math.PI / 180);
  
          // 将canvas坐标系0, 0点恢复
          context.translate(-1 * ((elementWidth / 2) + elementLeft), -1 * ((elementHeight / 2) + elementTop));
          // 向画布画元素
          context.drawImage(img, elementLeft,elementTop,elementWidth,elementHeight);
  
          // 重置当前坐标系
          context.setTransform(1, 0, 0, 1, 0, 0);
        };
        img.src = val.imgUrl;
      });
    }
  }

  function drawText(context: CanvasRenderingContext2D, textList: TextComStyleType[]) {
    if (textList.length > 0) {
      textList.map(val => {
        let elementContent = val.content;
        let elementWidth = parseInt(val.elementStyles.width);
        let elementContentItems = elementContent.split('');
        // 不加16画出来的位置有偏移
        let elementTop = parseInt(val.elementStyles.top) + 20;
        let elementLeft = parseInt(val.elementStyles.left);
        // 设置此文本元素样式
        context.font = (`${val.elementStyles.fontSize} ${val.elementStyles.fontFamily}`);
        context.fillStyle = val.elementStyles.color;
  
        // 文本元素旋转渲染
        context.translate(elementWidth / 2 + elementLeft, parseInt(val.elementStyles.fontSize) / 2 + elementTop);
        context.rotate(parseInt(rotateValueFilter(val.textElementOuterType.transform)) * Math.PI / 180);
        context.translate(-1 * ((elementWidth / 2) + elementLeft), -1 * ((parseInt(val.elementStyles.fontSize) / 2) + elementTop));
  
        // 文本换行：将要画的文本一个一个画出来，计算每个文本占用的宽度，当一行的宽度大于文本区域宽度时换行
        // measureText api获取每个文本的宽度
        let line = '';
        for (let n = 0; n < elementContentItems.length; n++) {
          let oneLineitems = line + elementContentItems[n];
          let metrics = context.measureText(oneLineitems);
          let testWidth = metrics.width;
          if (testWidth > elementWidth && n > 0) {
            
            context.fillText(line, elementLeft, elementTop);
            // 需要加lineheight属性画出来的位置有偏移
            // 字体不一样lineheight没法计算
            elementTop = elementTop + (parseInt(val.elementStyles.fontSize) * 1.2);
            line = elementContentItems[n];
          } else {
            line = oneLineitems;
          }
        }
        context.fillText(line, elementLeft, elementTop);
        context.setTransform(1, 0, 0, 1, 0, 0);
      });
    }
  }

  // 将canvas转换成base64图片并下载
  function convertCanvasToImage(canvas: HTMLCanvasElement) {
    let code: string = canvas.toDataURL('image/png');
    let arr = code.split(';base64,');
    // 取到图片类型
    let contentType = arr[0].split(':')[1];
    // 将图片的base64解码；base64编码方法：btoa()
    let raw = window.atob(arr[1]);
    let rawLength = raw.length;
    let uInt8Array = new Uint8Array(rawLength);
    for(let x = 0; x < rawLength; x++) {
      // charCodeAt 将x位置的数据转换成Unicode编码格式
      uInt8Array[x] = raw.charCodeAt(x);
    }

    let blob = new Blob([uInt8Array], {type: contentType});
    
    let aLink = document.createElement('a');
    let aEvt = document.createEvent('HTMLEvents');
    aEvt.initEvent('click', true, false);
    aLink.download = '测试.png';
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
  }

  // 获取像素比
  // var getPixelRatio = function (context: any) {
  //   var backingStore = context.backingStorePixelRatio ||
  //       context.webkitBackingStorePixelRatio ||
  //       context.mozBackingStorePixelRatio ||
  //       context.msBackingStorePixelRatio ||
  //       context.oBackingStorePixelRatio ||
  //       context.backingStorePixelRatio || 1;
  //   return (window.devicePixelRatio || 1) / backingStore;
  // };

  // on message
  const [onMessage, setMessage] = React.useState({isMessage: false, messageInfo: ''});

  function onMessageOpenOrClose() {
    setMessage({isMessage: false, messageInfo: ''});
  }

  return (
    <div className='create-poster' id='createPoster'>
      <div className='create-poster-left'>
        {/* 左侧画板 */}
        <canvas id='canvas' className='canvas' height='736' width='414'></canvas>
        <div className='poster-canvas-outer'>
          <div
            className='poster-canvas'
            style={{background: state.pageState.canvasBackground}}
            onClick={(e) => e.stopPropagation()}
          >

          {/* image element component */}
          {
            state.pageState.imgsArrayList.length > 0 ?
              state.pageState.imgsArrayList.map((val, i) =>
                <ImageElementComponent
                  imageElement={val}
                  dispatch={dispatch}
                  index={i}
                />
              ) : null
          }

          {/* text component */}
          {
            state.pageState.textArrayList.length > 0 ?
              state.pageState.textArrayList.map((val, i) =>
                <TextElementComponent
                textElement={val}
                dispatch={dispatch}
                index={i}
                />
              ) : null
          }

            {/* <CanvasTextCom
              textArrayList={state.pageState.textArrayList}
              onTextComMousedown={(e, id, offsetTop, offsetLeft) => dispatch({type: 'textMousedown', state: {event: e, id: id, offsetTop: offsetTop, offsetLeft: offsetLeft}})}
              onTextComMousemove={(e, id) => dispatch({type: 'textMousemove', state: {event: e, id: id}})}
              onTextComMouseup={(e, id) => dispatch({type: 'textMouseup', state: {event: e, id: id}})}
              onTextComSizeMousedown={(e, id) => dispatch({type: 'textSizeMousedown', state: {event: e, id: id}})}
              onTextComSizeMousemove={(e, id) => dispatch({type: 'textSizeMousemove', state: {event: e, id: id}})}
              onTextComSizeMouseup={(e, id) => dispatch({type: 'textSizeMouseup', state: {event: e, id: id}})}
              onTextComDeleteImgClick={index => dispatch({type: 'deleteTextElement', state: {index: index}})}
            /> */}
          </div>
        </div>
      </div>

      {/* 右侧控制面板 contorl panel */}
      <div className='create-poster-right'>

        {/* 操作浮动面板 */}
        <div className='contorl-panel-right-float'>
          <div
            className={state.pageState.controlPanelListInfo[0].isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
            
          >
            <img src={state.pageState.controlPanelListInfo[0].imgUrl} />
            <span>{state.pageState.controlPanelListInfo[0].label}</span>
            <input
              type='file'
              className='add-img-com'
              onChange={(e) => addImgCom(e)}
            />
          </div>
          <p className='nav'></p>
          <div
            className={state.pageState.controlPanelListInfo[1].isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
            onClick={() => dispatch({type: 'floatMenu', state: {floatMenu: 1}})}
          >
            <img src={state.pageState.controlPanelListInfo[1].imgUrl} />
            <span>{state.pageState.controlPanelListInfo[1].label}</span>
          </div>
          <p className='nav'></p>
          <div
            className={state.pageState.controlPanelListInfo[2].isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
            onClick={drawElement}
          >
            <img src={state.pageState.controlPanelListInfo[2].imgUrl} />
            <span>{state.pageState.controlPanelListInfo[2].label}</span>
          </div>
          <p className='nav'></p>
          <div
            className={state.pageState.controlPanelListInfo[3].isActive ? 'contorl-item contorl-item-active' : 'contorl-item'}
            onClick={() => convertCanvasToImage(document.querySelector('#canvas') as HTMLCanvasElement)}
          >
            <img src={state.pageState.controlPanelListInfo[3].imgUrl} />
            <span>{state.pageState.controlPanelListInfo[3].label}</span>
          </div>
        </div>

        {/* 画布title */}
        <p className='contorl-panel-title'>{state.pageState.title}</p>

        {/* 画布基本元素各项选择控件 */}
        <div className='contorl-panel-items'>

          {/* 画布属性控制面板 */}
          {
            state.pageState.pageCheckedType === 'none' ?
              <CanvasControlCom
                dispatch={dispatch}
                pageState={state}
                activityList={activityList}
                colorValue={state.pageState.canvasBacInputValue}
                errorInfo={state.pageState.errorInfo}
                // state 传入改变后的颜色值
                onColorChange={(val: string) => dispatch({type: 'bacColor', state: {bacColor: val}})}
                // state 传入错误提示info
                onErrorInfoChange={(val: string) => dispatch({type: 'errorInfo', state: {errorInfo: val}})}
                onActivityUrlChange={(v) => dispatch({type: 'activityUrl', state: {val: v}})}
              /> : null
          }

          {/* 图片元素控制面板 */}
          {
            state.pageState.pageCheckedType === 'image' ?
              <CanvasControlImgCom
              dispatch={dispatch}
              activeImageElement={state.pageState.activeElement as ImgElementType}
                // pageState={state}
                // activeImgObject={state.pageState.activeElement}
                // onImgElementFormRotateChange={(val: imgFormValueType) => dispatch({
                //   type: 'imgElementFormRotate',
                //   state: {
                //     imgFormValue: val
                //   }
                // })}
                // onImgElementFormIsEditChange={(val: boolean) => dispatch({
                //   type: 'imgElementFormIsEdit',
                //   state: {
                //     isAllowEdit: val
                //   }
                // })}
                // onImgElementPositionTopLeftChange={(val: PositionTopLeftType, activityElId: string) => dispatch({
                //   type: 'imgElementPositionTopLeft',
                //   state: {
                //     formValue: val,
                //     activityElId: activityElId
                //   }
                // })}
                // onImgElementHieghtWidthChange={(val: any) => dispatch({
                //   type: 'imgElementHieghtWidth',
                //   state: {
                //     formVal: {
                //       ...val
                //     }
                //   }
                // })}
              /> : null
          }
          {
            state.pageState.pageCheckedType === 'text' ? 
              <CanvasControlTextCom
                activeElement={state.pageState.activeElement}
                onTopLeftZIndexChange={val => dispatch({type: 'textFormTopLeftZIndex', state: {val: val}})}
                onTextComFormItemChange={(type, value) => dispatch({type: 'textFormItemChange', state: {type: type, value: value}})}
                onFontSizeFontFamilyChange={(type, value) => dispatch({type: 'textComFontSizeFontFamily', state: {type: type, value: value}})}
                onAllowEditedChange={() => dispatch({type: 'allowTextComEdited'})}
                onTransformChange={(type, value) => dispatch({type: 'textComTramsformChange', state: {type: type, value: value}})}
                onContentChange={(value) => dispatch({type: 'textComContentChage', state: {content: value}})}
              /> : null
          }
        </div>
      </div>
      {
        state.isLoading ? <Loading /> : null
      }
      <Message
        isOpen={onMessage.isMessage}
        children={onMessage.messageInfo}
        onMessageOpenOrClose={onMessageOpenOrClose}
      />
    </div>
  )
}
