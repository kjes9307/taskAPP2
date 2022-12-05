import React, {  useEffect ,ReactNode} from "react";
import { Button } from "react-bootstrap";
import { useQueryClient } from "react-query";
import * as auth from "unauth/auth-provider";
import {useAsync} from 'utils/use-async';

interface UserResponse{
    token:string;
    name:string
    id?:string
}
export interface AuthForm {
    email: string;
    password: string;
    confirmPassword?:string;
    name?:string;
}

const AuthContext = React.createContext<
    {
        user:UserResponse | null
        appLogin:(form:AuthForm)=> Promise<void>
        appRegister: (form:AuthForm)=> Promise<AuthForm>
        appLogout:()=> void;
    }
    |undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient()
    const {setData,isError,isLoading,isIdle,run, data:user,error} = useAsync<UserResponse|null>()
    // return Provider內部函數
    const appLogin = async({email, password}:AuthForm) => {
        console.log("@login")
        return auth.login({email,password}).then(res=>setData(res));
    }
    const appRegister = async({email, password, confirmPassword,name}:AuthForm) => {
        console.log("@register")
        return auth.register({email,password,confirmPassword,name});
    }
    const appLogout = () => {
        console.log("@logout")
        setData(null);
        auth.logout();
        queryClient.clear()
    }
    const iniUser = async() =>{
        console.log("iniUser")
        let result = null;
        let {token,userid} = auth.getToken()
        if(token){
            result = await auth.checkToken({token,userid: userid as string});
        }
        return result?.data as UserResponse || null
    }
    useEffect(()=>{
        run(iniUser())
    },[])
    if(isIdle || isLoading){
        return <div>Loading</div>
    }
    const isErrorCheck = (value: any): value is Error => value? value?.message:'';
    if(isError && isErrorCheck(error)){
        return <div>Error 404 ! {error?.message} <Button onClick={appLogout}>返回重新登入頁面</Button></div>
    }
    //注意tsx 才能寫成AuthContext.Provider 
    return <AuthContext.Provider value={{appLogin,appRegister,appLogout,user}} children={children}></AuthContext.Provider>
};

// 若需要使用Approvider 內部資料, 需要透過hook取出
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth必须在AuthProvider中使用");
    }
    return context;
  };