import { useLocation } from 'react-router'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {useMemo} from 'react';
import { useHttp } from 'utils/request';
import {useUrlQueryParam} from 'utils/url'
import {cleanObject,useDebounce} from 'utils'
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  let arr = pathname.split('/')
  const id = arr[2];
  return id;
};
export type listData = {
  name:string,
  done: false|true
  _id:string
  tab: string
}
export interface Iprops<K>{
  alltask?: K[] | []
  kanbanName?: string
  projectId?: string
  _id?: string
  creator?:string
  item? : ColumnType
}
export interface ColumnType {
    _id?:string,
    idx?:number,
    taskName?: string,
    status?: string,
    type?: number,
    kanbanId?:string
    taskTodoList?: listData[]
    length?:number
    comments?: [{ _id:string,comment:string, user:{_id:string,name:string,photo:string}}]
    taskCreator?: {[key:string]:string}
    createAt?:Date;
}

export type Iparams={
  [key:string]: unknown
}
export const useBoardData = () =>{
  const id = useProjectIdInUrl();
  const [param]=useTaskSearchParam()
  let debounceValue = useDebounce(param.taskName,1200)
  let searchParams = cleanObject({...param,taskName:debounceValue })
  const client = useHttp() ;
  return useQuery<Iprops<ColumnType>[]>(['task/getKanBan',{...searchParams,id}],()=>client(`task/getKanBan/${id}/Event`,{data:searchParams || {}}),
  {
    enabled: Boolean(id),
    select: (data) => data || []
  })
}

export const useTaskSearchParam = () =>{
  const id = useProjectIdInUrl();
  const [param,setTaskSearchParam] = useUrlQueryParam(['status','type','taskName'])
  return [useMemo(() => ({
    "type": param.type || undefined,
    "status": param.status || undefined,
    "taskName": param.taskName || undefined
  }), [param,id]),
  setTaskSearchParam] as const
}

export const useAddKanban = () =>{
  const client = useHttp()
  const projectId = useProjectIdInUrl();
  const queryClient = useQueryClient()

  return useMutation((params:Iprops<ColumnType>) =>  client(`task/addKanBan`, {
    data: {...params,projectId},
    method: "POST",
  }),{
    onSuccess: () =>queryClient.invalidateQueries(`task/getKanBan`)
  }
  ) 
}

export const useDeleteKanban = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((param:{id:string}) =>  client(`task/deleteKanBan/${param.id}`, {
    data: {},
    method: "DELETE",
  }),{
    onSuccess: () =>queryClient.invalidateQueries(`task/getKanBan`)
  }
  ) 
}
export const useAddTask = () =>{
  const client = useHttp()
  const projectId = useProjectIdInUrl();
  const queryClient = useQueryClient()

  return useMutation((params:ColumnType) =>  client(`task/addTask`, {
    data: {...params,projectId},
    method: "POST",
  }),{
    onSuccess: () =>{
      queryClient.invalidateQueries(`task/getKanBan`)
    }
  }
  ) 
}
export const useEditTask = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((params:ColumnType) =>  client(`task/editTask`, {
    data: {...params},
    method: "PATCH",
  }),{
    onSuccess: () =>{
      queryClient.invalidateQueries(`task/getTask`)
      queryClient.invalidateQueries(`task/getKanBan`)

    }
}) 
}
export const useDeleteTask = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((param:{id:string,kanbanId?:string}) =>  client(`task/deleteTask/${param.id}`, {
    data: {...param},
    method: "DELETE",
  }),{
    onSuccess: () =>queryClient.invalidateQueries(`task/getKanBan`)
  }
  ) 
}
export const useTaskDatail = (id:string) =>{
  const client = useHttp()
  return useQuery<ColumnType>(['task/getTask',id],()=>client(`task/getTask/${id}`),
  {
    enabled: Boolean(id),
    select: (data) => data || []
  })
}
export const useTaskModel = () =>{
  const [{ taskEdit }, setTaskOpen] = useUrlQueryParam([
    "taskEdit",
  ]);
  const {data,isLoading,isError,error} =useTaskDatail(taskEdit)
  const startEdit = (taskId : string) => setTaskOpen({ taskEdit: taskId });
  const close = () => {
    setTaskOpen({ taskEdit: undefined });
  }
  return {
    taskModalOpen : Boolean(taskEdit),
    startEdit,
    close,
    data,
    isLoading,
    isError,
    error,
    taskEdit
  }
}
export interface SortProps {
  // 要重新排序的 item
  fromId: number;
  // 目标 item
  referenceId: number;
  // 放在目标item的前还是后
  type: "before" | "after";
  fromKanbanId?: number;
  toKanbanId?: number;
}
export const useReorderTask = () => {
  const client = useHttp();
  return useMutation((params: any) => {
    return client("task/reorder", {
      data: params,
      method: "POST",
    });
  });
};
export type memberlistData = {
  member:{
    name:string,
    _id:string,
    photo:string
  }[],
  _id:string,
  projectId:string
}
export const useTaskMemberList = (query:string) =>{
  const client = useHttp() ;
  return useQuery(['task/getMember',query],()=>client(`task/getMember/${query}`),
  {
    enabled: Boolean(query),
    select: (data) => data[0] as memberlistData
  })
}
export type taskPhotoData = {
  _id:string,
  projectId:string
  img_url?:string
  images?: string[]
}
export const useAddPhoto = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((params:Partial<taskPhotoData>) =>  client(`task/addPhoto`, {
    data: {...params},
    method: "POST",
  }),{
    onSuccess: () =>{
      queryClient.invalidateQueries(`task/getPhoto`)
    }
  }
  ) 
}
export const useGetPhoto = (query:string) =>{
  const client = useHttp()
  return useQuery(['task/getPhoto',query],()=>client(`task/getPhoto/${query}`),
  {
    enabled: Boolean(query),
    select: (data) => data[0] as taskPhotoData
  })
}