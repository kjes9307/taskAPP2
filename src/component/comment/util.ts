import { useMutation, useQueryClient } from 'react-query';
import { useHttp } from 'utils/request';
export interface CommentProp  {
    _id:string,
    comment:string,
    user:{
        _id:string
        ,name:string
        ,photo:string
    }
    task:string
}
export interface Comment{
    comment?:string
    postid?:string
}
export const useEditComment = () =>{
    const client = useHttp()
    const queryClient = useQueryClient()
  
    return useMutation((params:Comment) =>  client(`task/editComment`, {
      data: {...params},
      method: "PATCH",
    }),{
      onSuccess: () =>{
        queryClient.invalidateQueries(`task/getTask`)
      }
  }) 
}

export const useAddComment = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((params:Comment) =>  client(`task/addComment`, {
    data: {...params},
    method: "POST",
  }),{
    onSuccess: () =>{
      queryClient.invalidateQueries(`task/getTask`)
    }
}) 
}

export const useDeleteComment = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((params:Comment) =>  client(`task/deleteComment`, {
    data: {...params},
    method: "DELETE",
  }),{
    onSuccess: () =>{
      queryClient.invalidateQueries(`task/getTask`)
    }
}) 
}