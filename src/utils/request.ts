import qs from "qs";
import { useCallback } from "react";
import { useAuth } from 'context/userContext';
interface httpConfig extends RequestInit{
    data?: object,
    token?: string
}
// 抽象Http 請求
// 全部的API 都需要她
const url = process.env.REACT_APP_API_URL
export const http = (endStr:string,{data,token,headers,...config}:httpConfig ={}) => {
    const initConfig = {
        method: 'GET',
        headers:{
            Authorization: token? `Bearer ${token}` : '',
            'Content-Type' : data ? 'application/json' : ''
        },
        ...config // 若有參數則覆蓋前面
    }
    
    // get 的data 是在url , post patch delete 在body
    if (initConfig.method.toUpperCase() === "GET") {
        endStr += data && Object.keys(data).length>0? `?${qs.stringify(data)}`:``;
      } else {
        initConfig.body = JSON.stringify(data || {});
      }
    return window.fetch(`${url}/${endStr}`,initConfig)
    .then(async res=>{
      if (res.status === 401) {
          window.location.reload();
          return Promise.reject({ message: "请重新登录" });
      }

      
      if (res.ok) {
        const {data} = await res.json();
        return data;
      }else{
        // fetch 的catch 不會主動抱錯 所以需要 手動rejectt !?
        console.log("request Catch error")
        let {message} = await res.json()
        return Promise.reject(message);
      }
    })
}

// 若函數要使用其他hook , 函數本身就要視hook
// 登入才需要的系統
//  http 在包一層同時加入token
export const useHttp = () => {
    const { user } = useAuth();
    // ... rest符 是為了使用API 不將Tuple 當作參數傳入
    return useCallback((...[endpoint, config]: Parameters<typeof http>) =>
    http(endpoint, { ...config, token: user?.token }) ,[user?.token])
  };