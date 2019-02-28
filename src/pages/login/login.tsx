import * as React from 'react';
import './login.less';
import { TextField, Button } from '@material-ui/core';

export default (props: any) => {
  const [account, setAccount] = React.useState({userName: '', password: ''});
  const [errorInfo, setErrorInfo] = React.useState('');

  const doLogin = () => {
    props.history.push('/index')
    return;
    if (!account.userName) {
      setErrorInfo('登录账号不能为空!');
      return;
    }
    if (!account.password) {
      setErrorInfo('登录密码不能为空!');
      return;
    }

  }

  return (
    <section className='login'>
      <div className='login-inner'>
      {/* 左边图片 */}
      <div className='login-inner-left'></div>
      {/* 右边表单 */}
      <div className='login-inner-right'>
        <div className='login-form'>
          <img src={require('./../../static/imgs/logo.png')} className='logo' />
          <TextField
            label="请输入登录账号"
            value={account.userName}
            onChange={(e) => setAccount({userName: e.target.value, password: account.password})}
            margin="normal"
            className='input'
            type='text'
          />
          <TextField
            label="请输入登录密码"
            type='password'
            value={account.password}
            onChange={(e) => setAccount({userName: account.userName, password: e.target.value})}
            margin="normal"
            className='input password'
          />
          <p className='error-info'>{errorInfo}</p>
          <Button
            onClick={doLogin}
            variant="contained"
            color="primary"
            className='login-btn'
          >登 录</Button>
        </div>
      </div>
      </div>
    </section>
  )
}
