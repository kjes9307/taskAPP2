import { Container,Row,Col,Spinner } from 'react-bootstrap';
import React,{ useState, useRef } from 'react';
import classNames from "classnames";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Drop, DropChild ,Drag } from 'component/drag';
import {useBoardData,useAddKanban, ColumnType,Iprops,useReorderTask} from './util'
import { CardItem ,DetailModal } from './cardItem';
import { SearchPanel } from './searchPanel';
import {CreateTask} from './createTask';
import {DeleteModal} from './deleteItem';
import Icon from 'component/Icon'
export const KanbanCol = React.forwardRef<HTMLDivElement,{kanban:Iprops<ColumnType>}>(({kanban,...props},ref) =>{
  
  return (
    <Col xs='12' sm='6' md='4' lg='3' className='bg-light me-3 px-2' ref={ref} {...props} >
      <div id={kanban._id}>
        <div className='d-flex align-items-center justify-content-between mb-2 bg-kanban text-white p-1'>
          <h3 className='text-center fs-3 mb-0 px-1'>{kanban.kanbanName}</h3>
          <DeleteModal id={kanban._id || ""} type='kanban' title={kanban?.kanbanName || ""} />
        </div>
        <div className='d-flex align-items-center justify-content-center'>
          <CreateTask kanbanId = {kanban._id || ''} />
        </div>
      <Drop
          type={"ROW"}
          direction={"vertical"}
          droppableId={kanban._id as string}
        >
        <DropChild>
          {kanban.alltask?.map((x,idx)=>
              <Drag
                key={x?._id}
                index={idx}
                draggableId={"task" + x?._id as string}
              >
                <div>
                <CardItem kanbanId={kanban._id} createAt={x?.createAt} idx={idx} length={kanban.alltask?.length} _id={x?._id} taskCreator={x?.taskCreator} type={x.type} status={x.status} taskName={x.taskName}></CardItem>
                </div>
              </Drag>
            )
          }
      </DropChild>
      </Drop>
      <DetailModal />
      </div>
    </Col>
  )
})
export const TaskBoard = ()=>{
  const {data,isLoading} = useBoardData();
  const {mutateAsync:addKanbanAsync,isError,error} = useAddKanban()
  const {mutateAsync:reOrderAsync} = useReorderTask()
  const [kanbanName,setKanban] = useState('')
  const [edit,setEdit] = useState(false);
  const test = useRef<HTMLElement>(null);
  const handleKeyPress = async(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==='Enter') {
      let data = {kanbanName,allTask: []}
      await addKanbanAsync(data)
      setEdit(!edit)
      setKanban('')
    }
  }
  const addClaseName = classNames('d-flex flex-column',{"justify-content-center": !edit ? true:false})
  const titleClass = classNames( 'd-flex','me-1')
  const slideLeft = () => {
    let html = test.current as HTMLElement
    html.scrollLeft = html.scrollLeft+500
  };
  const handleDrag = (param:DropResult) =>{
    const {source:{droppableId},draggableId} = param
    let fromKanbanId = droppableId
    console.log(param)
  }
  return (
    <>
    
      <Container fluid='md' className='overflow-hidden'>
      {isLoading?  
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      :
      <>
      <h1 className='font-color'>STICKERS</h1>
      <SearchPanel />
      <Row className='d-flex flex-nowrap scroll-kanban' ref={test} >
      <DragDropContext onDragEnd={(param)=>handleDrag(param)}>
      <Drop type={"COLUMN"}
                direction={"horizontal"}
                droppableId={"kanban"}>
      <DropChild className='d-flex justify-content-start'>
      {
        data?.map((item,idx)=> {
          return (
            <Drag key={item._id} draggableId={'kanban'+item._id} index={idx}>
              <KanbanCol key={item._id} kanban={item} />
            </Drag> 
          )
        }) 
      }
      <Col lg='2' className={titleClass}>
        <div className={addClaseName}>
        {isError && kanbanName ? <div className="text-danger">{error as string}</div>:null}
        {
          !edit?
            <div>
              <Icon size='2x' className='text-left font-color' style={{cursor:"pointer"}} onClick={()=>setEdit(!edit)} icon='plus' />
            </div>
          :
          <div>
            <input 
              autoFocus
              placeholder='Add name...'
              className='border-0 border-bottom p-2 input-outline' 
              value={kanbanName} 
              onKeyPress={e=>handleKeyPress(e)} 
              onChange={(e)=> setKanban(e.target.value)}
              onBlur={()=> {setKanban('');setEdit(!edit)}}
            />
          </div>
        }
        </div>
      </Col>
      </DropChild>
       </Drop>
      </DragDropContext>
      
      </Row>
      </>
      }
      </Container>
    
    </>
  )
}