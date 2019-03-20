// 创建新活动
import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slide, Button, TextField } from '@material-ui/core';
import './createManager.less';
import Message from './../../components/message/message';
import { ManagerPageStateType, ManagerInfoType } from './managerReducer/managerReducer';
import { Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';

// export interface createActivityParamsType {
//   typeName: string, 
//   typeContext?: string
//   typeId?: string
// }

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

export interface CreateActivityPropsType {
  isOpen: boolean,
  showOrCloseDialog: () => void,
  doCreateManager: (val: ManagerInfoType) => void,
  state: ManagerPageStateType,
  doEditManager: (val: ManagerInfoType) => void
}

const CreateManager = (props: CreateActivityPropsType) => {

  const userNameRef = React.useRef<HTMLInputElement | null>(null);
  const usePasswordRef = React.useRef<HTMLInputElement | null>(null);
  const [isMessageOpen, setIsMessageOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState('');

  // manager role value
  const [role, setRole] = React.useState(''); 

  function onRoleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setRole(e.target.value);
  }

  function doCreateManager() {
    let activityName = userNameRef.current!.value;
    let activityContent = usePasswordRef.current!.value;
    if (!activityName) {
      setMessageInfo('请输入用户名');
      onMessageOpenOrClose();
      return;
    } else if (activityName.length < 6) {
      setMessageInfo('用户名长度必须大于6');
      onMessageOpenOrClose();
      return;
    }
    if (!activityContent) {
      setMessageInfo('请输入用户名登录密码');
      onMessageOpenOrClose();
      return;
    } else if (activityContent.length < 6) {
      setMessageInfo('用户名登录密码长度必须大于6');
      onMessageOpenOrClose();
      return;
    }
    if (role === '') {
      setMessageInfo('请选择用户角色');
      onMessageOpenOrClose();
      return;
    }
    let data: ManagerInfoType = {
      userName: activityName,
      userPassword: activityContent,
      roleId: role
    };
    
    if (props.state.isEdit) {
      let dataInfo = props.state.editManagerInfo as ManagerInfoType;
      data.userId = dataInfo.userId;
      props.doEditManager(data);
    } else {
      props.doCreateManager(data);
    }
  }

  function onMessageOpenOrClose() {
    setIsMessageOpen(!isMessageOpen);
  }

  React.useEffect(() => {
    if (props.isOpen) {
      if (props.state.isEdit) {
        let data = props.state.editManagerInfo as ManagerInfoType;
        userNameRef.current!.value = data.userName;
        usePasswordRef.current!.value = data.userPassword;
        setRole(`${data.roleId}`);
      } else {
        userNameRef.current!.value = '';
        usePasswordRef.current!.value = '';
        setRole('');
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
          创建人员
        </DialogTitle>
        <DialogContent>
          <div className='item'>
            <span className='item-title'>用户名:</span>
            <TextField
              inputRef={userNameRef}
              placeholder="请输入用户名"
              type='text'
              margin="none"
              className='item-activity-input'
            />
          </div>
          <div className='item'>
            <span className='item-title'>密码:</span>
            <TextField
              inputRef={usePasswordRef}
              placeholder="请设置用户登陆密码"
              type='password'
              margin="none"
              className='item-activity-input'
            />
          </div>
          <div className='item'>
            <span className='item-title'>角色:</span>
            <FormControl style={{width: '100%'}}>
              <InputLabel htmlFor="age-simple">选择角色</InputLabel>
              <Select
                value={role}
                onChange={(e) => onRoleSelectChange(e)}
              >
                <MenuItem value={1}>设计师</MenuItem>
                <MenuItem value={0}>管理员</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.showOrCloseDialog} color="primary">
            关闭
          </Button>
          <Button color="primary" variant="contained" onClick={doCreateManager}>
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

export default CreateManager as React.FC<CreateActivityPropsType>
