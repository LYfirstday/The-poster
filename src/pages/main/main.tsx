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

export default () => {

  // 用来控制导航栏的显示 隐藏
  const [menuChange, setMenuChange] = React.useState(false);

  return (
    <>
      <Header
        menuChange={menuChange}
        setMenuChange={setMenuChange}
      />
      <Aside mainContext={menuChange} />
      <section className='container'>
        <HashRouter> 
          <Switch>
            <Route path='/index/users' component={UserManagement}/>
            <Route path='/index/posters' component={PosterManagement}/>
            <Route path='/index/creste' component={CreatePoster}/>
            <Route path='/index' render={ () => {return <Redirect to='/index/users'/>} }/>
          </Switch>
        </HashRouter>
      </section>
    </>
  )
}
