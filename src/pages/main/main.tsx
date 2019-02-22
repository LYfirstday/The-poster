import * as React from 'react';

export default () => {
  let [count, setCount] = React.useState(0);
  return(
    <div>
      <button onClick={() => setCount(count+1)}>count</button>
      <h1>Main...{count}</h1>
    </div>
  )
}
