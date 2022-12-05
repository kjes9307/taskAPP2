import {  useMutation, useQueryClient  } from 'react-query';
import { useHttp } from 'utils/request';
export interface Member{
    userId?:string
    projectId?:string
}
export const useAddMember = () =>{
    const client = useHttp()
    const queryClient = useQueryClient()
  
    return useMutation((params:Member) =>  client(`task/addMember`, {
      data: {...params},
      method: "POST",
    }),{
      onSuccess: () =>{
        queryClient.invalidateQueries(`task/getMember`)
      }
  }) 
}
export const useDelMember = () =>{
    const client = useHttp()
    const queryClient = useQueryClient()
  
    return useMutation((params:Member) =>  client(`task/delMember`, {
      data: {...params},
      method: "DELETE",
    }),{
      onSuccess: () =>{
        queryClient.invalidateQueries(`task/getMember`)
      }
  }) 
}