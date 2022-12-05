import {useState} from 'react'
import {Modal,Button,Container,Row,Col} from 'react-bootstrap'
import { useDeleteTask,useDeleteKanban } from './util';
export const DeleteModal = ({title,type,id,kanbanId}:{title:string,type:string,id:string,kanbanId?:string})=>{
    const [show, setShow] = useState(false);
    const useDelete = type === 'kanban' ? useDeleteKanban : useDeleteTask;
    const {mutateAsync} = useDelete()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const submit = async () =>{
      if(type === 'kanban' && !kanbanId ){
        await mutateAsync({id})
      }else{
        await mutateAsync({id,kanbanId})
      }
      setShow(false);
    }
    let alert = type==='kanban' ? 
      <h1 className="font-color">Delete </h1> : 
      <h1 className="font-color">Delete </h1> 
    return (
      <>
        <span className="material-symbols-outlined" onClick={handleShow} style={{cursor:"pointer"}}>
        more_horiz
        </span>
        <Modal show={show} onHide={handleClose}>
        <Container>
          <Row>
            <Col sm='12'>
              <Modal.Header className='border-0 py-0' closeButton>
                {alert}
              </Modal.Header>
              <Modal.Body>
                <span className='fs-5 font-color'>{type==='kanban'? `待刪除看板:`:`待刪除任務:`}</span>
                <div className='d-flex justify-content-between align-items-center'>
                  <input className='border-0 border-bottom input-outline' defaultValue={title} />
                  <Button variant="btn btn-primary text-white" onClick={submit}>
                    刪除
                  </Button>
                </div>
              </Modal.Body>      
            </Col>
          </Row>
      </Container>
        </Modal>
      </>
    );
}