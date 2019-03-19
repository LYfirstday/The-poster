// 创建新活动
import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slide, Button, TextField } from '@material-ui/core';
import './createActivity.less';
import Message from './../../components/message/message';
import { ActivityPageStateType, ActivityData } from './activityReducer/activityReducer';

export interface createActivityParamsType {
  typeName: string, 
  typeContext?: string
  typeId?: string
}

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

export interface CreateActivityPropsType {
  isOpen: boolean,
  showOrCloseDialog: () => void,
  doCreateActivity: (val: createActivityParamsType) => void,
  state: ActivityPageStateType,
  doEditActivity: (val: createActivityParamsType) => void
}

const CreateActivity = (props: CreateActivityPropsType) => {

  const activityNameRef = React.useRef<HTMLInputElement | null>(null);
  const activityContentRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [isMessageOpen, setIsMessageOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState('');

  function doCreateActivity() {
    let activityName = activityNameRef.current!.value;
    let activityContent = activityContentRef.current!.value;
    if (!activityName) {
      setMessageInfo('请输入活动名称');
      onMessageOpenOrClose();
      return;
    }
    let data: createActivityParamsType = {
      typeName: activityName
    };
    
    if (props.state.isEdit) {
      let dataInfo = props.state.editActivityInfo as ActivityData;
      data.typeContext = activityContent;
      data.typeId = dataInfo.typeId;
      props.doEditActivity(data);
    } else {
      if (activityContent) {
        data.typeContext = activityContent;
      }
      props.doCreateActivity(data);
    }
  }

  function onMessageOpenOrClose() {
    setIsMessageOpen(!isMessageOpen);
  }

  React.useEffect(() => {
    if (props.isOpen) {
      if (props.state.isEdit) {
        let data = props.state.editActivityInfo as ActivityData;
        activityNameRef.current!.value = data.typeName;
        activityContentRef.current!.value = data.typeContext;
      } else {
        activityNameRef.current!.value = '';
        activityContentRef.current!.value = '';
      }
    }
  }, [props.isOpen, props.state.isEdit]);

  return (
    <div>
      <Dialog
        open={props.isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.showOrCloseDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          创建活动
        </DialogTitle>
        <DialogContent>
          <div className='item'>
            <span className='item-title'>活动名称:</span>
            <TextField
              inputRef={activityNameRef}
              placeholder="请输入活动名称"
              type='text'
              margin="none"
              className='item-activity-input'
            />
          </div>
          <div className='item'>
            <span className='item-title'>活动说明:</span>
            <TextField
              inputRef={activityContentRef}
              id="outlined-textarea"
              placeholder="请输入活动说明"
              multiline
              margin="none"
              variant="outlined"
              className='item-activity-explain'
            />
          </div>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={props.showOrCloseDialog} color="primary">
            关闭
          </Button>
          <Button color="primary" variant="contained" onClick={doCreateActivity}>
            {
              props.state.isEdit ? '编辑' : '创建'
            }
          </Button>
        </DialogActions>
      </Dialog>
      <Message
        isOpen={isMessageOpen}
        onMessageOpenOrClose={onMessageOpenOrClose}
        children={messageInfo}
      />
    </div>
  )
}

export default CreateActivity as React.FC<CreateActivityPropsType>
