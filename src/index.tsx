import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Button from 'antd/es/button'
import 'antd/es/button/style';

const Index = () => {
  return (
    <div>
      <Button>666</Button>
    </div>
  )
}

ReactDOM.render(
  <Index />,
  document.querySelector('#root')
)
