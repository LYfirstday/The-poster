// 图片元素属性控制面板
import * as React from 'react';
import './canvasControlImgCom.less';
import Slider from '@material-ui/lab/Slider';
import { rotateValueFilter, oppositeRotateValueFilter } from './../../static/ts/tools';
import { Switch } from '@material-ui/core';
// import { ImgElementStyleType } from './poster';

// export interface ImgFormType {
//   imgFormValue: Partial<ImgElementStyleType>
// }

export interface ControlImgComPropsType {
  onimgElementFormChange: (imgFormValue: any) => void,
  activeImgObject: any,
}

const CanvasControlImgCom = (props: ControlImgComPropsType) => {

  // 旋转角度
  const [rotate, setRotate] = React.useState(oppositeRotateValueFilter(props.activeImgObject.outerElementStyles.transform));

  function onRotateChange(val: number, type: string, e: any) {
    // 将滑块在50值中的比例换算到180中，得出角度数值
    let rotateValue = (50 - val)/50 * 180;
    let rotate = `rotate(${rotateValue}deg)`;
    setRotate(val);
    props.onimgElementFormChange({transform: rotate});
  }
  // setRotate(oppositeRotateValueFilter(props.activeImgObject.outerElementStyles.transform));

  React.useEffect(() => {
    setRotate(oppositeRotateValueFilter(props.activeImgObject.outerElementStyles.transform));
  }, [props.activeImgObject]);

  return (
    <>
      <div className='item'>
        <span className='item-title'>元素尺寸:</span>
        宽：<input
              value={parseInt(props.activeImgObject.elementStyles.width)}
              className='img-com-input'
              type='text'
            />&nbsp;px&nbsp;&nbsp;&nbsp;&nbsp;
        高：<input
              value={parseInt(props.activeImgObject.elementStyles.height)}
              className='img-com-input'
              type='text'
              />&nbsp;px
      </div>
      <div className='item'>
        <span className='item-title'>元素位置:</span>
        Y：<input
            className='img-com-input'
            type='text'
            value={parseInt(props.activeImgObject.elementStyles.top)}
            />&nbsp;&nbsp;&nbsp;&nbsp;
        X：<input
             className='img-com-input'
             type='text'
             value={parseInt(props.activeImgObject.elementStyles.left)}
           />
      </div>
      <div className='item'>
        <span className='item-title'>旋转角度:</span>
          <input
            className='img-com-input'
            type='text'
            style={{width: '3rem', marginRight: '.5rem'}}
            value={`${rotateValueFilter(props.activeImgObject.outerElementStyles.transform)}°`}
          />
        <Slider
          value={rotate}
          aria-labelledby="label"
          onChange={(e, val) => onRotateChange(val, 'rotate', e)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>层级:</span>
        <input
          className='img-com-input'
          type='text'
          value={parseInt(props.activeImgObject.elementStyles.zIndex)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>是否编辑:</span>
        <Switch
          value='check'
          color="primary"
          checked={props.activeImgObject.isAllowEdit}
        />
      </div>
    </>
  )
}

export default CanvasControlImgCom
