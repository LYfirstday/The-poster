import * as React from 'react';
import './login.less';
import { TextField, Button } from '@material-ui/core';
import doService from './../../static/ts/axios';

export default (props: any) => {
  const [account, setAccount] = React.useState({userName: '', userPassword: ''});
  const [errorInfo, setErrorInfo] = React.useState('');

  const doLogin = () => {
    event!.preventDefault();
    if (!account.userName) {
      setErrorInfo('登录账号不能为空!');
      return;
    }
    if (!account.userPassword) {
      setErrorInfo('登录密码不能为空!');
      return;
    }
    doService('/v1/user/login', 'POST', {...account}).then(res => {
      if (res.code === 200) {
        let storage = window.sessionStorage;
        storage.clear();
        let {
          roleId,
          userId,
          webToken,
          userName
        } = res.values;
        let userInfo = {
          ...{
            roleId,
            userId,
            webToken,
            userName
          } 
        };
        storage.setItem('userInfo', JSON.stringify(userInfo));
        props.history.push('/index');
      } else {
        setErrorInfo(res.description);
      }
    });
  }

  return (
    <section className='login'>
      <div className='login-inner'>
      {/* 左边图片 */}
      <div className='login-inner-left'></div>
      {/* 右边表单 */}
      <div className='login-inner-right'>
        <div className='login-form'>
          <img src={require('./../../static/imgs/logo.jpg')} className='logo' />
          <form>
            <TextField
              label="请输入登录账号"
              value={account.userName}
              onChange={(e) => setAccount({userName: e.target.value, userPassword: account.userPassword})}
              margin="normal"
              className='input'
              type='text'
            />
            <TextField
              label="请输入登录密码"
              type='password'
              value={account.userPassword}
              onChange={(e) => setAccount({userName: account.userName, userPassword: e.target.value})}
              margin="normal"
              className='input password'
            />
            <p className='error-info'>{errorInfo}</p>
            <Button
              onClick={() => doLogin()}
              variant="contained"
              color="primary"
              type='submit'
              className='login-btn'
            >登 录</Button>
          </form>
        </div>
      </div>
      </div>
    </section>
  )
}
