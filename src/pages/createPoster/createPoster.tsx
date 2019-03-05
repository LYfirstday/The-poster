import * as React from 'react';
import './createPoster.less';
import { Button } from '@material-ui/core';

export default (props: any) => {

  // 调色板
  const [color, setColor] = React.useState('#ffffff');

  // 颜色值输入input
  const [colorValue, setColorValue] = React.useState(color);

  // 颜色值输入错误提示
  const [errorInfo, setErrorInfo] = React.useState('');

  // 调色板change事件
  function onColorChange(e: any) {
    setColor(e.target.value);
    setColorValue(e.target.value);
  }

  // 颜色输入input change事件
  function onColorValueChange(e: any) {
    let value = e.target.value;
    setColorValue(value);
    if (value.length === 7) {
      if (value.startsWith('#')) {
        setColor(value);
      } else {
        setErrorInfo('请输入正确的颜色值');
      }
    }
  }

  return (
    <div className='create-poster'>
      <div className='create-poster-left'>
        {/* 左侧画板 */}
        <div className='poster-canvas'></div>
      </div>

      {/* 右侧控制面板 contorl panel */}
      <div className='create-poster-right'>
        <p className='contorl-panel-title'>画布属性</p>
        <div className='contorl-panel-items'>
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
              value={color}
              onChange={(e) => onColorChange(e)}
            />
            <input
              className='color-value-input'
              type='text'
              value={colorValue}
              onChange={(e) => onColorValueChange(e)}
            />
            <span className='tips'>{errorInfo}</span>
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
        </div>
      </div>
    </div>
  )
}
