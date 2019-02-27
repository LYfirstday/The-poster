import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './static/less/page.less';
import {
  HashRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Loading from './components/loading/loading';
import * as Loadable from 'react-loadable';

const Main = Loadable({
  loader: () => import('./pages/main/main'),
  loading: Loading,
  timeout: 8000
});

const Login = Loadable({
  loader: () => import('./pages/login/login'),
  loading: Loading,
  timeout: 8000
});

const Index = () => {

  return (
    <HashRouter> 
      <Switch>
        <Route path='/index' component={Main}/>
        <Route path='/login' component={Login}/>
        <Route path='/' render={ () => {return <Redirect to='/index'/>} }/>
      </Switch>
    </HashRouter>
  )
}

ReactDOM.render(
  <Index />,
  document.querySelector('#root')
)
