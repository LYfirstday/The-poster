// 图片元素属性控制面板
import * as React from 'react';
import './canvasControlImgCom.less';
import Slider from '@material-ui/lab/Slider';
import { rotateValueFilter, oppositeRotateValueFilter } from './../../static/ts/tools';
import { Switch } from '@material-ui/core';
import {
  ImgElementStyleType,
  ImgOuterElementStyleType,
  ImgElementType,
} from './poster';
import { ActionTypeInfo, ActionType } from './createPosterReducers/createPosterReducers';

export type imgFormValueType = Partial<ImgElementStyleType> | Partial<ImgOuterElementStyleType> | {isAllowEdit: boolean};

export interface ImageElementControlPanelPropsType {
  dispatch: React.Dispatch<ActionTypeInfo>,
  activeImageElement: ImgElementType
}

const CanvasControlImgCom = (props: ImageElementControlPanelPropsType) => {
  // 错误提示信息
  const [errorInfo, setErrorInfo] = React.useState('');

  // 旋转角度
  // 由于组件用的数值和状态值需要经过换算，所以单独使用useState设置旋转角度
  const [rotate, setRotate] = React.useState(
    oppositeRotateValueFilter(props.activeImageElement.outerElementStyles.transform)
  );

  // 角度旋转滑动change事件
  function onRotateChange(val: number) {
    // 将滑块在50值中的比例换算到180中，得出角度数值
    let rotateValue = (50 - val)/50 * 180;
    let rotate = `rotate(${rotateValue}deg)`;
    setRotate(val);
    props.dispatch({
      type: ActionType.IMAGE_ELEMENT_ROTAET_CHANGE,
      state: {
        elId: props.activeImageElement.id,
        value: rotate
      }
    });
  }

  React.useEffect(() => {
    let thisElementStyle = props.activeImageElement.elementStyles;
    zIndexInputRef.current!.value = `${thisElementStyle.zIndex}`;
    rotateInputRef.current!.value = rotateValueFilter(props.activeImageElement.outerElementStyles.transform);
    heightInputRef.current!.value = `${parseInt(thisElementStyle.height)}`;
    widthInputRef.current!.value = `${parseInt(thisElementStyle.width)}`;
    topInputRef.current!.value = `${parseInt(thisElementStyle.top)}`;
    leftInputRef.current!.value = `${parseInt(thisElementStyle.left)}`;
    setRotate(oppositeRotateValueFilter(props.activeImageElement.outerElementStyles.transform));
  }, [
    props.activeImageElement,
    props.activeImageElement.elementStyles.zIndex,
    props.activeImageElement.outerElementStyles.transform,
    props.activeImageElement.isAllowEdit,
    props.activeImageElement.elementStyles.top,
    props.activeImageElement.elementStyles.left,
    props.activeImageElement.elementStyles.height,
    props.activeImageElement.elementStyles.width,
  ]);

  // 是否可编辑change事件
  function onIsAllowEditChange(val: boolean) {
    props.dispatch({
      type: ActionType.IMAGE_ELEMENT_IS_ALLOWED_EDIT,
      state: {
        elId: props.activeImageElement.id,
        value: val
      }
    });
  }

  // 元素位置、层级关系宽高等form表单元素change事件
  const zIndexInputRef = React.useRef<HTMLInputElement | null>(null);
  const rotateInputRef = React.useRef<HTMLInputElement | null>(null);
  const heightInputRef = React.useRef<HTMLInputElement | null>(null);
  const widthInputRef = React.useRef<HTMLInputElement | null>(null);
  const topInputRef = React.useRef<HTMLInputElement | null>(null);
  const leftInputRef = React.useRef<HTMLInputElement | null>(null);
  /**
   * 
   * @param type form表单input change数据类型
   * @param value form表单input change值
   * @param thisRef 此input挂载的ref引用
   */
  function onZIndexTopLeftHeightWidthChange(type: string, value: string, thisRef: React.MutableRefObject<HTMLInputElement | null>) {
    if (type === 'transform') {
      let reNum = /^[-\\+]?([0-9]+\\.?)?[0-9]+$/;
      if (value === '' || !reNum.test(value) || parseInt(value) > 180 || parseInt(value) < -180) {
        setErrorInfo('请输入-180 到 180 的数字!');
        return;
      }
    } else if (type === 'height' || type === 'width') {
      if (value === '' || value === '-' || isNaN(parseInt(value)) || parseInt(value) < 0) {
        setErrorInfo('请输入大于0的正数字!');
        return;
      }
    } else if (type === 'zIndex') {
      let re = /^[1-9]+[0-9]*]*$/;
      if (!re.test(value) || parseInt(value) > 999) {
        setErrorInfo('请输入大于0，小于999的正数!');
        return;
      }
    } else {
      let reNum = /^[0-9]+.?[0-9]*$/;
      if (value === '' || value === '-' || !reNum.test(value)) {
        setErrorInfo('请输入数字!');
        return;
      }
    }

    setErrorInfo('');
    thisRef.current!.value = value;
    props.dispatch({
      type: ActionType.IMAGE_ELEMENT_TOP_LEFT_ZINDEX_TRANSFORM_HEIGHT_WIDTH_CHANGE,
      state: {
        elId: props.activeImageElement.id,
        value: value,
        type: type
      }
    });
  }

  return (
    <>
      <p className='error-info'>{errorInfo}</p>
      <div className='item'>
        <span className='item-title'>元素尺寸:</span>
        宽：<input
              className='img-com-input'
              type='text'
              ref={widthInputRef}
              onChange={(e) => onZIndexTopLeftHeightWidthChange('width', e.target.value, heightInputRef)}
            />&nbsp;px&nbsp;&nbsp;&nbsp;&nbsp;
        高：<input
              className='img-com-input'
              type='text'
              ref={heightInputRef}
              onChange={(e) => onZIndexTopLeftHeightWidthChange('height', e.target.value, widthInputRef)}
              />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>元素位置:</span>
        Y：<input
            className='img-com-input'
            type='text'
            ref={topInputRef}
            onChange={(e) => onZIndexTopLeftHeightWidthChange('top', e.target.value, topInputRef)}
            />&nbsp;px&nbsp;&nbsp;&nbsp;
        X：<input
             className='img-com-input'
             type='text'
             ref={leftInputRef}
             onChange={(e) => onZIndexTopLeftHeightWidthChange('left', e.target.value, leftInputRef)}
           />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>旋转角度:</span>
        <input
          className='img-com-input-rotate'
          type='text'
          ref={rotateInputRef}
          onChange={(e) => onZIndexTopLeftHeightWidthChange('transform', e.target.value, rotateInputRef)}
          style={{width: '3rem', marginRight: '.5rem'}}
        />°
        <Slider
          value={rotate}
          aria-labelledby="label"
          onChange={(e, val) => onRotateChange(val)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>层级:</span>
        <input
          className='img-com-input'
          type='text'
          ref={zIndexInputRef}
          onChange={(e) => onZIndexTopLeftHeightWidthChange('zIndex', e.target.value, zIndexInputRef)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>是否编辑:</span>
        <Switch
          value='check'
          color="primary"
          onChange={(_, b) => onIsAllowEditChange(b)}
          checked={props.activeImageElement.isAllowEdit}
        />
      </div>
    </>
  )
}

export default CanvasControlImgCom as React.FC<ImageElementControlPanelPropsType>
