import * as React from 'react';
import './createPoster.less';
import CanvasControlCom from './canvasControlCom';
import { ControlPanelListType, FontStyleImgType, ImgElementType, TextComStyleType } from './poster';
import CanvasControlImgCom, { imgFormValueType, PositionTopLeftType } from './canvasControlImgCom';
import { CanvasPageState, CanvasPageReducer } from './createPosterReducers/createPosterReducers';
import CanvasImgCom from './canvasImgCom';
import CanvasTextCom from './canvasTextCom';
import CanvasControlTextCom from './canvasControlTextCom';
import { rotateValueFilter } from './../../static/ts/tools';

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
  pageStepState: [],
  pageState: {
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
      {
        elementType: 'image',
        id: 'image125534',
        isChecked: false,
        imgUrl: require('./../../static/imgs/login-inner.png'),
        elementStyles: {
          height: '100px',
          width: '60px',
          top: '70px',
          left: '56px',
          zIndex: 8
        },
        outerElementStyles: {
          top: '50px',
          left: '36px',
          zIndex: 8,
          transform: 'rotate(0)',
        },
        isAllowEdit: false,
        distanceY: 0,
        distanceX: 0
      }
    ],
    textArrayList: [
      {
        textElementOuterType: {
          transform: 'rotate(0)',
          top: '270px',
          left: '55px',
          zIndex: 1,
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
        content: '阿自行车自行车可获得卡啥端口啊哈萨克大神空间的卡速度快奥斯卡的卡视角看',
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
    canvasBacInputValue: '#ffffff',
    errorInfo: '',
    canvasBacImgUrl: require('./../../static/imgs/login-bac.jpg'),
    canvasBackground: `url('') no-repeat center #fff`,
    controlPanelListInfo: controlPanelListInfo,
    activeElement: {},
    pageCheckedType: 'none',
    activityPageUrl: ''
  }
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
    dom.addEventListener('click', pageEventListener, false);
    return () => {
      dom.removeEventListener('click', pageEventListener, false);
    }
  }, []);

  // 监听页面激活元素类型，显示不同属性面板，当点击空白处显示none，画布的控制面板
  function pageEventListener() {
    let el = event!.target as HTMLElement;
    if (el.classList.contains('create-poster-left') || el.classList.contains('poster-canvas')) {
      dispatch({ type: 'pageElementChange', state: {value: 'none'} });
      dispatch({type: 'errorInfo', state: {errorInfo: ''}})
    }
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
    let ratio = getPixelRatio(context);
    console.log(ratio);
    console.log(window.getComputedStyle(canvas).lineHeight)
    let data = state.pageState;
    // let canvasBackground = data.canvasBacInputValue;
    // let canvasBackGroundImageUrl = data.canvasBacImgUrl;
    context.globalCompositeOperation = 'destination-over';
    // 获取排序后的图片元素数组，zIndex越大越靠前，利用 destination-over属性，后渲染的元素在原元素底下渲染
    // 第一个选然层级比较高的元素
    let imageElementsList = sort(data.imgsArrayList);
    let textElementsList = data.textArrayList;
    drawText(context, textElementsList);
    drawImage(context, imageElementsList);
  }

  function sort(arr: ImgElementType[]): ImgElementType[] {
    for(let x = 0; x < arr.length; x ++) {
      for(let y = 0; y < arr.length - 1 - x; y++) {
        if (parseInt(`${arr[y].elementStyles.zIndex}`) < parseInt(`${arr[y+1].elementStyles.zIndex}`)) {
          let temp = arr[y].elementStyles.zIndex;
          arr[y].elementStyles.zIndex = arr[y+1].elementStyles.zIndex;
          arr[y+1].elementStyles.zIndex = temp;
        }
      }
    }
    return arr;
  }

  function drawImage(context: CanvasRenderingContext2D, imgsList: ImgElementType[]) {
    
    imgsList.map(val => {
      let img = new Image();
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

  function drawText(context: CanvasRenderingContext2D, textList: TextComStyleType[]) {
    textList.map(val => {
      let elementContent = val.content;
      let elementWidth = parseInt(val.elementStyles.width);
      let elementContentItems = elementContent.split('');
      // 不加16画出来的位置有偏移
      let elementTop = parseInt(val.elementStyles.top) + 13;
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
          elementTop = elementTop + (parseInt(val.elementStyles.fontSize) * 1.3);
          line = elementContentItems[n];
        } else {
          line = oneLineitems;
        }
      }
      context.fillText(line, elementLeft, elementTop);
      context.setTransform(1, 0, 0, 1, 0, 0);
    });
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
  var getPixelRatio = function (context: any) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  };

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
            {/* image component */}
            <CanvasImgCom
              imgsArrayList={state.pageState.imgsArrayList}
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

            {/* text component */}
            <CanvasTextCom
              textArrayList={state.pageState.textArrayList}
              onTextComMousedown={(e, id, offsetTop, offsetLeft) => dispatch({type: 'textMousedown', state: {event: e, id: id, offsetTop: offsetTop, offsetLeft: offsetLeft}})}
              onTextComMousemove={(e, id) => dispatch({type: 'textMousemove', state: {event: e, id: id}})}
              onTextComMouseup={(e, id) => dispatch({type: 'textMouseup', state: {event: e, id: id}})}
              onTextComSizeMousedown={(e, id) => dispatch({type: 'textSizeMousedown', state: {event: e, id: id}})}
              onTextComSizeMousemove={(e, id) => dispatch({type: 'textSizeMousemove', state: {event: e, id: id}})}
              onTextComSizeMouseup={(e, id) => dispatch({type: 'textSizeMouseup', state: {event: e, id: id}})}
            />
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
                pageState={state}
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
                pageState={state}
                activeImgObject={state.pageState.activeElement}
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
            state.pageState.pageCheckedType === 'text' ?
              <CanvasControlTextCom
                activeElement={state.pageState.activeElement}
                onTopLeftZIndexChange={val => dispatch({type: 'textFormTopLeftZIndex', state: {val: val}})}
                onTextComFormItemChange={(type, value) => dispatch({type: 'textFormItemChange', state: {type: type, value: value}})}
                onFontSizeFontFamilyChange={(type, value) => dispatch({type: 'textComFontSizeFontFamily', state: {type: type, value: value}})}
                onAllowEditedChange={() => dispatch({type: 'allowTextComEdited'})}
                onTransformChange={(type, value) => dispatch({type: 'textComTramsformChange', state: {type: type, value: value}})}
              /> : null
          }
        </div>
      </div>
    </div>
  )
}
