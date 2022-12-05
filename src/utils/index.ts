import { useEffect, useState, useRef, RefObject } from "react";


export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

export const isFalsy = (value:unknown) => (value === 0 ? false : !value);

// 在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (object:{[key:string]:unknown}) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在value变化以后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export const useArray = <T>(value:T[]) => {
  // value:{ name: string; age: number }[] 
  // 這樣也可以 但就沒有利用到自動推斷
  const [arr,setArr] = useState<typeof value>([])
  useEffect(()=>{
    setArr(value);
  },[])
  // 這樣也可以 但就多寫一步
//   const [arr,setArr] = useState(value)
  // 改成這樣 看起來簡潔
  return (
    {
        arr,
        add : (newProp:T)=> setArr([...arr,newProp]),
        clear: ()=> setArr([]),
        removeIndex : (index:number) => {
            const copy = [...arr]
            copy.splice(index,1)
            setArr(copy)
            // oldway and incorrect : setArr(arr.splice(index,1)) 只會收到被刪除的元素
        }
    }
  )
  
};

export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
};

const isError = (value:any): value is Error => value?.message
export const errorBox = ({error}:{error:unknown}) =>{
  if(isError(error)){
    return error.message
  }
  return null;
}

export const useTitle = (title : string , keepOnMount: boolean = true) =>{
  const oldTitle = document.title;
  // const oldTitle = useRef(document.title).current
  // 加仔葉面  oldTitle = React App
  // 加仔后 oldTitle = 新title

  useEffect(()=>{
    document.title=title
  },[title])

  useEffect(()=>{
    return () =>{
      if(!keepOnMount){
        // 沒指定依賴 就會讀頁面初始加載值
        // console.log("卸載調用",oldTitle)
        // 拿到最新值 1. 依賴 2. function update 3. useRef
        document.title = oldTitle
      }
    }
  },[keepOnMount,oldTitle])
}

export const useClickOutside= (ref: RefObject<HTMLElement>,parent:RefObject<HTMLElement>, handler: Function) =>{
  useEffect(() => {
      const listener = (event: MouseEvent) => {
          if(parent && parent.current && parent.current.contains(event.target as HTMLElement)  ){
            // 有點應急的解法
            return
          }
          if(!ref.current || ref.current.contains(event.target as HTMLElement) ){
            return
          }
          handler(event)
      }
      document.addEventListener('click',listener)
      return () => {
          document.removeEventListener('click', listener)
      }
  }, [ref,parent, handler])
}  