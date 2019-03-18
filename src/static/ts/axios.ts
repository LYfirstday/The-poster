import axios from 'axios';

// 显示图片地址前缀
export const fileUrl = 'http://47.93.237.35:8099';
// 设置接口默认前缀url
axios.defaults.baseURL = 'http://47.93.237.35:8099';

const storage: Storage = window.sessionStorage;

export default async (url: string, type: string, data: object) => {
  const userInfo = JSON.parse(`${storage.getItem('userInfo')}`);
  let headers = type === 'UPLOAD' ? {
    'content-type': 'multipart/form-data',
    'loginType': 'userWeb'
  } : {
    'content-type': 'application/json',
    'loginType': 'userWeb',
    'userId': userInfo ? userInfo.userId : null,
    'accessToken': userInfo ? userInfo.token : null,
  }

  return await axios.post(url, data, { headers }).then(res => {
    return res.data;
  });
}
