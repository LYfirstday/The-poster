import * as React from 'react';
import { Snackbar } from '@material-ui/core';

export interface MessagePropsType {
  isOpen: boolean,
  onMessageOpenOrClose: () => void,
  children: React.ReactChild | string,
}

export default (props: MessagePropsType) => {
  return (
    <div>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={props.isOpen}
        onClose={props.onMessageOpenOrClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        autoHideDuration={2000}
        message={props.children}
      />
    </div>
  )
}

