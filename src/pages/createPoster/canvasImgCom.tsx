// 画布中Image元素组件
import * as React from 'react';
import './canvasImgCom.less';
import { ImgElementType } from './poster';

export interface ImgComPropsType {
  imgsArrayList: ImgElementType[],
  onImgMousedown: (e: any) => void,
  onImgMousemove: (e: any) => void,
}

const CanvasImgCom = (props: ImgComPropsType) => {

  function onImgMousedown(id: string) {
    // 获取当前元素
    let out = document.querySelector(`#${id}`) as HTMLElement;

    // mousedown事件记录图片外部容器位置
    props.onImgMousedown(event);

    // 鼠标移动事件，改变位置  top left值
    out.onmousemove = function() {
      props.onImgMousemove(event);
      out.onmouseup = function() {
        out.onmousemove = null;
        out.onmouseup = null;
      }
      document.addEventListener('mouseup', function (dom: any) {
        dom.onmousemove = null;
        dom.onmouseup = null;
      }, false);
    }
    clearEvent(out);
  }

  // 清除事件
  function clearEvent(dom: any) {
    dom.onmouseup = function() {
      dom.onmousemove = null;
      dom.onmouseup = null;
    }
  }

  return (
    props.imgsArrayList.length > 0 ? props.imgsArrayList.map((val, i) =>
      <div
        className='canvas-img-com'
        style={{...val.outerElementStyles}}
        id={val.id} key={`${val.id}_${i}`}
        onMouseDown={() => onImgMousedown(val.id)}
      >
        <p className='operation-img delete-img'>
          <img src={require('./../../static/imgs/delete.png')} />
        </p>
        <p className='operation-img move-img'>
          <img src={require('./../../static/imgs/move.png')} />
        </p>
        <div className='canvas-img-com-inner' style={{background: `url(${val.imgUrl}) no-repeat center`}}>
        </div>
      </div>
    ) : <></>
  )
}


export default CanvasImgCom as React.FC<ImgComPropsType>
