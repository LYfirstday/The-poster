// 画布中Image元素组件
import * as React from 'react';
import './canvasImgCom.less';
import { ImgElementType } from './poster';

export interface ImgComPropsType {
  imgsArrayList: ImgElementType[],
  onImgMousedown: (e: any, id: string, offsetTop: number, offsetLeft: number) => void,
  onImgMousemove: (e: any, id: string) => void,
  onImgMouseup: (e: any, id: string) => void,
  onDeleteImgClick: (index: number) => void,
  onImgSizeMousedown:(e: any, id: string, offsetTop: number, offsetLeft: number) => void,
  onImgSizeMousemove:(e: any, id: string) => void,
  onImgSizeMouseup:(e: any, id: string) => void,
}

const CanvasImgCom = (props: ImgComPropsType) => {

  // 图片元素页面移动事件监听函数=============================================begin
  function onImgMousedown(id: string) {
    // mousedown事件记录图片外部容器位置
    event!.stopPropagation();
    let out = document.querySelector(`#${id}`) as HTMLElement;
    document.onmousemove = onImgMousemove.bind(out, id);
    document.onmouseup = onImgMouseup.bind(out, id);
    props.onImgMousedown(event, id, out.offsetTop, out.offsetLeft);
  }

  function onImgMousemove(id: string) {
    props.onImgMousemove(event, id);
  }

  function onImgMouseup(id: string) {
    props.onImgMouseup(event, id);
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // 图片元素页面移动事件监听函数=============================================end

  // 图片元素右下角宽高控制图片事件监听函数===================================begin
  function onImgSizeMousedown(id:string) {
    event!.stopPropagation();
    let out = document.querySelector(`#${id}`) as HTMLElement;
    document.onmousemove = onImgSizeMousemove.bind(out, id);
    document.onmouseup = onImgSizeMouseup.bind(out, id);
    props.onImgSizeMousedown(event, id, out.offsetTop, out.offsetLeft);
  }

  function onImgSizeMousemove(id:string) {
    props.onImgSizeMousemove(event, id);
  }

  function onImgSizeMouseup(id:string) {
    props.onImgSizeMouseup(event, id);
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // 图片元素右下角宽高控制图片事件监听函数===================================end


  // 图片元素左上角宽删除图片事件监听函数===================================begin
  function onDeleteImgClick(index: number) {
    props.onDeleteImgClick(index);
  }
  // 图片元素左上角宽删除图片事件监听函数===================================end

  return (
    props.imgsArrayList.length > 0 ? props.imgsArrayList.map((val, i) =>
      <div
        className='canvas-img-com'
        style={{...val.outerElementStyles}}
        id={val.id} key={`${val.id}_${i}`}
      >
        <p className={val.isChecked ? 'delete-img operation-img-active' : 'delete-img'} onClick={() => onDeleteImgClick(i)}></p>
        <p
          className={val.isChecked ? 'move-img operation-img-active' : 'move-img'}
          onMouseDown={() => onImgSizeMousedown(val.id)}
        >
        </p>
        <div
          className={val.isChecked ? 'canvas-img-com-inner inner-active' : 'canvas-img-com-inner'}
          onMouseDown={() => onImgMousedown(val.id)}
          // style={{background: `url(${val.imgUrl}) no-repeat center`, ...val.elementStyles}}
        >
          <img id={`${val.id}${val.elementType}`} src={val.imgUrl} style={{...val.elementStyles}} />
          <div className='img-top'></div>
        </div>
      </div>
    ) : <></>
  )
}


export default CanvasImgCom as React.FC<ImgComPropsType>
