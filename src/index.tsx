import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Loadable from 'react-loadable';
import {
  HashRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Loading from './components/loading/loading';
import './statics/less/page.less'

const Main = Loadable({
  loader: () => import('./pages/main/main'),
  loading: Loading,
  timeout: 5000,
  delay: 300
});

const Index = () => {
  return(
    <HashRouter> 
      <Switch>
        <Route path='/index' component={Main}/>
        <Route path='/' render={ () => {return <Redirect to='/index'/>} }/>
      </Switch>
    </HashRouter>
  )
}

ReactDOM.render(
  <Index />,
  document.querySelector('#root')
);
