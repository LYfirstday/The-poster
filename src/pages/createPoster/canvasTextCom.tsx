// 海报文本组件
import * as React from 'react';
import './canvasTextCom.less';
import { TextComStyleType } from './poster';

export interface TextComPropsType {
  textArrayList: TextComStyleType[],
  onTextComMousedown: (e: any, id: string, offsetTop: number, offsetLeft: number) => void,
  onTextComMousemove: (e: any, id: string) => void,
  onTextComMouseup: (e: any, id: string) => void,
  onTextComSizeMousedown: (e: any, id: string) => void,
  onTextComSizeMousemove: (e: any, id: string) => void,
  onTextComSizeMouseup: (e: any, id: string) => void,
}

const CanvasTextCom = (props: TextComPropsType) => {

  // 图片元素页面移动事件监听函数=============================================begin
  function onTextComMousedown(id: string) {
    // mousedown事件记录图片外部容器位置
    event!.stopPropagation();
    let out = document.querySelector(`#${id}`) as HTMLElement;
    document.onmousemove = onTextComMousemove.bind(out, id);
    document.onmouseup = onTextComMouseup.bind(out, id);
    props.onTextComMousedown(event, id, out.offsetTop, out.offsetLeft);
  }

  function onTextComMousemove(id: string) {
    props.onTextComMousemove(event, id);
  }

  function onTextComMouseup(id: string) {
    props.onTextComMouseup(event, id);
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // 图片元素页面移动事件监听函数=============================================end

  // 图片元素右下角宽高控制图片事件监听函数===================================begin
  function onTextComSizeMousedown(id:string) {
    event!.stopPropagation();
    let out = document.querySelector(`#${id}`) as HTMLElement;
    document.onmousemove = onTextComSizeMousemove.bind(out, id);
    document.onmouseup = onTextComSizeMouseup.bind(out, id);
    props.onTextComSizeMousedown(event, id);
  }

  function onTextComSizeMousemove(id:string) {
    props.onTextComSizeMousemove(event, id);
  }

  function onTextComSizeMouseup(id:string) {
    props.onTextComSizeMouseup(event, id);
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // 图片元素右下角宽高控制图片事件监听函数===================================end

  return (
    props.textArrayList.length > 0 ? props.textArrayList.map((val, i) =>
      <div
        id={val.id}
        key={`${i}_${val.id}`}
        className='canvas-text-com'
        style={{...val.textElementOuterType}}
      >
        <p className={val.isChecked ? 'text-operation-delete text-operation-active' : 'text-operation-delete'}></p>
        <p
          className={val.isChecked ? 'text-operation-size-change text-operation-active' : 'text-operation-size-change'}
          onMouseDown={() => onTextComSizeMousedown(val.id)}
        ></p>
        <div
          className={val.isChecked ? 'canvas-text-com-inner text-inner-checked' : 'canvas-text-com-inner'}
          style={{...val.textElementInnerType}}
          onMouseDown={() => onTextComMousedown(val.id)}
        >阿斯达萨大神大神大神大神大神大神大神大神大神大神大神阿萨德阿斯大神大神大神大神大神</div>
      </div>
    ) : null
  )
}

export default CanvasTextCom as React.FC<TextComPropsType>
