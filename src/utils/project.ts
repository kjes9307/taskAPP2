import {useQuery,useMutation, QueryKey ,useQueryClient } from 'react-query';
import {cleanObject} from 'utils';
import {useHttp} from 'utils/request';
import {DataType} from 'utils/type'
// useQuery(key , promise)
export const useProject = (param?:Partial<DataType>) =>{
    const client = useHttp() ;
    // 第一參數為 監控key值
    return useQuery<DataType[]>(['task/project',param],()=>client('task/project',{data:cleanObject(param || {})}))

}
export const useDeleteName = () => {
    const client = useHttp();
    const queryClient = useQueryClient()

    return useMutation((params:Partial<DataType>) =>  client(`task/deleteProject/${params._id}`, {
            data: params,
            method: "DELETE",
        })
        ,{
            onSuccess: () =>{
              queryClient.invalidateQueries(`task/project`)
            }
        }
    ) 
};
export const useEditName = () => {
    const client = useHttp();
    const queryClient = useQueryClient()

    return useMutation((params:Partial<DataType>) =>  client(`task/editProject/${params._id}`, {
            data: params,
            method: "PATCH",
        })
        ,{
            onSuccess: () =>{
              queryClient.invalidateQueries(`task/project`)
            }
        }
    ) 
};
export const useAddName = () => {
    const client = useHttp();
    const queryClient = useQueryClient()
    return useMutation((params:Partial<DataType>) =>  client(`task/addProject`, {
            data: params,
            method: "POST",
        }),{
            onSuccess: () =>{
              queryClient.invalidateQueries(`task/project`)
            }
        }
    ) 
};
export const useProjectDetail = (id?: string) => {
    const client = useHttp();
    return useQuery<DataType[]>(
      ['task/project', { id }],
      () => client(`task/project/${id}`),
      {
        enabled: Boolean(id),//沒有id就不請求
      }
    );
  };