import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Input } from 'antd';

const Index = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <Button onClick={() => setCount(count+1)}>666</Button>
      <Input value={count} />
    </div>
  )
}

ReactDOM.render(
  <Index />,
  document.querySelector('#root')
)
