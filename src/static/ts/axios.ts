import axios from 'axios';

// 显示图片地址前缀
export const fileUrl = 'http://112.35.24.82:8090';
// 设置接口默认前缀url
axios.defaults.baseURL = 'http://112.35.24.82:8090/console';

export default async (url: string, type: string, data: object) => {
  let headers = type === 'UPLOAD' ? {
    'content-type': 'multipart/form-data',
    'loginType': 'userWeb'
  } : {
    'content-type': 'application/json',
    'loginType': 'userWeb',
    // 'userId': userInfo.userId || null,
    // 'accessToken': userInfo.token || null,
  }

  return await axios.post(url, data, { headers }).then(res => {
    return res.data;
  });
}
