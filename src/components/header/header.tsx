import * as React from 'react';
import './header.less';

export interface HeaderProps {
  menuChange: boolean,
  setMenuChange: React.Dispatch<boolean>
}

export default (props: HeaderProps) => {

  // 菜单按钮点击事件，将#root 元素paddingleft改为0
  const onMenuClick = () => {
    let dom: HTMLElement = document.querySelector('#root') as HTMLElement;
    if (!props.menuChange) {
      dom.className += ' ' + 'root-active';
    } else {
      dom.className = '';
    }
    props.setMenuChange(!props.menuChange)
  }

  return (
    <header className='header'>
      <div className='header-logo'>
        <img src={require('./../../static/imgs/logo.jpg')} />
      </div>

      {/* 菜单按钮  props.mainContext 控制按钮是否旋转 */}
      <img
        className={props.menuChange ? 'menu menu-active' : 'menu'}
        onClick={() => onMenuClick()}
        src={require('./../../static/imgs/menu.png')}
      />

      {/* 用户名、头像 */}
      <div className='user-info'>
        <p>666</p>
        <div className='user-photo'>
          <img src={require('./../../static/imgs/user-photo-42.png')} />
        </div>
        <a className='logout' href='javascript:void(0)'>退出登录</a>
      </div>
    </header>
  )
}
