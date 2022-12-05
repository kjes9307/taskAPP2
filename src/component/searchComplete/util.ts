import { useQuery } from 'react-query';
import { useHttp } from 'utils/request';
export type member ={
  name:string
  _id:string
  photo:string
  value: string;
}
export const useGetMember = (query:string) =>{
    const client = useHttp() ;
    return useQuery<member[]>(['user/getUser',query],()=>client(`user/getUser?q=${query}`),
    {
      enabled: Boolean(query),
      select: (data) => data.slice(0, 10).map((item: any) => ({ value: item.name, ...item})) || []
    })
 }
