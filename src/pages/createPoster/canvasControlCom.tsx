// 画布属性控制面板组件
import * as React from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, } from '@material-ui/core';
import { ActivityData } from './../activityManagement/activityReducer/activityReducer';
import { ActionTypeInfo, ActionType, CanvasPageState } from './createPosterReducers/createPosterReducers';
import doService from './../../static/ts/axios';
// import Message from './../../components/message/message';

export interface CanvasComPropsType {
  pageState: CanvasPageState,
  activityList: ActivityData[],
  dispatch: React.Dispatch<ActionTypeInfo>
}

export default (props: CanvasComPropsType) => {

  // 选择活动类型select change事件
  function onActivityTypeChange(typeId: string) {
    props.dispatch({ type: ActionType.ACTIVITY_TYPE_CHANGE, state: { typeId: typeId } });
  }

  // on message
  const [errorInfo, setErrorInfo] = React.useState('');

  // 上传背景图
  function uploadBacImg() {
    let input = document.querySelector('#uploadBacImg') as HTMLInputElement;
    let file = input.files![0];
    let fileType = file.type.split('/')[1];
    let fileSize = file.size;
    // 判断图片类型、大小是否合规
    if (fileType !== 'jpg' && fileType !== 'jpeg' && fileType !== 'png') {
      setErrorInfo('请上传正确格式的图片');
      return;
    }
    if (fileSize > 2097152) {
      setErrorInfo('请上传小于2M大小的图片');
      return;
    };
    props.dispatch({ type: ActionType.REQUEST_START });
    let formData = new FormData();
    formData.append('file', file);
    doService('/v1/file/upload', 'POST', formData).then(res => {
      if (res.code === 200) {
        props.dispatch({ type: ActionType.BACKGROUND_IMAGE_URL, state: {bacImgUrl: res.values} });
      } else {
        setErrorInfo(res.description);
      }
      props.dispatch({ type: ActionType.REQUEST_END });
    });
  }

  React.useEffect(() => {
    backgroundColorInputRef.current!.value = props.pageState.pageState.canvasBacInputValue;
    backgroundColorRef.current!.value = props.pageState.pageState.canvasBacInputValue;
  }, [
    props.pageState.pageState.canvasBacImgUrl,
    props.pageState.pageState.canvasBackground
  ]);

  // 画布表单

  const backgroundColorRef = React.useRef<HTMLInputElement | null>(null);
  const backgroundColorInputRef = React.useRef<HTMLInputElement | null>(null);
  const activityPageUrlRef = React.useRef<HTMLInputElement | null>(null);

  function onFormItemValueChange(type: string, value: string, thisRef: React.MutableRefObject<HTMLInputElement | null>) {
    if(type === 'backgroundColor') {
      if (value === '' || !value.startsWith('#') || value.length !== 7) {
        setErrorInfo('请输入有效的7位颜色值;如 #000000');
        return;
      }
    } else if (type === 'activityPageUrl') {
      if (!(value.startsWith('http://') || value.startsWith('https://'))) {
        setErrorInfo('请输入可访问的页面地址;如：http://xxx或https://');
        return;
      } 
    }
    console.log(value)
    setErrorInfo('');
    thisRef.current!.value = value;
    props.dispatch({
      type: ActionType.CANVAS_STYLE_FORM,
      state: {
        type: type,
        value: value
      }
    });
  }

  return (
    <>
      <span className='error-info'>{errorInfo}</span>
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
          ref={backgroundColorRef}
          onChange={(e) => onFormItemValueChange('backgroundColor', e.target.value, backgroundColorRef)}
        />
        <input
          className='color-value-input'
          type='text'
          ref={backgroundColorInputRef}
          onChange={(e) => onFormItemValueChange('backgroundColor', e.target.value, backgroundColorInputRef)}
        />
      </div>
      <div className='item'>
        <span className='item-title'>活动页面:</span>
        <TextField
          label="请输入可访问url地址"
          type='text'
          inputRef={activityPageUrlRef}
          onChange={(e) => onFormItemValueChange('activityPageUrl', e.target.value, activityPageUrlRef)}
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
      <div className='item'>
        <span className='important-tips'>*</span>
        <strong className='important-content'> HTML字体和canvas在渲染有细微差别，位置有一定误差</strong>
      </div>
    </>
  )
}
