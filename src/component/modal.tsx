import { Modal, Button,Container,Row,Col,ProgressBar } from "react-bootstrap";
import {useProjectModal,useSearchTaskState} from 'component/useModal'
import { useAddName,useEditName,useDeleteName } from "utils/project";
import { useForm, SubmitHandler  } from 'react-hook-form';
import "./modal.scss"
import Icon from 'component/Icon'
type Inputs = {
  name: string,
};
export const DeleteNote = (props: {
  deleteModalOpen: boolean;
}) =>{
  const {deleteModalOpen,close,deleteData}=useProjectModal()
  const {mutateAsync:deleteProjectAsync}=useDeleteName()
  const {
    register,
    setValue ,
  } = useForm<Inputs>();
  if(deleteData){
    setValue("name",deleteData?.[0].name || 'nodata')
  }
  const onHandleDelete = () =>{
    if(deleteData){
      deleteProjectAsync({...deleteData?.[0]})
      close()
    }
  }
  return (
    <>
    <Modal show={deleteModalOpen} onHide={close}>
      <Container>
      <Row>
        <Col sm='12'>
      <Modal.Title className="d-flex justify-content-between flex-row-reverse m-2">
        <Icon icon='x' className="font-color" onClick={close} style={{cursor:"pointer"}} />
        <h1 className="font-color">Delete</h1>
      </Modal.Title>
        <Modal.Body className="pt-0">
            <label className="font-color" htmlFor="taskName">刪除項目</label>
              <div className="d-flex justify-content-between">
                <input id='taskName'  {...register("name")} className='input-outline input-layout border-0 border-bottom' />  
                <Button size="sm" className="ms-3 text-white" onClick={onHandleDelete}>刪除</Button>
              </div>
          </Modal.Body>
        </Col>
      </Row>
      </Container>
    </Modal>
  </>
  )

}
export const ProjectModal = (props: {
    projectModalOpen: boolean;
  }) => {
    const {
      register,
      handleSubmit,
      setValue ,
    } = useForm<Inputs>();
    const {projectModalOpen,close,detailData,isLoading}=useProjectModal()
    const {data:taskState} = useSearchTaskState()
    const title = detailData? "Edit" : "Create";
    const subtiltle = detailData? "修改名稱" : "新增項目";
    const useMutateProj = detailData ? useEditName : useAddName
    if(detailData){
      setValue("name",detailData?.[0].name || 'nodata')
    }else{
      setValue('name','');
    }

    // 異步操作 之後才能去控制關閉或刷新
    const {mutateAsync} = useMutateProj()
    
    const onSubmit: SubmitHandler<Inputs> = (values) => {
      mutateAsync({...detailData?.[0],...values}).then(()=>{
        if(title==="Create"){
          close();
        }
      })
    }
    return (
    <>
      <Modal show={projectModalOpen} onHide={close} contentClassName='modal-layout'>
        <Container>
        <Row>
          <Col sm='12'>
        <Modal.Title className="d-flex justify-content-between flex-row-reverse m-2">
          <Icon icon='x' className="font-color" onClick={close} style={{cursor:"pointer"}} />
          <h1 className="font-color">{title}</h1>
        </Modal.Title>
        {isLoading?
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          :
          <Modal.Body className="pt-0 pb-0">
            <form onSubmit={handleSubmit(onSubmit)}>
            <label className="font-color" htmlFor="taskName">{subtiltle}</label>
              <div className="d-flex justify-content-between">
                <input id='taskName'  {...register("name")} className='input-outline input-layout border-0 border-bottom' />  
                <Button type="submit" size="sm" className="ms-3 text-white">{title}</Button>
              </div>
            </form>
            <h6 className="font-color mt-2">卡片數量</h6>
            <ul className='list-unstyled mt-4'>
              <li className="mt-3 d-flex align-items-center justify-content-between"><Icon size='2x' icon='circle-check' />完成 {taskState?.[0].done}</li>
              <li className="mt-3 d-flex align-items-center justify-content-between"><Icon size='2x' icon='person-digging' />進行中{taskState?.[0].ongoing}</li>
              <li className="mt-3 d-flex align-items-center justify-content-between"><Icon size='2x' icon='pause' />閒置{taskState?.[0].idle}</li>
              <li className="mt-3 d-flex align-items-center justify-content-between"><Icon size='2x' icon='list-check' />總共 {taskState?.[0].total}</li>
            </ul>
            <ProgressBar now={((taskState?.[0].done || 0) / (taskState?.[0].total || 1))*100}></ProgressBar>
          </Modal.Body>
        }
          </Col>
        </Row>
        </Container>
      </Modal>
    </>
  );
};