// 画布中Image元素组件
import * as React from 'react';
import './imageElementComponent.less';
import { ImgElementType } from './../poster';
import { ActionTypeInfo } from './../createPosterReducers/createPosterReducers';
import { rotateValueFilter } from './../../../static/ts/tools';

export interface ImageElementComponentPropsType {
  imageElement: ImgElementType,
  dispatch: React.Dispatch<ActionTypeInfo>,
  index: number,   // this element`s subscript in images array
}

const ImageElementComponent = (props: ImageElementComponentPropsType) => {

  // 图片元素页面移动事件监听函数=============================================begin
  function onImgMousedown(id: string) {
    // mousedown事件记录图片外部容器位置
    event!.stopPropagation();
    let e = event as MouseEvent;
    let out = document.querySelector(`#${id}`) as HTMLElement;
    let distanceY = e.clientY - out.offsetTop;
    let distanceX = e.clientX - out.offsetLeft;
    props.dispatch({
      type: 'image_element_mouse_down',
      state: {elId: id, distanceY: distanceY, distanceX: distanceX}
    });
    document.onmousemove = onImgMousemove.bind(out, id, distanceY, distanceX);
    document.onmouseup = onImgMouseup.bind(out);
  }

  function onImgMousemove(id: string) {
    let e = event as MouseEvent;
    let topMove = `${e.clientY - props.imageElement.distanceY}px`;
    let leftMove = `${e.clientX - props.imageElement.distanceX}px`;
    props.dispatch({
      type: 'image_element_mouse_move',
      state: {elId: id, topMove: topMove, leftMove: leftMove}
    });
  }

  function onImgMouseup() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // // 图片元素页面移动事件监听函数=============================================end

  // // 图片元素右下角宽高控制图片事件监听函数===================================begin
  function onImgSizeMousedown(id:string) {
    event!.stopPropagation();
    let e = event as MouseEvent;
    let out = document.querySelector(`#${id}`) as HTMLElement;
    let distanceY = e.clientY;
    let distanceX = e.clientX;
    props.dispatch({
      type: 'image_element_mouse_down',
      state: {elId: id, distanceY: distanceY, distanceX: distanceX}
    });

    document.onmousemove = onImgSizeMousemove.bind(out, id, distanceY, distanceX);
    document.onmouseup = onImgSizeMouseup.bind(out, id);
  }

  function onImgSizeMousemove(id:string) {
    event!.stopPropagation();
    let e = event as MouseEvent;
    let distanceY = props.imageElement.distanceY;
    let distanceX = props.imageElement.distanceX;
    
    // this element`s height and width
    let ElHieght = parseInt(props.imageElement.elementStyles.height);
    let ElWidth = parseInt(props.imageElement.elementStyles.width);
    // Y轴差值
    let diffDisY = e.clientY - distanceY;
    // X轴差值
    let diffDisX = e.clientX - distanceX;

    // 设置图片大小
    // 图片宽、高 = 旧的宽、高值 - 鼠标移动的距离
    // 将图片以中心视为坐标轴，分四个象限，右下角控制宽高按钮在不同象限设置宽高数据不同
    // 图片旋转的角度
    let rotateDeg: number = parseInt(rotateValueFilter(props.imageElement.outerElementStyles.transform));

    // 获取图片第一在坐标系第一象限x轴临界值角度
    let rotateValue: number = Math.round(Math.atan(ElHieght/ElWidth) / (Math.PI / 180));

    let newHeight: number = 0;
    let newWidth: number = 0;

    // 在第一象限时 X轴增大，图片高度增大；Y轴增大，图片宽度减小
    if (rotateDeg <= -rotateValue && rotateDeg >= -(90 + rotateValue)) {
      newWidth = ElWidth + (distanceY - e.clientY);
      newHeight = ElHieght + diffDisX;
    }

    // 在第二象限时 X轴增大，图片宽度增大；Y轴增大，图片高度增大
    if (rotateDeg > -rotateValue && rotateDeg < (90 - rotateValue)) {
      newWidth = ElWidth + diffDisX;
      newHeight = ElHieght + diffDisY;
    }

    // 在第三象限时  Y轴增大，图片宽度增大；X轴增大，图片高度减小
    if (rotateDeg >= (90 - rotateValue) && rotateDeg <= (90 + rotateValue)) {
      newWidth = ElWidth + (e.clientY - distanceY);
      newHeight = ElHieght + (distanceX - e.clientX);
    }

    // 在第四象限时  X轴增大，图片宽度减小；Y轴增大，图片高度增大
    if ((rotateDeg > (90 + rotateValue) && rotateDeg <= 180) || (rotateDeg < -(90 + rotateValue) && rotateDeg >= -180)) {
      newWidth = ElWidth + (distanceX - e.clientX);
      newHeight = ElHieght + (distanceY - e.clientY);
    }

    props.dispatch({
      type: 'image_element_size_change_mouse_move',
      state: {
        elId: id,
        width: newWidth,
        height: newHeight,
        distanceY: e.clientY,
        distanceX: e.clientX
      }
    });
  }

  function onImgSizeMouseup() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // // 图片元素右下角宽高控制图片事件监听函数===================================end

  return (
    <div
      className='canvas-img-com'
      style={{...props.imageElement.outerElementStyles}}
      id={props.imageElement.id}
    >
      <p
        className={props.imageElement.isChecked ? 'delete-img operation-img-active' : 'delete-img'}
        onClick={() => props.dispatch({ type: 'image_element_delete', state: {index: props.index} })}
      ></p>
      <p
        className={props.imageElement.isChecked ? 'move-img operation-img-active' : 'move-img'}
        onMouseDown={() => onImgSizeMousedown(props.imageElement.id)}
      >
      </p>
      <div
        className={props.imageElement.isChecked ? 'canvas-img-com-inner inner-active' : 'canvas-img-com-inner'}
        onMouseDown={() => onImgMousedown(props.imageElement.id)}
        style={{
          background: `url(${props.imageElement.imgUrl}) no-repeat center`,
          ...props.imageElement.elementStyles
        }}
      >
      </div>
    </div>
  )
}


export default ImageElementComponent as React.FC<ImageElementComponentPropsType>
