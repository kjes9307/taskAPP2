import { useUrlQueryParam } from "utils/url";
import { useMemo } from "react";
import { useProjectDetail } from "utils/project";
import { useQuery } from "react-query";
import { useHttp } from 'utils/request';

type taskState = {
  idle:number
  ongoing:number
  done: number
  total: number
}
export const useSearchTaskState = () =>{
  const [{ editId }] = useUrlQueryParam([
    "editId",
  ])
  const client = useHttp() ;
  return useQuery<taskState[]>(['task/getKanBanSingle',editId],()=>client(`task/getKanBanSingle/${editId}`),
  {
    enabled: Boolean(editId),
    select: (data) => data || []
  })
}
// 项目列表搜索的参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [param] = useProjectsSearchParams();
  return ["task/project", param];
};
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]); // 透過url判斷狀態是 add or edit
  const [{ editId }, setEdit] = useUrlQueryParam([
    "editId",
  ]);
  const [{ deleteId }, setDelete] = useUrlQueryParam([
    "deleteId",
  ]);
  const {data:deleteData} = useProjectDetail(String(deleteId))
  const {data:detailData,isLoading} = useProjectDetail(String(editId))
  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => {
    setProjectCreate({ projectCreate: undefined });
    setEdit({editId: undefined })
    setDelete({deleteId:undefined})
  }
  // 接到edit 中項目的id 並設置道url上
  const starEdit = (id:string) => setEdit({ editId : id })
  const starDelete = (id:string) => setDelete({ deleteId : id })
  return {
    projectModalOpen: projectCreate === "true" || Boolean(editId),
    deleteModalOpen: Boolean(deleteId),
    open,
    close,
    starEdit,
    starDelete,
    deleteData,
    detailData,
    isLoading,
    editId
  };
};