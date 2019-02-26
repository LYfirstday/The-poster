import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './static/less/page.less';
import {
  HashRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Lodaing from './components/loading/loading';
const Login = React.lazy(() => import('./pages/login/login'));

const Index = () => {

  return (
    <React.Suspense fallback={Lodaing}>
      <HashRouter> 
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/' render={ () => {return <Redirect to='/login'/>} }/>
        </Switch>
      </HashRouter>
    </React.Suspense>
  )
}

ReactDOM.render(
  <Index />,
  document.querySelector('#root')
)
