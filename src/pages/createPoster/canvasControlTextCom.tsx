// 文本元素属性控制面板
import * as React from 'react';
import './canvasControlImgCom.less';
import { Select, MenuItem, InputLabel, FormControl, Switch } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import {  rotateValueFilter, oppositeRotateValueFilter } from './../../static/ts/tools';
import { ActionTypeInfo, ActionType } from './createPosterReducers/createPosterReducers';
import { TextComStyleType } from './poster'

export interface TextElementControlPanelPropsType {
  dispatch: React.Dispatch<ActionTypeInfo>,
  activeTextElement: TextComStyleType
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

export default (props: TextElementControlPanelPropsType) => {
  // 错误信息
  const [errorInfo, setErrorInfo] = React.useState('');

  React.useEffect(() => {
    let thisElementStyle = props.activeTextElement.elementStyles;
    fontColorInput.current!.value = thisElementStyle.color;
    fontColorSelect.current!.value = thisElementStyle.color;
    testareaRef.current!.value = props.activeTextElement.content;
    widthRef.current!.value = `${parseInt(thisElementStyle.width)}`;
    minHeightRef.current!.value = `${parseInt(thisElementStyle.minHeight)}`;
    topRef.current!.value = `${parseInt(thisElementStyle.top)}`;
    leftRef.current!.value = `${parseInt(thisElementStyle.left)}`;
    isAllowEditRef.current!.checked = Boolean(props.activeTextElement.isAllowEdit);
    rotateInputRef.current!.value = rotateValueFilter(props.activeTextElement.textElementOuterType.transform);
    setSliderValue(oppositeRotateValueFilter(props.activeTextElement.textElementOuterType.transform));
  }, [
    props.activeTextElement,
    props.activeTextElement.elementStyles.color,
    props.activeTextElement.content,
    props.activeTextElement.elementStyles.width,
    props.activeTextElement.elementStyles.minHeight,
    props.activeTextElement.elementStyles.top,
    props.activeTextElement.elementStyles.left,
    props.activeTextElement.isAllowEdit,
    props.activeTextElement.textElementOuterType.transform
  ]);

  const fontFamilyRef = React.useRef<HTMLInputElement | null>(null);
  const fontSizeRef = React.useRef<HTMLInputElement | null>(null);
  const fontColorSelect = React.useRef<HTMLInputElement | null>(null);
  const fontColorInput = React.useRef<HTMLInputElement | null>(null);
  const testareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const widthRef = React.useRef<HTMLInputElement | null>(null);
  const minHeightRef = React.useRef<HTMLInputElement | null>(null);
  const topRef = React.useRef<HTMLInputElement | null>(null);
  const leftRef = React.useRef<HTMLInputElement | null>(null);
  const isAllowEditRef = React.useRef<HTMLInputElement | null>(null);
  const rotateInputRef = React.useRef<HTMLInputElement | null>(null);

  function onTextElementOwnStyleChange(type: string, value: string, ref: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>) {

    if (type === 'color') {
      if (value === '' || !value.startsWith('#') || value.length !== 7) {
        setErrorInfo('请输入有效的7位颜色值;如 #000000');
        return;
      }
    }
    if (type === 'width' || type === 'minHeight' || type === 'zIndex') {
      let re = /^[1-9]+[0-9]*]*$/;
      if (value === '' || !re.test(value)) {
        setErrorInfo('请输入大于0的数字');
        return;
      }
    }
    if (type === 'top' || type === 'left') {
      let reNum = /^[0-9]+.?[0-9]*$/;
      if (value === '' || !reNum.test(value)) {
        setErrorInfo('请输入正确的数字');
        return;
      }
    }
    if (type === 'transform') {
      let reNum = /^[-\\+]?([0-9]+\\.?)?[0-9]+$/;
      if (value === '' || !reNum.test(value) || parseInt(value) > 180 || parseInt(value) < -180) {
        setErrorInfo('请输入-180 至 180的数值');
        return;
      }
      value = `rotate(${value}deg)`;
    }

    type === 'isAllowEdit' || type === 'transform' ? null : ref.current!.value = value;

    setErrorInfo('');
    props.dispatch({
      type: ActionType.TEXT_ELEMENT_CONTROL_PANEL_FORM,
      state: {
        elId: props.activeTextElement.id,
        styleType: type,
        value: value
      }
    });  
  }

  const [sliderValue, setSliderValue] = React.useState(50);

  function onSliderRotateChange(value: number) {
    setSliderValue(value);
    let rotateValue = (50 - value)/50 * 180;
    props.dispatch({
      type: ActionType.TEXT_ELEMENT_CONTROL_PANEL_FORM,
      state: {
        elId: props.activeTextElement.id,
        styleType: 'transform',
        value: `rotate(${rotateValue}deg)`
      }
    });  
  }

  // 字体加粗、斜体、下划线、对齐方式change
  function onFontStyleChange(type: string, number: number) {
    props.dispatch({
      type: ActionType.TEXT_ELEMENT_FONT_STYLE,
      state: {
        elId: props.activeTextElement.id,
        type: type,
        index: number
      }
    });
  }


  return (
    <>
      <p className='error-info'>{errorInfo}</p>
      <div className='item'>
        <span className='item-title'>文字字体:</span>
        <FormControl style={{width: '50%'}}>
          <InputLabel htmlFor="age-simple">选择字体</InputLabel>
          <Select
            value={props.activeTextElement.elementStyles.fontFamily}
            inputRef={fontFamilyRef}
            onChange={(e) => onTextElementOwnStyleChange('fontFamily', e.target.value, fontFamilyRef)}
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
            value={props.activeTextElement.elementStyles.fontSize}
            inputRef={fontSizeRef}
            onChange={(e) => onTextElementOwnStyleChange('fontSize', e.target.value, fontSizeRef)}
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
          ref={fontColorSelect}
          onChange={(e) => onTextElementOwnStyleChange('color', e.target.value, fontColorSelect)}
        />
        <input
          className='color-value-input'
          type='text'
          ref={fontColorInput}
          onChange={(e) => onTextElementOwnStyleChange('color', e.target.value, fontColorInput)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>文本内容:</span>
        <textarea
          className='textarea-content'
          ref={testareaRef}
          id='textarea'
          onChange={(e) => onTextElementOwnStyleChange('content', e.target.value, testareaRef)}
        ></textarea>
      </div>
      <div className='item'>
        <span className='item-title'>文本区域大小:</span>
        宽：<input
              ref={widthRef}
              className='img-com-input'
              type='text'
              onChange={(e) => onTextElementOwnStyleChange('width', e.target.value, widthRef)}
            />&nbsp;px&nbsp;&nbsp;&nbsp;&nbsp;
        高：<input
              ref={minHeightRef}
              className='img-com-input'
              type='text'
              onChange={(e) => onTextElementOwnStyleChange('minHeight', e.target.value, minHeightRef)}
              />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>文本区域位置:</span>
        Y：<input
            className='img-com-input'
            type='text'
            ref={topRef}
            onChange={(e) => onTextElementOwnStyleChange('top', e.target.value, topRef)}
            />&nbsp;px&nbsp;&nbsp;&nbsp;
        X：<input
             className='img-com-input'
             type='text'
             ref={leftRef}
             onChange={(e) => onTextElementOwnStyleChange('left', e.target.value, leftRef)}
           />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>旋转角度:</span>
        <input
          className='img-com-input-rotate'
          type='text'
          ref={rotateInputRef}
          onChange={(e) => onTextElementOwnStyleChange('transform', e.target.value, rotateInputRef)}
          style={{width: '3rem', marginRight: '.5rem'}}
        />°
        <Slider
          value={sliderValue}
          aria-labelledby="label"
          onChange={(e, val) => onSliderRotateChange(val)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>是否编辑:</span>
        <Switch
          value='check'
          color="primary"
          inputRef={isAllowEditRef}
          onChange={(_, v) => onTextElementOwnStyleChange('isAllowEdit', `${v}`, isAllowEditRef)}
        />
      </div>
      <div className='item'>
        {
          props.activeTextElement ?
            props.activeTextElement.fontStyleImgList.map((val: any, i: number) =>
              <div
                className={val.isChecked ? 'font-style-img-outer img-outer-active' : 'font-style-img-outer'}
                key={`${i}_${val.alt}`}
                onClick={() => onFontStyleChange(val.type, i)}
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
