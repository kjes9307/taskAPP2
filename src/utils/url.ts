import { useMemo} from "react"
import { useSearchParams , URLSearchParamsInit } from "react-router-dom"
import {cleanObject} from "utils"
// 11-8修改的Code 跟前面章節8-5有不一樣 以這裡為主
export const useUrlQueryParam = <K extends string>(keys:K[] ) =>{
    // 內建的HOOK
    const [searchParmas,setSearchParam] = useSearchParams()
    // console.log(searchParmas.get('name'))
    // 每一次都創造新對象
    return [
    useMemo(()=>keys.reduce((prev,  key )=>{
        // KEY 值必須要是某幾種值
        return {...prev,[key]:searchParmas.get(key) || ''}
    },{} as {[key in K] : string}), [searchParmas]) ,
    
    // setSearchParam
    // 改成函數限制傳入的key 值 // 只接受參數中的key
    (param:Partial<{[key in K] : unknown}>)=> {
        // entries 讀取一個iterator並轉成obj
        const o = cleanObject({...Object.entries(searchParmas),...param}) as URLSearchParamsInit
        return setSearchParam(o)
    }
    
    ] as const
}
// 專門給task用的
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      // personId is not number here
      () => ({ ...param, personId: param.personId || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};