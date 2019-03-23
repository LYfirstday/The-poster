import * as React from 'react';
import './main.less';
import Header from './../../components/header/header';
import Aside from './../../components/aside/aside';
import {
  HashRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Loading from './../../components/loading/loading';
import * as Loadable from 'react-loadable';

// 用户管理
const UserManagement = Loadable({
  loader: () => import('./../userManagement/users'),
  loading: Loading,
  timeout: 8000
});

// 管理员
const Manager = Loadable({
  loader: () => import('./../manager/manager'),
  loading: Loading,
  timeout: 8000
});

// 活动管理 
const ActivityManagement = Loadable({
  loader: () => import('./../activityManagement/activityManagement'),
  loading: Loading,
  timeout: 8000
});

// 海报列表
const PosterManagement = Loadable({
  loader: () => import('./../postersManagement/posters'),
  loading: Loading,
  timeout: 8000
});

// 新建海报
const CreatePoster = Loadable({
  loader: () => import('./../createPoster/createPoster'),
  loading: Loading,
  timeout: 8000
});

// 用户详情 
const UserDetails = Loadable({
  loader: () => import('./../userManagement/userDetails'),
  loading: Loading,
  timeout: 8000
});

const Test = Loadable({
  loader: () => import('./../test'),
  loading: Loading,
  timeout: 8000
});

export default (props: any) => {

  // 用来控制导航栏的显示 隐藏
  const [menuChange, setMenuChange] = React.useState(false);

  // 返回登录页，传给Header组件
  const goToLogin = () => {
    props.history.push('/login');
  }

  return (
    <>
      <Header
        goToLogin={goToLogin}
        menuChange={menuChange}
        setMenuChange={setMenuChange}
      />
      <Aside menuChange={menuChange} />
      <section className='container'>
        <HashRouter> 
          <Switch>
            <Route path='/index/users' component={UserManagement}/>
            <Route path='/index/userDetails' component={UserDetails}/>
            <Route path='/index/manager' component={Manager}/>
            <Route path='/index/activity' component={ActivityManagement}/>
            <Route path='/index/posters' component={PosterManagement}/>
            <Route path='/index/create' component={CreatePoster}/>
            <Route path='/index/test' component={Test}/>
            <Route path='/index' render={ () => {return <Redirect to='/index/users'/>} }/>
          </Switch>
        </HashRouter>
      </section>
    </>
  )
}
