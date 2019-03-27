import axios from 'axios';
import * as React from 'react';

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
    'accessToken': userInfo ? userInfo.webToken : null,
  }

  return await axios.post(url, data, { headers }).then(res => {
    return res.data;
  });
}

export interface ServicePropsType {
  url: string
}

export const useHackerNewsApi = (props: ServicePropsType) => {
  const [data, setData] = React.useState({ hits: [] });
  const [url, setUrl] = React.useState(props.url);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };
    fetchData();
  }, [url]);

  const doFetch = () => {
    setUrl(props.url);
  };

  return { data, isLoading, isError, doFetch };
}
