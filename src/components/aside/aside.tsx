import * as React from 'react';
import './aside.less';
import { List, ListItem } from '@material-ui/core'
import sideList from './../../static/ts/routeList';
import classNames from 'classnames';
import { SideListItem } from './../../static/ts/routeList';
import { withRouter } from 'react-router';

const Aside = (props: any) => {
  // 初始化导航栏
  const [asideList, setAsideList] = React.useState(sideList());
  /**
   * 导航栏点击事件
   * @param index 点击的导航栏下标
   * @param path 跳转路径
   */
  const onAsideClick = (index: number, path: string) => {
    props.history.push(path);
    setAsideList(navBarChange(index));
  }

  React.useEffect(() => {
    // 初始渲染时，设置默认激活导航栏，刷新页面时从sessionStorage中取
    let storage = window.sessionStorage;
    let index = parseInt(storage.getItem('index') as string) ? parseInt(storage.getItem('index') as string) : 0;
    setAsideList(navBarChange(index));
  }, []);

  /**
   * 修改导航栏激活状态，返回最新导航栏状态
   * @param index 被点击的导航栏下标数
   */
  const navBarChange = (index: number): SideListItem[] => {
    let list: SideListItem[] = sideList();
    // 没用redux，使用本地存储
    let storage = window.sessionStorage;
    list.map((val, i) => {
      // 如果是被点击的导航，则将isActive设为true
      val.isActive = i === index ? true : false;
      storage.setItem('index', `${index}`);
    })
    return list;
  }

  /**
   * 向导航栏动态添加类改变激活未激活样式
   * @param index 导航栏下标
   * @param isActive 判断此导航是否被激活
   */
  const classNameFilter = (index: number, isActive: boolean): string => {
    return classNames(
      'list-item',
      {
        'list-item border-top-bottom': index === sideList().length - 1,
        'list-item-active': isActive
      }
    );
  }

  return (
    <aside className={props.menuChange ? 'aside aside-hidden' : 'aside'}>
      <nav className='nav'>
        <List component="nav">
          {asideList.map((val, i) => 
              <ListItem
                button
                key={i}
                onClick={() => onAsideClick(i, val.path)}
                className={classNameFilter(i, val.isActive)}
              >
                <img src={val.isActive ? val.activeIconUrl : val.iconUrl} />
                {val.context}
              </ListItem>
            )}
        </List>
      </nav>
    </aside>
  )
}

export default withRouter(Aside)
