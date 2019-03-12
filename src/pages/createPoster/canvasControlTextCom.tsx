// 文本元素属性控制面板
import * as React from 'react';
import './canvasControlImgCom.less';
import { Select, MenuItem, InputLabel, FormControl, Switch } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';

export interface ControlTextPropsType {
  activeElement: any,
  onTopLeftZIndexChange: (val: any) => void,
  onTextComFormItemChange: (val: any, type: string, value: string | number) => void
}

export default (props: ControlTextPropsType) => {
  // 错误信息
  const [errorInfo, setErrorInfo] = React.useState('');

  // form表单容器和文本元素共有属性 top, left, zIndex
  // 这里应该显示的是真实的text元素位置和zIndex, 外部容器值在action中计算
  const [commomStyle, setCommomStyle] = React.useState({
    top: `${parseInt(props.activeElement.textElementInnerType.top)}`,
    left: `${parseInt(props.activeElement.textElementInnerType.left)}`,
    zIndex: `${parseInt(props.activeElement.textElementInnerType.zIndex)}`
  });

  //  top, left, zIndex三个值change事件
  function onTopLeftZIndexChange(type: string, value: string) {
    setCommomStyle({
      ...commomStyle,
      [type]: value
    });
  }

  function onTopLeftZIndexBlur(type: string) {
    let thisValue = commomStyle[type];
    if (isNaN(parseInt(thisValue))) {
      setErrorInfo('请输入正、负数字');
      return;
    } else {
      setErrorInfo('');
    }
    props.onTopLeftZIndexChange(commomStyle);
  }

  // 文本元素自有属性form事件
  const [textComFormItem, setTextComFormItem] = React.useState({
    fontStyle: props.activeElement.textElementInnerType.fontStyle,
    fontWeight: props.activeElement.textElementInnerType.fontWeight,
    height: `${parseInt(props.activeElement.textElementInnerType.height)}`,
    width: `${parseInt(props.activeElement.textElementInnerType.width)}`,
    textAlign: props.activeElement.textElementInnerType.textAlign,
    textDecoration: props.activeElement.textElementInnerType.textDecoration,
  });

  // 自有属性form change事件
  function onTextComFormItemChange(type: string, val: string | number) {
    setTextComFormItem({
      ...textComFormItem,
      [type]: val
    });
    if (!(type === 'height' || type === 'width')) {
      props.onTextComFormItemChange({
        ...textComFormItem,
        [type]: val
      }, type, val);
    }
  }

  function ontextComFormItemBlur(type: string) {
    let thisValue = textComFormItem[type];
    if (type === 'height' || type === 'width') {
      if (isNaN(parseInt(thisValue)) || parseInt(thisValue) <= 0) {
        setErrorInfo('请输入正数字');
        return;
      } else {
        setErrorInfo('');
      }
    }
    let newValue = {
      ...textComFormItem,
      [type]: type === 'height' || type === 'width' ? `${thisValue}px` : thisValue
    };
    props.onTextComFormItemChange(newValue, type, thisValue);
  }

  React.useEffect(() => {
    setCommomStyle({
      top: `${parseInt(props.activeElement.textElementInnerType.top)}`,
      left: `${parseInt(props.activeElement.textElementInnerType.left)}`,
      zIndex: `${parseInt(props.activeElement.textElementInnerType.zIndex)}`
    });
    setTextComFormItem({
      fontStyle: props.activeElement.textElementInnerType.fontStyle,
      fontWeight: props.activeElement.textElementInnerType.fontWeight,
      height: `${parseInt(props.activeElement.textElementInnerType.height)}`,
      width: `${parseInt(props.activeElement.textElementInnerType.width)}`,
      textAlign: props.activeElement.textElementInnerType.textAlign,
      textDecoration: props.activeElement.textElementInnerType.textDecoration,
    });
  },[
    props.activeElement.textElementInnerType.top,
    props.activeElement.textElementInnerType.left,
    props.activeElement.textElementInnerType.zIndex,
    props.activeElement.textElementInnerType.fontFamily,
    props.activeElement.textElementInnerType.fontSize,
    props.activeElement.textElementInnerType.fontStyle,
    props.activeElement.textElementInnerType.fontWeight,
    props.activeElement.textElementInnerType.height,
    props.activeElement.textElementInnerType.width,
    props.activeElement.textElementInnerType.textAlign,
    props.activeElement.textElementInnerType.textDecoration,
  ]);

  // 字体、字号change事件
  function onFontSizeFontFamilyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target)
  }
  
  return (
    <>
      <p className='error-info'>{errorInfo}</p>
      <div className='item'>
        <span className='item-title'>文字字体:</span>
        <FormControl style={{width: '50%'}}>
          <InputLabel htmlFor="age-simple">请选择字体</InputLabel>
          <Select
            value={''}
            onChange={(e) => onFontSizeFontFamilyChange(e)}
          >
            <MenuItem value="">
              <em>系统默认字体</em>
            </MenuItem>
            <MenuItem value={'Ten'}>Ten</MenuItem>
            <MenuItem value={'Twenty'}>Twenty</MenuItem>
            <MenuItem value={'Thirty'}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className='item'>
        <span className='item-title'>文字字号:</span>
        <FormControl style={{width: '50%'}}>
          <InputLabel htmlFor="age-simple">请选择文字字号</InputLabel>
          <Select
            value={20}
            onChange={onFontSizeFontFamilyChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className='item'>
        <span className='item-title'>文本区域大小:</span>
        宽：<input
              value={textComFormItem.width}
              className='img-com-input'
              type='text'
              onChange={(e) => onTextComFormItemChange('width', e.target.value)}
              onBlur={() => ontextComFormItemBlur('width')}
            />&nbsp;px&nbsp;&nbsp;&nbsp;&nbsp;
        高：<input
              value={textComFormItem.height}
              className='img-com-input'
              type='text'
              onChange={(e) => onTextComFormItemChange('height', e.target.value)}
              onBlur={() => ontextComFormItemBlur('height')}
              />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>文本区域位置:</span>
        Y：<input
            className='img-com-input'
            type='text'
            onChange={(e) => onTopLeftZIndexChange('top', e.target.value)}
            value={commomStyle.top}
            onBlur={() => onTopLeftZIndexBlur('top')}
            />&nbsp;px&nbsp;&nbsp;&nbsp;
        X：<input
             className='img-com-input'
             type='text'
             onChange={(e) => onTopLeftZIndexChange('left', e.target.value)}
             value={commomStyle.left}
             onBlur={() => onTopLeftZIndexBlur('left')}
           />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>旋转角度:</span>
        <input
          className='img-com-input-rotate'
          type='text'
          // onChange={(e) => onRotateChangeInputChange(e.target.value)}
          // onBlur={(e) => onRotateChangeInputBlur()}
          style={{width: '3rem', marginRight: '.5rem'}}
          value={`${50}`}
        />°
        <Slider
          value={50}
          aria-labelledby="label"
          // onChange={(e, val) => onRotateChange('transform', val)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>层级:</span>
        <input
          className='img-com-input'
          type='text'
          onChange={(e) => onTopLeftZIndexChange('zIndex', e.target.value)}
          onBlur={() => onTopLeftZIndexBlur('zIndex')}
          value={commomStyle.zIndex}
        />
      </div>
      <div className='item'>
        <span className='item-title'>是否编辑:</span>
        <Switch
          value='check'
          color="primary"
          // onChange={(_, b) => onIsAllowEditChange(b)}
          checked={props.activeElement.isAllowEdit}
        />
      </div>
      <div className='item'>
        {
          props.activeElement.fontStyleImgList.map((val: any, i: number) =>
            <div
              className={val.isChecked ? 'font-style-img-outer img-outer-active' : 'font-style-img-outer'}
              key={`${i}_${val.alt}`}
              onClick={() => onTextComFormItemChange(val.type, val.value)}
            >
              <img
                alt={val.alt}
                className='font-style-img'
                src={val.src}
              />
            </div>
          )
        }
      </div>
    </>
  )
}
