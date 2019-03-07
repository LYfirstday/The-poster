// 画布属性控制面板组件
import * as React from 'react';
import { Button, TextField } from '@material-ui/core';

export interface CanvasComPropsType {
  color: string,    // 颜色选择器值
  colorValue: string,    // 用户输入的颜色值
  errorInfo: string,    // 用户输入的颜色值不合规时的提示信息
  onColorChange: (v: string) => void,    // 颜色选择器值change事件的dispacth
  onColorValueChange: (v: string) => void,    // 用户输入的颜色值选择器值change事件的dispacth
  onErrorInfoChange: (v: string) => void,    // 用户输入的颜色值不合规时的提示信息的dispacth
}

export default (props: CanvasComPropsType) => {

  const [bacColor, setBacColor] = React.useState('#ffffff');
  const [colorValue, setColorValue] = React.useState(bacColor);

  // 调色板change事件
  function onColorChange(e: any) {
    let value = e.target.value;
    setBacColor(value);
    props.onColorChange(value);
    props.onColorValueChange(value);
  }

  // 颜色输入input change事件
  function onColorValueChange(e: any) {
    let value = e.target.value;
    setColorValue(value);
    if (value.length === 7) {
      if (value.startsWith('#')) {
        setBacColor(value);
        props.onColorChange(value);
        props.onErrorInfoChange('');
      } else {
        props.onErrorInfoChange('请输入正确的颜色值');
      }
    } else {
      props.onErrorInfoChange('请输入正确的颜色值');
    }
  }

  return (
    <>
      <div className='item'>
        <span className='item-title'>画布尺寸:</span>
        <p className='item-content'>414px * 736px</p>
      </div>
      <div className='item'>
        <span className='item-title'>宽高比:</span>
        <p className='item-content'>(约为) 1 : 1.78</p>
      </div>
      <div className='item'>
        <span className='item-title'>背景色:</span>
        <input
          className='color-input'
          type='color'
          value={bacColor}
          onChange={(e) => onColorChange(e)}
        />
        <input
          className='color-value-input'
          type='text'
          value={colorValue}
          onChange={(e) => onColorValueChange(e)}
        />
        <span className='tips'>{props.errorInfo}</span>
      </div>
      <div className='item'>
        <span className='item-title'>活动页面:</span>
        <TextField
          label="请输入可访问url地址"
          type='password'
          // value={account.password}
          // onChange={(e) => setAccount({userName: account.userName, password: e.target.value})}
          margin="normal"
          className='item-activity-input'
        />
      </div>
      <div className='item'>
        <span className='important-tips'>*</span>
        <strong className='important-content'> 扫二维码默认跳转h5编辑界面,有活动页面则跳转至活动页面</strong>
      </div>
      <div className='item'>
        <span className='item-title'>背景图:</span>
        <div className='item-upload'>
          <input type='file' className='item-upload-file' />
          <Button
            variant="contained"
            color="primary"
            className='item-upload-btn'
          >上传本地图片</Button>
        </div>
      </div>
      <div className='item'>
        <span className='important-tips'>*</span>
        <strong className='important-content'> 支持上传小于2m的png/jpg/jpeg格式的图片，建议压缩后上传</strong>
      </div>
    </>
  )
}
