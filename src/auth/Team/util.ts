import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHttp } from 'utils/request';
type getProject = {
    _id:string
    name:string
}
export const useUserProjectList = () =>{
    const client = useHttp() ;
    return useQuery<getProject[]>(['task/getProject'],()=>client(`task/getProject`),
    {
      select: (data) => data || []
    })
}
type getInvite = {
    _id:string
    projectId : {[key:string]:string}
    sender: {[key:string]:string}
    status: 'await' | 'check' | 'reject'
    receiver : {[key:string]:string}
    createdAt?: Date
    updatedAt?: Date
}
export const useGetSendinglist = () =>{
    const client = useHttp() ;
    return useQuery<getInvite[]>(['task/getSendingInvite'],()=>client(`task/getSendingInvite`),
    {
      select: (data) => data || []
    })
}
export const useGetReceivinglist = () =>{
    const client = useHttp() ;
    return useQuery<getInvite[]>(['task/getReceivedInvites'],()=>client(`task/getReceivedInvites`),
    {
      select: (data) => data || []
    })
}
export type sendInvite = {
    projectId?: string
    state?: 'await' | 'check' | 'reject'
    userId?: string
    inviteId?:string
}
export const useAddInvite = () =>{
    const client = useHttp()
    const queryClient = useQueryClient()
    return useMutation((params:sendInvite) =>  client(`task/addInvite`, {
        data: {...params},
        method: "POST",
      }),{
        onSuccess: () =>{
          queryClient.invalidateQueries(`task/getSendingInvite`)
        }
      }
    ) 
}
export const useEditInvite = () =>{
    const client = useHttp()
    const queryClient = useQueryClient()
    return useMutation((params:sendInvite) =>  client(`task/editInvite`, {
        data: {...params},
        method: "POST",
      }),{
        onSuccess: () =>{
          queryClient.invalidateQueries(`task/getReceivedInvites`)
        }
      }
    ) 
}