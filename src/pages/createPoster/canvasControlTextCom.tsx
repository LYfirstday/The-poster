// 文本元素属性控制面板
import * as React from 'react';
import './canvasControlImgCom.less';
import { Select, MenuItem, InputLabel, FormControl, Switch } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { rotateValueFilter, oppositeRotateValueFilter } from './../../static/ts/tools';

export interface ControlTextPropsType {
  activeElement: any,
  onTopLeftZIndexChange: (val: any) => void,
  onTextComFormItemChange: (val: any, type: string, value: string | number) => void,
  onFontSizeFontFamilyChange: (type: string, value: string) => void
  onAllowEditedChange: () => void,
  onTransformChange: (type: string, value: string) => void,  // type: input还是slider;value: 数值
}

export type FontSizeFontFamilyType = {
  value: string,
  label: string
}

// 文本字体
const fontFamily: FontSizeFontFamilyType[] = [
  {
    value: '日本水面字',
    label: '日本水面字'
  },
  {
    value: '一纸情书',
    label: '一纸情书'
  },
  {
    value: '海派腔调禅大黑简',
    label: '海派腔调禅大黑简'
  },
  {
    value: 'jmlangmanmeigonggjm',
    label: 'jmlangmanmeigonggjm'
  },
  {
    value: '汉仪秀英体繁',
    label: '汉仪秀英体繁'
  },
  {
    value: '钟齐李洤标准草书符号',
    label: '钟齐李洤标准草书符号'
  },
  {
    value: '毛泽东字体',
    label: '毛泽东字体'
  },
  {
    value: '春联标准行书体',
    label: '春联标准行书体'
  },
  {
    value: '叶根友毛笔行书',
    label: '叶根友毛笔行书'
  },
  {
    value: '方圆诗书体',
    label: '方圆诗书体'
  },
];

// 文字字号
const fontSize: FontSizeFontFamilyType[] = [
  {
    value: '8px',
    label: '8px'
  },
  {
    value: '12px',
    label: '12px'
  },
  {
    value: '14px',
    label: '14px'
  },
  {
    value: '16px',
    label: '16px'
  },
  {
    value: '18px',
    label: '18px'
  },
  {
    value: '20px',
    label: '20px'
  },
  {
    value: '24px',
    label: '24px'
  },
  {
    value: '28px',
    label: '28px'
  },
  {
    value: '32px',
    label: '32px'
  },
  {
    value: '36px',
    label: '36px'
  },
];

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
    setTransform(`${rotateValueFilter(props.activeElement.textElementOuterType.transform)}`);
    setRotate(oppositeRotateValueFilter(props.activeElement.textElementOuterType.transform));
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
    props.activeElement.textElementOuterType.transform
  ]);

  // 字体、字号change事件
  function onFontSizeFontFamilyChange(type: string, e: React.ChangeEvent<HTMLSelectElement>) {
    props.onFontSizeFontFamilyChange(type, e.target.value);
  }

  // 文本元素旋转change事件，rotate style在外部容器上
  const [transform, setTransform] = React.useState(`${rotateValueFilter(props.activeElement.textElementOuterType.transform)}`);

  // 旋转角度input事件
  function onTextComRotateChange(type: string, value: string) {
    setTransform(value);
  }
  // input blur
  function onTextComRotateBlur() {
    if (parseInt(transform) > 180 || parseInt(transform) < -180) {
      setErrorInfo('请输入-180 到 180之间的数字');
      return;
    } else {
      setErrorInfo('');
    }
    props.onTransformChange('input', `rotate(${transform}deg)`);
  }

  // 旋转角度滑块事件
  const [rotate, setRotate] = React.useState(oppositeRotateValueFilter(props.activeElement.textElementOuterType.transform));

  function onSliderRotateChange(type: string, val: number) {
    // 将滑块在50值中的比例换算到180中，得出角度数值
    let rotateValue = (50 - val)/50 * 180;
    let rotate = `rotate(${rotateValue}deg)`;
    setRotate(val);
    props.onTransformChange(type, rotate);
  }
  
  return (
    <>
      <p className='error-info'>{errorInfo}</p>
      <div className='item'>
        <span className='item-title'>文字字体:</span>
        <FormControl style={{width: '50%'}}>
          <InputLabel htmlFor="age-simple">选择字体</InputLabel>
          <Select
            value={props.activeElement.textElementInnerType.fontFamily}
            onChange={(e) => onFontSizeFontFamilyChange('fontFamily', e)}
          >
            <MenuItem value='none'>
              <em>系统默认字体</em>
            </MenuItem>
            {
              fontFamily.map((val, i) =>
                <MenuItem value={val.value} key={`${i}_${val.value}`}>{val.label}</MenuItem>
              )
            }
          </Select>
        </FormControl>
      </div>
      <div className='item'>
        <span className='item-title'>文字字号:</span>
        <FormControl style={{width: '50%'}}>
          <InputLabel htmlFor="age-simple">选择文字字号</InputLabel>
          <Select
            value={props.activeElement.textElementInnerType.fontSize}
            onChange={(e) => onFontSizeFontFamilyChange('fontSize', e)}
          >
            <MenuItem value=''>
              <em>默认14px</em>
            </MenuItem>
            {
              fontSize.map((val, i) =>
                <MenuItem value={val.value} key={`${i}_${val.value}`}>{val.label}</MenuItem>
              )
            }
          </Select>
        </FormControl>
      </div>
      <div className='item'>
        <span className='item-title'>文本颜色:</span>
        <input
          type='color'
          className='color-input'
        />
        <input
          className='color-value-input'
          type='text'
          // value={colorValue}
          // onChange={(e) => onColorValueChange(e)}
        />
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
          onChange={(e) => onTextComRotateChange('transform', e.target.value)}
          onBlur={onTextComRotateBlur}
          style={{width: '3rem', marginRight: '.5rem'}}
          value={`${transform}`}
        />°
        <Slider
          value={rotate}
          aria-labelledby="label"
          onChange={(e, val) => onSliderRotateChange('slider', val)}
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
          onChange={props.onAllowEditedChange}
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
