import { useMutation,useQueryClient } from 'react-query';
import { useHttp } from 'utils/request';
import {useUrlQueryParam} from 'utils/url'

type listData = {
    name?:string,
    done?: false|true
    _id?:string
  }
export const useAddList = (_id:string) =>{
    const client = useHttp()
    const queryClient = useQueryClient()
  
    return useMutation((params:listData) =>  client(`task/addTodo/${_id}`, {
      data: {...params},
      method: "POST",
    }),{
      onSuccess: () =>{
        queryClient.invalidateQueries(`task/getTask`)
      }
    }
    ) 
}

export const useEditList = () =>{
    const client = useHttp()
    const queryClient = useQueryClient()
    return useMutation((params:listData) =>  client(`task/editTodo`, {
      data: {...params},
      method: "PATCH",
    }),{
      onSuccess: () =>{
        queryClient.invalidateQueries(`task/getTask`)
      }
    }
    ) 
}
export const useDeleteList = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()
  const [{ taskEdit }] = useUrlQueryParam([
    "taskEdit",
  ]);
  return useMutation((params:listData) =>  client(`task/deleteTodo`, {
    data: {...params,taskId:taskEdit},
    method: "DELETE",
  }),{
    onSuccess: () =>{
      queryClient.invalidateQueries(`task/getTask`)
    }
  }
  ) 
}