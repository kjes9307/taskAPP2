import React, {useEffect, useState} from 'react'
import {Card,Modal,Container,Row,Col} from 'react-bootstrap'
import moment from 'moment'
import { ColumnType,useTaskModel,useEditTask,useTaskSearchParam,useTaskMemberList,useAddPhoto,useGetPhoto } from "./util"
import {useDelMember} from 'component/selectPerson/util'
import { DeleteModal } from './deleteItem'
import {TodoList} from "component/todo/todoList"
import { Comment } from 'component/comment'
import { useAddComment } from 'component/comment/util'
import {IselectType} from "component/selectType"
import { SelectPerson } from 'component/selectPerson'
import Icon from 'component/Icon'
import { UploadFile } from 'component/upload';
import { useAuth } from 'context/userContext';
import './card.scss'
const  TypeSelector =(props:{idx:number,length:number,id:string,type:number})=> {
  const type =[
    {
        textType: "bg-dark",
        spanName : "psychology_alt",
        name: "question",
        index: 0
    },
    {
        textType: "bg-danger",
        spanName : "bug_report",
        name: "Bug",
        index: 1
    },
    {
        textType: "bg-info",
        spanName : "task",
        name: "Task",
        index: 2
    },
    {
        textType: "bg-success",
        spanName : "lightbulb",
        name: "Idea",
        index: 3
    },
    {
        textType: "bg-warning",
        spanName : "description",
        name: "Note",
        index: 4
    }
    ,
    {
        textType: "bg-sp",
        spanName : "turn_sharp_right",
        name: "Improvement",
        index: 5
    }
  ]
  const {mutateAsync} = useEditTask()
  const {idx,length,id,type:typeChecked} = props
  const handleOpen = (e:React.MouseEvent) =>{
    e.stopPropagation()
  }
  const taskType = async(index:number,id:string) =>{
    let data ={
      taskId: id,
      type: index
    }
    await mutateAsync(data)
  }
  return (
    <div onClick={(e)=> handleOpen(e)}>
      <IselectType 
        type={type} 
        defaultIndex={typeChecked} 
        className="position-absolute top-0 start-0 select-type-layout" 
        style={{zIndex: length-idx + 10}}
        onSelect={(index)=>{taskType(index,id)}} />
    </div>
  );
}

const Mark = ({name,keyword}:{name:string,keyword:string}) =>{
  if(!keyword){ return <>{name}</>};
  const arr = name.split(keyword)
  return <>
  {
    arr.map((str,idx)=>{
      return <span key={idx}>
        {str}
        {
          idx ===arr.length-1 ?null : <span style={{color:"#f24"}}>{keyword}</span>
        }
      </span>
    })
  }
  </>
}
export const CardItem = (props:ColumnType) =>{
    const {taskName,status,_id,idx,length,type,createAt,kanbanId} = props
    const {startEdit} = useTaskModel()
    const [param]= useTaskSearchParam()
    const {taskName:keyword} = param
    const handleShow = (e:React.MouseEvent)=>{
      e.stopPropagation()
  
    }
    return (
      <div className='position-relative px-2'>
      <Card className="mb-4 p-0 cardItem" >
        <Card.Body style={{ cursor:"pointer" }} onClick={()=>startEdit(_id || '')}>
        <div className='d-flex align-items-start justify-content-between border-bottom py-2'>
          <div>
          <h3><Mark keyword={keyword as string} name={taskName  as string} /></h3>
          <Card.Subtitle className="mb-2 font-color cardItem-sub">
            {status==='idle' && "等待。"}
            {status==='ongoing' && "進行中。"}
            {status==='done' && "完成。"}
          </Card.Subtitle>
          </div>
          <div className='d-flex align-items-center justify-content-center' style={{width:30,height:30 ,zIndex:10}} onClick={(e)=> handleShow(e)}>
          <DeleteModal kanbanId={kanbanId as string} id={_id || ""} type='task' title={taskName || ""} />
          </div>
        </div>
        <div className='font-color cardItem-sub text-end mt-2'>{createAt && moment(createAt).format("YYYY.MM.DD HH:mm")}</div>
        </Card.Body>
      </Card>
      <TypeSelector type={type || 0} id={_id || ""} idx={idx || 0} length={length || 0} />
      </div> 
   
    )
}
export const DetailModal = () =>{
  const {taskModalOpen,close,data,isError,isLoading:isTaskLoading,taskEdit:TaskId} = useTaskModel()
  const {taskName,_id,taskCreator,status,taskTodoList,comments} = {...data}
  const {data:memberList} = useTaskMemberList(_id || '')
  const {mutateAsync,isLoading:isEditLoading} = useEditTask()
  const {mutateAsync:addCommentAsync}=useAddComment()
  const {mutateAsync:deleteDelMembertAsync}=useDelMember()
  const { user } = useAuth();
  const [open,setOpen] = useState(false)
  const [value,setValue] = useState('')
  const [comment,setComment] = useState('')
  const [member, showMember] = useState('');
  const {mutateAsync:addPhotoAsync}=useAddPhoto()
  const {data:photoList} = useGetPhoto(_id as string)
  const isLoading = isEditLoading || isTaskLoading ? true: false;
  const mouseEvent = (event: string) => {
    showMember(event);
  };
  const handleDeleteMember =async(props:{projectId:string,userId:string})=>{
    const {projectId,userId} = props
    if(projectId && userId){
      await deleteDelMembertAsync({projectId,userId})
    }

  }
  const handleType = async(e:React.ChangeEvent<HTMLSelectElement>)=>{
      let data ={
        taskId: _id,
        status: e.currentTarget.value
      }
      await mutateAsync(data)
  }
  const handleSave = async()=>{
    let data ={
      taskName: value,
      taskId: _id,
      status
    }
    await mutateAsync(data)
  }
  const handleSubmit = async(e:React.KeyboardEvent<HTMLTextAreaElement>) =>{
    let data = {comment,task: _id}
    if(e.key==="Enter"){
        await addCommentAsync(data)
        setComment('')
    }
  }
  const checkFileSize = (file: File) => {
    const fileType = ['image/png','image/jpg','image/jpeg']
    if(!fileType.includes(file.type)){
      alert("Type not correct")
      return false
    }
   
    let fileSize = 1024*1024*1
    if(Math.round((file.size / fileSize)*10) > 10){
        alert('file too big')
        return false;
    }
    return true;
  
  }
  const uploadSuccess = async(data_url:{[key:string]:string},file:File) =>{
    const {url} = data_url
    console.log(url,"上傳成功",file)
    await addPhotoAsync({img_url:url,projectId:_id})
  }
  const uploadFailed = (msg:any) =>{
    console.log(msg)
  }
  // For Edit Mode 要顯示
  useEffect(()=>{
    setValue(taskName || "")
    return () =>{
      setValue('')
      setOpen(false)
    }
  },[taskName])
  const apiUrl = process.env.REACT_APP_API_URL;
  return (<Modal show={taskModalOpen} onHide={close} size='xl'>
    <Modal.Header className='d-flex justify-content-between align-items-center'>
          <h1 className='font-color mb-0'>
            STICKERS
          </h1>
          <select value={status} onChange={(e)=>{handleType(e)}} className="form-select form-select-sm w-25 font-color" aria-label=".form-select-lg example">
            <option value="idle">idle</option>
            <option value="ongoing">ongoing</option>
            <option value="done">done</option>
          </select>
    </Modal.Header>
    <Container>
      <Row className='flex-wrap'>
      {isLoading?
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>:
        null
      } 
      <Col sm='12' lg='7'>
      <Modal.Body>
      <div className='divider'>
        <div><span className='text-secondary fs-6'>任務名:</span></div>
        {!open?
          <h1 className='fs-2' onClick={()=>setOpen(!open)}>{taskName || ''}</h1>:
          <div>
            <textarea 
              value={value} 
              onChange={(e)=> setValue(e.target.value)} 
              className="text-modal w-100" 
            />
            <div className='d-flex justify-content-end mt-2'>
              <button 
                className='btn btn-outline-primary' 
                onClick={()=>setOpen(!open)}>Cancel
              </button>
              <button 
                className='btn btn-primary ms-2 text-white' 
                onClick={handleSave}>Save
              </button>
            </div>
          </div>
        }
      </div>
        </Modal.Body>
        <Modal.Body>
        <div className='divider'>
          <div><span className='text-secondary fs-6'>創建者:</span></div>
          <div>{taskCreator?.name}</div>
        </div>
        </Modal.Body>
        <Modal.Body>
        <div className='divider'>
          <div><span className='text-secondary fs-6'>代辦清單:</span></div>
          <TodoList TaskId={TaskId} taskTodoList={taskTodoList || []} />
        </div>
        </Modal.Body>
      </Col>
      <Col sm='12' lg='5'>
        <Modal.Body>
          <div>
            <div className='d-flex align-items-center'>
              <span className='text-secondary'>處理人員</span>
              <SelectPerson projectId={_id as string} />
            </div>
          <ul className='d-flex align-items-center justify-content-start list-unstyled mt-2 mb-0'>
            {memberList?.member?.map(x=>{
              return (
                <li 
                  key={x._id} 
                  className='position-relative mx-1 d-flex align-items-center justify-content-center avatar-img Icon-border rounded-circle'
                  onMouseEnter={() => mouseEvent(x.name)}
                  onMouseLeave={() => mouseEvent('')}
                >
                {x.photo?
                  <img src={x.photo} className="rounded-circle" alt="avatar" />
                : <Icon
                    theme='dark' 
                    size='2x'
                    className='p-1'  
                    icon='person-circle-question' />
                }
                <div 
                  className='member-delete' 
                  style={{cursor:'pointer'}}
                  onClick={()=> handleDeleteMember({projectId:_id as string , userId: x._id})}
                >
                </div>
              </li>)
            })}
          </ul>
          <div className='text-warning mb-1' style={{height:20}}>{member !== ''&& memberList && memberList.member?.length>0? member:null}</div>
          </div>
        <div>
          <span className='text-secondary'>照片上傳</span>
          <UploadFile
            action={`${apiUrl}/user/uploadImg`} 
            onProgress={(e)=>console.log(e)} 
            beforeUpload={checkFileSize}
            accept='.jpg,.jpeg,.png'
            multiple={false}
            headers={{Authorization: user?.token? `Bearer ${user?.token}` : ''}}
            onSuccess={uploadSuccess}
            onError={uploadFailed}
            photoList={photoList}
          />
        </div>
        <div>
        <span className='text-secondary'>討論</span>
        <div className='mt-2'> 
        {
          comments?.map(item=>{
            return (
              <div key={item._id}>
                <Comment task={_id as string} {...item} />
              </div>
            )
          })
        }
        </div>
        <textarea 
          value={comment}
          placeholder='輸入評論'
          className='form-control text-addItem mt-3'
          onChange={(e)=> setComment(e.target.value)}
          onKeyPress={(e)=>handleSubmit(e)}
        >
        </textarea>
        </div>
        </Modal.Body>
      </Col>
      </Row>
    </Container>
    </Modal>)
}