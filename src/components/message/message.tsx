import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import './message.less';

export type MessageType = 'info' | 'error' | 'waring' | 'success';

export interface MessageProps {
  type: MessageType,
  duration?: number | string,
  children?: string | React.ReactNode | JSX.Element,
}

const Message = (props: MessageProps) => {

  return (
    <div className='message'>
      {props.children}
    </div>
  )
}

Message.newInstance = function messageNewInstance(props: any) {
  // const [messages, setMessages] = React.useState([]);
  let noticeDiv = document.createElement('div');
  document.body.appendChild(noticeDiv);

  // const onCLose = () => {
  //   ReactDOM.unmountComponentAtNode(noticeDiv);
  //   noticeDiv.parentNode!.removeChild(noticeDiv);
  // }
  return (
    <Message
      type='info'
    />
  )
}

export default Message
