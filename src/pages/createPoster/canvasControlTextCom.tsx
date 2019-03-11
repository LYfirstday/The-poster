// 文本元素属性控制面板
import * as React from 'react';
import './canvasControlImgCom.less';
import { Select, MenuItem, InputLabel, Input } from '@material-ui/core';

export default () => {
  return (
    <>
      {/* <p className='error-info'>{errorInfo}</p> */}
      <div className='item'>
        <span className='item-title'>元素尺寸:</span>
        <InputLabel htmlFor="age-helper">Age</InputLabel>
          <Select
            value={''}
            // onChange={this.handleChange}
            input={<Input name="age" id="age-helper" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
      </div>
    </>
  )
}
