import axios from 'axios';

// 显示图片地址前缀
export const fileUrl = '';
// 设置接口默认前缀url
axios.defaults.baseURL = '';

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
    'accessToken': userInfo ? userInfo.webToken : null,
  }

  return await axios.post(url, data, { headers }).then(res => {
    return res.data;
  });
}
