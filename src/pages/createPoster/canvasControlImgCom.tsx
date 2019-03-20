// 图片元素属性控制面板
import * as React from 'react';
import './canvasControlImgCom.less';
import Slider from '@material-ui/lab/Slider';
import { rotateValueFilter, oppositeRotateValueFilter } from './../../static/ts/tools';
import { Switch } from '@material-ui/core';
import { ImgElementStyleType, ImgOuterElementStyleType } from './poster';
import { CanvasPageState } from './createPosterReducers/createPosterReducers';

export type imgFormValueType = Partial<ImgElementStyleType> | Partial<ImgOuterElementStyleType> | {isAllowEdit: boolean};

export interface PositionTopLeftType {
  top: string,
  left: string,
  zIndex: number
}

export interface ControlImgComPropsType {
  onImgElementFormRotateChange: (imgFormValue: imgFormValueType) => void,
  onImgElementFormIsEditChange: (imgFormValue: boolean) => void,
  onImgElementPositionTopLeftChange: (val: PositionTopLeftType, activityElId: string) => void,
  onImgElementHieghtWidthChange: (val: any) => void
  activeImgObject: any,
  pageState: CanvasPageState,
}

const CanvasControlImgCom = (props: ControlImgComPropsType) => {
  // 错误提示信息
  const [errorInfo, setErrorInfo] = React.useState('');

  // 旋转角度
  // 由于组件用的数值和状态值需要经过换算，所以单独使用useState设置旋转角度
  const [rotate, setRotate] = React.useState(oppositeRotateValueFilter(props.activeImgObject.outerElementStyles.transform));

  // 角度旋转滑动change事件
  function onRotateChange(type: string, val: number) {
    // 将滑块在50值中的比例换算到180中，得出角度数值
    let rotateValue = (50 - val)/50 * 180;
    let rotate = `rotate(${rotateValue}deg)`;
    setRotate(val);
    props.onImgElementFormRotateChange({[type]: rotate});
  }

  // 角度旋转Input输入框change事件
  const [rotateInput, setRotateInput] = React.useState(rotateValueFilter(props.activeImgObject.outerElementStyles.transform));


  function onRotateChangeInputChange(val: string) {
    setRotateInput(val);
  }

  function onRotateChangeInputBlur() {
    if (isNaN(parseInt(rotateInput))) {
      setErrorInfo('只能输入正、负数!');
      return;
    } else if (parseInt(rotateInput) > 180 || parseInt(rotateInput) < -180) {
      setErrorInfo('请输入-180 到 180的数字!');
      return;
    } else {
      setErrorInfo('');
    }
    let rotate = `rotate(${rotateInput}deg)`;
    props.onImgElementFormRotateChange({transform: rotate});
  }

  React.useEffect(() => {
    setRotate(oppositeRotateValueFilter(props.activeImgObject.outerElementStyles.transform));
    setFormPositionTopLeft({
      top: parseInt(props.activeImgObject.elementStyles.top),
      left: parseInt(props.activeImgObject.elementStyles.left),
      zIndex: parseInt(props.activeImgObject.elementStyles.zIndex)
    });
    setRotateInput(rotateValueFilter(props.activeImgObject.outerElementStyles.transform));
    setImgHieghtWidt({
      height: parseInt(props.activeImgObject.elementStyles.height),
      width: parseInt(props.activeImgObject.elementStyles.width),
    });
  }, [
    props.activeImgObject,
    props.activeImgObject.outerElementStyles.transform,
    props.activeImgObject.outerElementStyles.isAllowEdit,
    props.activeImgObject.elementStyles.top,
    props.activeImgObject.elementStyles.left,
    props.activeImgObject.elementStyles.zIndex,
    props.activeImgObject.elementStyles.height,
    props.activeImgObject.elementStyles.width,
  ]);

  // 是否可编辑change事件
  function onIsAllowEditChange(val: boolean) {
    props.onImgElementFormIsEditChange(val);
  }

  // 元素位置、层级关系form表单元素change事件
  const [formPositionTopLeft, setFormPositionTopLeft] = React.useState({
    top: parseInt(props.activeImgObject.elementStyles.top),
    left: parseInt(props.activeImgObject.elementStyles.left),
    zIndex: parseInt(props.activeImgObject.elementStyles.zIndex)
  });

  function onImgPositionTopLeftChange(type: string, value: string) {
    setFormPositionTopLeft({
      ...formPositionTopLeft,
      [type]: value
    });
  }

  function onImgPositionTopLeftBlur(type: string) {
    let thisValue = formPositionTopLeft[type];
    if (isNaN(parseInt(thisValue))) {
      setErrorInfo('只能输入正、负数!');
      return;
    } else {
      setErrorInfo('');
    }
    // 面板显示的是实际图片的位置，减去20是外部容器的位置
    // 外部容器有个20px的padding,所以减去20
    if (type === 'top' || type === 'left') {
      thisValue = parseInt(thisValue) - 20;
    }

    props.onImgElementPositionTopLeftChange({
      ...props.activeImgObject.outerElementStyles,
      [type]: thisValue
    }, props.activeImgObject.id);
  }

  // 图片元素宽高change事件
  const [imgHieghtWidt, setImgHieghtWidt] = React.useState({
    height: parseInt(props.activeImgObject.elementStyles.height),
    width: parseInt(props.activeImgObject.elementStyles.width),
  });

  function onImgElementHieghtWidthChange(type: string, value: string) {
    setImgHieghtWidt({
      ...imgHieghtWidt,
      [type]: value
    });
  }

  function onImgElementHieghtWidthBlur(type: string) {
    let thisValue = imgHieghtWidt[type];
    if (isNaN(parseInt(thisValue)) || parseInt(thisValue) <= 0) {
      setErrorInfo('只能输入正数!');
      return;
    } else {
      setErrorInfo('');
    }
    let {
      height,
      width
    } = imgHieghtWidt;
    props.onImgElementHieghtWidthChange({
      height: `${height}`,
      width: `${width}`,
    });
  }

  return (
    <>
      <p className='error-info'>{errorInfo}</p>
      <div className='item'>
        <span className='item-title'>元素尺寸:</span>
        宽：<input
              value={imgHieghtWidt.width}
              className='img-com-input'
              type='text'
              onChange={(e) => onImgElementHieghtWidthChange('width', e.target.value)}
              onBlur={() => onImgElementHieghtWidthBlur('width')}
            />&nbsp;px&nbsp;&nbsp;&nbsp;&nbsp;
        高：<input
              value={imgHieghtWidt.height}
              className='img-com-input'
              type='text'
              onChange={(e) => onImgElementHieghtWidthChange('height', e.target.value)}
              onBlur={() => onImgElementHieghtWidthBlur('height')}
              />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>元素位置:</span>
        Y：<input
            className='img-com-input'
            type='text'
            onChange={(e) => onImgPositionTopLeftChange('top', e.target.value)}
            value={formPositionTopLeft.top}
            onBlur={() => onImgPositionTopLeftBlur('top')}
            />&nbsp;px&nbsp;&nbsp;&nbsp;
        X：<input
             className='img-com-input'
             type='text'
             onChange={(e) => onImgPositionTopLeftChange('left', e.target.value)}
             value={formPositionTopLeft.left}
             onBlur={() => onImgPositionTopLeftBlur('left')}
           />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>旋转角度:</span>
        <input
          className='img-com-input-rotate'
          type='text'
          onChange={(e) => onRotateChangeInputChange(e.target.value)}
          onBlur={(e) => onRotateChangeInputBlur()}
          style={{width: '3rem', marginRight: '.5rem'}}
          value={`${rotateInput}`}
        />°
        <Slider
          value={rotate}
          aria-labelledby="label"
          onChange={(e, val) => onRotateChange('transform', val)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>层级:</span>
        <input
          className='img-com-input'
          type='text'
          onChange={(e) => onImgPositionTopLeftChange('zIndex', e.target.value)}
          onBlur={() => onImgPositionTopLeftBlur('zIndex')}
          value={formPositionTopLeft.zIndex}
        />
      </div>
      <div className='item'>
        <span className='item-title'>是否编辑:</span>
        <Switch
          value='check'
          color="primary"
          onChange={(_, b) => onIsAllowEditChange(b)}
          checked={props.activeImgObject.isAllowEdit}
        />
      </div>
    </>
  )
}

export default CanvasControlImgCom
