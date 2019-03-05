import * as React from 'react';
import './postersCardList.less';
import { Button } from '@material-ui/core';

export default (props: any) => {
  return (
    <div className='posters-card-list'>
      <div className='posters-card-list-item'>
        {/* 是否发布图片标识 */}
        <div className='is-release'>
          <img src={require('./../../static/imgs/release.png')} />
        </div>

        <div className='list-item-top'>
          {/* 模板图片地址 */}
          <img src={require('./../../static/imgs/test.jpg')} />

          {/* 蒙层 */}
          <div className='operation-div'>
            {/* 编辑按钮 */}
            <Button
              variant="contained"
              color="primary"
              className='operation-edit'
            >编辑</Button>

            {/* 设置按钮 */}
            <Button
              variant="contained"
              color="primary"
              className='operation-btn'
            ><img src={require('./../../static/imgs/setting.png')} />设为活动海报</Button>
          </div> 
        </div>
        <div className='list-item-bottom'>
          <p>阿斯达萨大神大神的阿斯达萨阿斯达萨大神大神的阿斯达萨</p>
        </div>
      </div>
    </div>
  )
}
