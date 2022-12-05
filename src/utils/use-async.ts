import { useCallback, useState, useReducer } from "react";
import {useMountedRef} from 'utils'
//統一處理元件的錯誤訊息提示&loading
//夜面級處理可以 .. 但會加很多code
interface State<D> {
  error: string | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};
const defaultConfig = {
  throwError: false
}

const useSafePatch = <T>(dispatch:(...args: T[])=> void) =>{
  const mountedRef = useMountedRef()
  return useCallback((...args:T[])=> mountedRef.current? dispatch(...args): void 0,[
    mountedRef,dispatch
  ])

}
// 剛好是一個閉包 ?
// 所以資料都獨立
export const useAsync = <D>(initialState?: State<D>, iniConfig?: typeof defaultConfig) => {
  const config = {...defaultConfig,...iniConfig}
  // action vs dispatch type
  const [state, dispatch] = useReducer((state:State<D>,action:Partial<State<D>>)=>({
    ...state,...action
  }),{
    ...defaultInitialState,
    ...initialState,
  });
  const safeDispatch = useSafePatch(dispatch)

  const [retry, setRetry] = useState(() => () => {});
  const setData = useCallback((data: D) =>{
    safeDispatch({
      data,
      stat: "success",
      error: null,
  })
  },[safeDispatch])

  const setError = useCallback((error: string) =>{
    safeDispatch({
      error,
      stat: "error",
      data: null,
  })
  },[safeDispatch])

  const run = useCallback((promise: Promise<D> ,
    runConfig?: { retry: () => Promise<D> }) => {
    if (!promise || !promise.then) {
      throw new Error("请传入 Promise 类型数据");
    }
    setRetry(() => () => {
      // run(promise) 拿到的是結果 return XXX // 而不是請求函數本身
      if (runConfig?.retry) {
        run(runConfig?.retry(), runConfig);
        console.log(runConfig,promise)
      }
    });
    // 直接setState 會導致狀態改變 => 無限render
    // setState({ ...state, stat: "loading" });
    dispatch({stat:"loading"})
    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((error) => {
        setError(error);
        if(config.throwError) return Promise.reject(error); // 這個寫法需要try catch
        return error;
      });
      // 減去state的依賴
  } ,[setData,setError,config.throwError,safeDispatch])

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    retry,
    ...state
  };
};