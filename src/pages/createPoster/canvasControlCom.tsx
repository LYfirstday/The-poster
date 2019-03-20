// 画布属性控制面板组件
import * as React from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, } from '@material-ui/core';
import { ActivityData } from './../activityManagement/activityReducer/activityReducer';
import { ActionTypeInfo } from './createPosterReducers/createPosterReducers';
import doService from './../../static/ts/axios';
import Message from './../../components/message/message';

export interface CanvasComPropsType {
  pageState: any,
  colorValue: string,    // 用户输入的颜色值
  errorInfo: string,    // 用户输入的颜色值不合规时的提示信息
  onColorChange: (v: string) => void,    // 颜色选择器值change事件的dispacth
  onErrorInfoChange: (v: string) => void,    // 用户输入的颜色值不合规时的提示信息的dispacth
  onActivityUrlChange: (v: string) => void,
  activityList: ActivityData[],
  dispatch: React.Dispatch<ActionTypeInfo>
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

  // 选择活动类型select change事件
  function onActivityTypeChange(typeId: string) {
    props.dispatch({ type: 'activityType_change', state: { typeId: typeId } });
  }

  React.useEffect(() => {
    setBacColor(props.pageState.pageState.canvasBacInputValue);
    setColorValue(props.pageState.pageState.canvasBacInputValue);
    setActivity(`${props.pageState.pageState.activityPageUrl}`);
  }, [
    props.pageState.pageState.canvasBacInputValue, 
    props.pageState.pageState.activityPageUrl,
  ])

  // on message
  const [onMessage, setMessage] = React.useState({isMessage: false, messageInfo: ''});

  function onMessageOpenOrClose() {
    setMessage({isMessage: false, messageInfo: ''});
  }

  // 上传背景图
  function uploadBacImg() {
    props.dispatch({ type: 'request_start' });
    let input = document.querySelector('#uploadBacImg') as HTMLInputElement;
    let file = input.files![0];
    let fileType = file.type.split('/')[1];
    let fileSize = file.size;
    // 判断图片类型、大小是否合规
    if (fileType !== 'jpg' && fileType !== 'jpeg' && fileType !== 'png') {
      setMessage({isMessage: true, messageInfo: '请上传正确格式的图片'});
      return;
    }
    if (fileSize > 2097152) {
      setMessage({isMessage: true, messageInfo: '请上传小于2M大小的图片'});
      return;
    };
    let formData = new FormData();
    formData.append('file', file);
    doService('/v1/file/upload', 'POST', formData).then(res => {
      if (res.code === 200) {
        props.dispatch({ type: 'bacImgUrl', state: {bacImgUrl: res.values} });
      } else {
        setMessage({isMessage: true, messageInfo: res.description});
      }
      props.dispatch({ type: 'request_end' });
    });
  }

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
        <span className='item-title'>活动类型:</span>
        <FormControl style={{width: '50%'}}>
          <InputLabel htmlFor="age-simple">选择活动类型</InputLabel>
          <Select
            value={props.pageState.activityTypeId}
            onChange={(e) => onActivityTypeChange(e.target.value)}
          >
            {/* {
              fontFamily.map((val, i) =>
                <MenuItem value={val.value} key={`${i}_${val.value}`}>{val.label}</MenuItem>
              )
            } */}
            {
              props.activityList.length > 0 ?
                props.activityList.map((val, i) =>
                  <MenuItem key={`${val.typeId}_${i}`} value={val.typeId}>{val.typeName}</MenuItem>
                ) : null
            }
          </Select>
        </FormControl>
      </div>
      <div className='item'>
        <span className='important-tips'>*</span>
        <strong className='important-content'> 扫二维码默认跳转h5编辑界面,有活动页面则跳转至活动页面</strong>
      </div>
      <div className='item'>
        <span className='item-title'>背景图:</span>
        <div className='item-upload'>
          <input
            type='file'
            id='uploadBacImg'
            onChange={uploadBacImg}
            className='item-upload-file'
          />
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
      <Message
        isOpen={onMessage.isMessage}
        children={onMessage.messageInfo}
        onMessageOpenOrClose={onMessageOpenOrClose}
      />
    </>
  )
}
