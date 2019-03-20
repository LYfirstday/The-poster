// 文本元素属性控制面板
import * as React from 'react';
import './canvasControlImgCom.less';
import { Select, MenuItem, InputLabel, FormControl, Switch } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { rotateValueFilter, oppositeRotateValueFilter } from './../../static/ts/tools';

export interface ControlTextPropsType {
  activeElement: any,
  onTopLeftZIndexChange: (val: any) => void,
  onTextComFormItemChange: (type: string, value: string | number) => void,
  onFontSizeFontFamilyChange: (type: string, value: string) => void
  onAllowEditedChange: () => void,
  onTransformChange: (type: string, value: string) => void,  // type: input还是slider;value: 数值
  onContentChange: (value: string) => void
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
  {
    value: '40px',
    label: '40px'
  },
  {
    value: '44px',
    label: '44px'
  },
  {
    value: '48px',
    label: '48px'
  },
  {
    value: '52px',
    label: '52px'
  },
  {
    value: '56px',
    label: '56px'
  },
  {
    value: '60px',
    label: '60px'
  },
];

export default (props: ControlTextPropsType) => {
  // 错误信息
  const [errorInfo, setErrorInfo] = React.useState('');

  // form表单容器和文本元素共有属性 top, left, zIndex
  // 这里应该显示的是真实的text元素位置和zIndex, 外部容器值在action中计算
  const [commomStyle, setCommomStyle] = React.useState({
    top: `${parseInt(props.activeElement.elementStyles.top)}`,
    left: `${parseInt(props.activeElement.elementStyles.left)}`,
    zIndex: `${parseInt(props.activeElement.elementStyles.zIndex)}`
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
    fontStyle: props.activeElement.elementStyles.fontStyle,
    fontWeight: props.activeElement.elementStyles.fontWeight,
    minHeight: `${parseInt(props.activeElement.elementStyles.minHeight)}`,
    width: `${parseInt(props.activeElement.elementStyles.width)}`,
    textAlign: props.activeElement.elementStyles.textAlign,
    textDecoration: props.activeElement.elementStyles.textDecoration,
  });

  // 自有属性form change事件
  function onTextComFormItemChange(type: string, val: string | number) {
    setTextComFormItem({
      ...textComFormItem,
      [type]: val
    });
    if (!(type === 'height' || type === 'width')) {
      props.onTextComFormItemChange(type, val);
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
    props.onTextComFormItemChange(type, thisValue);
  }

  React.useEffect(() => {
    setCommomStyle({
      top: `${parseInt(props.activeElement.elementStyles.top)}`,
      left: `${parseInt(props.activeElement.elementStyles.left)}`,
      zIndex: `${parseInt(props.activeElement.elementStyles.zIndex)}`
    });
    setTextComFormItem({
      fontStyle: props.activeElement.elementStyles.fontStyle,
      fontWeight: props.activeElement.elementStyles.fontWeight,
      minHeight: `${parseInt(props.activeElement.elementStyles.minHeight)}`,
      width: `${parseInt(props.activeElement.elementStyles.width)}`,
      textAlign: props.activeElement.elementStyles.textAlign,
      textDecoration: props.activeElement.elementStyles.textDecoration,
    });
    setTransform(`${rotateValueFilter(props.activeElement.textElementOuterType.transform)}`);
    setRotate(oppositeRotateValueFilter(props.activeElement.textElementOuterType.transform));
    setTextInputColor(props.activeElement.elementStyles.color);
    setTextColor(props.activeElement.elementStyles.color);
    testareaRef.current!.value = props.activeElement.content;
  },[
    props.activeElement.elementStyles.top,
    props.activeElement.elementStyles.left,
    props.activeElement.elementStyles.zIndex,
    props.activeElement.elementStyles.fontFamily,
    props.activeElement.elementStyles.fontSize,
    props.activeElement.elementStyles.fontStyle,
    props.activeElement.elementStyles.fontWeight,
    props.activeElement.elementStyles.minHeight,
    props.activeElement.elementStyles.width,
    props.activeElement.elementStyles.textAlign,
    props.activeElement.elementStyles.textDecoration,
    props.activeElement.elementStyles.color,
    props.activeElement.textElementOuterType.transform,
    props.activeElement.content
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
  
  // 调色板input change事件
  const [textInputColor, setTextInputColor] = React.useState(props.activeElement.elementStyles.color);

  function onTextInputColorChange(e: any) {
    setTextInputColor(e.target.value);
    setTextColor(e.target.value);
    props.onTextComFormItemChange('color', e.target.value);
    setErrorInfo('');
  }
  // 文本颜色input change事件
  const [textColor, setTextColor] = React.useState('#111111')

  function onTextColroChange(e: any) {
    setTextColor(e.target.value);
  }

  function onTextColroBlur() {
    if (textColor.length === 7) {
      if (textColor.startsWith('#')) {
        props.onTextComFormItemChange('color', textColor);
        setErrorInfo('');
      } else {
        setErrorInfo('请输入正确的颜色值,以#开头 + 6位颜色值');
      }
    } else {
      setErrorInfo('请输入正确的颜色值,以#开头 + 6位颜色值');
    }
  }

  // 文本内容改变

  const testareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  function onContentBlur() {
    props.onContentChange(testareaRef.current!.value);
  }



  return (
    <>
      <p className='error-info'>{errorInfo}</p>
      <div className='item'>
        <span className='item-title'>文字字体:</span>
        <FormControl style={{width: '50%'}}>
          <InputLabel htmlFor="age-simple">选择字体</InputLabel>
          <Select
            value={props.activeElement.elementStyles.fontFamily}
            onChange={(e) => onFontSizeFontFamilyChange('fontFamily', e)}
          >
            <MenuItem value='sans-serif'>
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
            value={props.activeElement.elementStyles.fontSize}
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
          value={textInputColor}
          onChange={(e) => onTextInputColorChange(e)}
        />
        <input
          className='color-value-input'
          type='text'
          value={textColor}
          onChange={(e) => onTextColroChange(e)}
          onBlur={onTextColroBlur}
        />
      </div>
      <div className='item'>
        <span className='item-title'>文本内容:</span>
        <textarea
          className='textarea-content'
          ref={testareaRef}
          id='textarea'
          onBlur={onContentBlur}
        ></textarea>
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
              value={textComFormItem.minHeight}
              className='img-com-input'
              type='text'
              onChange={(e) => onTextComFormItemChange('minHeight', e.target.value)}
              onBlur={() => ontextComFormItemBlur('minHeight')}
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
      {/* <div className='item'>
        <span className='item-title'>层级:</span>
        <input
          className='img-com-input'
          type='text'
          onChange={(e) => onTopLeftZIndexChange('zIndex', e.target.value)}
          onBlur={() => onTopLeftZIndexBlur('zIndex')}
          value={commomStyle.zIndex}
        />
      </div> */}
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
          props.activeElement ?
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
            ) : null
        }
      </div>
    </>
  )
}
