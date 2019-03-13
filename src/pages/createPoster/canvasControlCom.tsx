// 画布属性控制面板组件
import * as React from 'react';
import { Button, TextField } from '@material-ui/core';

export interface CanvasComPropsType {
  pageState: any,
  colorValue: string,    // 用户输入的颜色值
  errorInfo: string,    // 用户输入的颜色值不合规时的提示信息
  onColorChange: (v: string) => void,    // 颜色选择器值change事件的dispacth
  onErrorInfoChange: (v: string) => void,    // 用户输入的颜色值不合规时的提示信息的dispacth
  onActivityUrlChange: (v: string) => void
}

export default (props: CanvasComPropsType) => {

  const [bacColor, setBacColor] = React.useState('#ffffff');
  const [colorValue, setColorValue] = React.useState(bacColor);

  // 调色板change事件
  function onColorChange(e: any) {
    let value = e.target.value;
    props.onErrorInfoChange('');
    setBacColor(value);
    setColorValue(value);
    props.onColorChange(value);
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
        props.onErrorInfoChange('请输入正确的颜色值,以#开头 + 6位颜色值');
      }
    } else {
      props.onErrorInfoChange('请输入正确的颜色值,以#开头 + 6位颜色值');
    }
  }

  // 活动页面input change事件
  const [activityUrl, setActivity] = React.useState('');
  function onActivityInputChange(e: any) {
    setActivity(e.target.value);
  }

  function onActivityInputBlur() {
    if (activityUrl) {
      if (!(activityUrl.startsWith('http://') || activityUrl.startsWith('https://'))) {
        props.onErrorInfoChange('请输入可访问的页面地址;如：http://xxx或https://');
        return;
      } else {
        props.onErrorInfoChange('');
        props.onActivityUrlChange(activityUrl);
      }
    } else {
      props.onErrorInfoChange('');
      props.onActivityUrlChange(activityUrl);
    }
  }

  React.useEffect(() => {
    setBacColor(props.pageState.pageState.canvasBacInputValue);
    setColorValue(props.pageState.pageState.canvasBacInputValue);
    setActivity(`${props.pageState.pageState.activityPageUrl}`);
  }, [
    props.pageState.pageState.canvasBacInputValue, 
    props.pageState.pageState.activityPageUrl
  ])

  return (
    <>
     <span className='error-info'>{props.errorInfo}</span>
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
      </div>
      <div className='item'>
        <span className='item-title'>活动页面:</span>
        <TextField
          label="请输入可访问url地址"
          type='text'
          value={activityUrl}
          onChange={(e) => onActivityInputChange(e)}
          onBlur={onActivityInputBlur}
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
