// 海报文本组件
import * as React from 'react';
import './textElementComponent.less';
import { TextComStyleType } from './../poster';
import { ActionTypeInfo } from './../createPosterReducers/createPosterReducers';
import { rotateValueFilter } from './../../../static/ts/tools';

export interface TextElementComponentPropsType {
  textElement: TextComStyleType,
  dispatch: React.Dispatch<ActionTypeInfo>,
  index: number,   // this element`s subscript in images array
}

const TextElementComponent = (props: TextElementComponentPropsType) => {

  // 文本元素页面移动事件监听函数=============================================begin
  function onTextComMousedown(id: string) {
    // mousedown事件记录文本元素外部容器位置
    event!.stopPropagation();
    let e = event as MouseEvent;
    let out = document.querySelector(`#${id}`) as HTMLElement;
    let distanceY = e.clientY - out.offsetTop;
    let distanceX = e.clientX - out.offsetLeft;
    props.dispatch({
      type: 'text_element_mouse_down',
      state: {elId: id, distanceY: distanceY, distanceX: distanceX}
    });
    document.onmousemove = onTextComMousemove.bind(out, id, distanceY, distanceX);
    document.onmouseup = onTextComMouseup.bind(out);
  }

  function onTextComMousemove(id: string) {
    let e = event as MouseEvent;
    let topMove = `${e.clientY - props.textElement.distanceY}px`;
    let leftMove = `${e.clientX - props.textElement.distanceX}px`;
    props.dispatch({
      type: 'text_element_mouse_move',
      state: {elId: id, topMove: topMove, leftMove: leftMove}
    });
  }

  function onTextComMouseup() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // 文本元素页面移动事件监听函数=============================================end

  // 文本元素右下角宽高控制图片事件监听函数===================================begin
  function onTextComSizeMousedown(id:string) {
    event!.stopPropagation();
    let e = event as MouseEvent;
    let out = document.querySelector(`#${id}`) as HTMLElement;
    let distanceY = e.clientY;
    let distanceX = e.clientX;
    props.dispatch({
      type: 'text_element_mouse_down',
      state: {elId: id, distanceY: distanceY, distanceX: distanceX}
    });

    document.onmousemove = onTextComSizeMousemove.bind(out, id, distanceY, distanceX);
    document.onmouseup = onTextComSizeMouseup.bind(out, id);
  }

  function onTextComSizeMousemove(id:string) {
    event!.stopPropagation();
    let e = event as MouseEvent;
    let distanceY = props.textElement.distanceY;
    let distanceX = props.textElement.distanceX;
    
    // this element`s height and width
    let ElHieght = parseInt(props.textElement.elementStyles.minHeight);
    let ElWidth = parseInt(props.textElement.elementStyles.width);
    // Y轴差值
    let diffDisY = e.clientY - distanceY;
    // X轴差值
    let diffDisX = e.clientX - distanceX;

    // 设置文本元素大小
    // 将文本元素以中心视为坐标轴，分四个象限，右下角控制宽高按钮在不同象限设置宽高数据不同
    
    // 文本旋转的角度
    let rotateDeg: number = parseInt(rotateValueFilter(props.textElement.textElementOuterType.transform));

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
      type: 'text_element_size_change_mouse_move',
      state: {
        elId: id,
        width: newWidth,
        minHeight: newHeight,
        distanceY: e.clientY,
        distanceX: e.clientX
      }
    });
  }

  function onTextComSizeMouseup() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // 文本元素右下角宽高控制图片事件监听函数===================================end

  // 图片元素左上角宽删除图片事件监听函数===================================begin
  // function onDeleteImgClick(index: number) {
  //   props.onTextComDeleteImgClick(index);
  // }
  // 图片元素左上角宽删除图片事件监听函数===================================end

  return (
    <div
      id={props.textElement.id}
      className='canvas-text-com'
      style={{...props.textElement.textElementOuterType}}
    >
      <p
        className={props.textElement.isChecked ? 'text-operation-delete text-operation-active' : 'text-operation-delete'}
        onClick={() => props.dispatch({type: 'text_element_delete', state: {index: props.index}})}
      ></p>
      <p
        className={props.textElement.isChecked ? 'text-operation-size-change text-operation-active' : 'text-operation-size-change'}
        onMouseDown={() => onTextComSizeMousedown(props.textElement.id)}
      ></p>
      <div
        className={props.textElement.isChecked ? 'canvas-text-com-inner text-inner-checked' : 'canvas-text-com-inner'}
        style={{...props.textElement.elementStyles}}
        onMouseDown={() => onTextComMousedown(props.textElement.id)}
        id={`${props.textElement.id}${props.textElement.elementType}`}
      >
        {props.textElement.content}
      </div>
    </div>
  )
}

export default TextElementComponent as React.FC<TextElementComponentPropsType>
