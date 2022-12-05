import { useState, useEffect} from 'react'
import { Toast } from 'react-bootstrap'
import { CommentProp , useEditComment , useDeleteComment } from './util';
import { useDebounce } from 'utils'
import { useAuth } from 'context/userContext';
import Icon from "component/Icon"
export const Comment = (props:CommentProp) =>{
    const {user,comment,_id:postid} = props
    const {user:userInfo} = useAuth()
    const [mode,setEdit] = useState(false)
    const [newcomment,setComment] = useState<string|null>(null)
    const commentValue=useDebounce(newcomment,800)
    const {mutateAsync:editCommentAsync}=useEditComment()
    const {mutateAsync:deleteCommentAsync}=useDeleteComment()
    const handComment = async() =>{
        await editCommentAsync({ 
          comment: commentValue as string ,
          postid: postid 
        })
    }
    const deleteComment = async() => {
      await deleteCommentAsync({postid})
    }
    useEffect(()=>{
      setComment(comment)
      setEdit(false)
      return ()=>{
        setComment(null)
      }
    },[])
    useEffect(()=>{
        if(commentValue){
          handComment()
        }
      },[commentValue])
    return(
        <div className='d-flex align-items-start mt-2'>
        {user.photo?
         <img src={user.photo} className="rounded-circle comment-avatar" alt="avatar" />:
         <img src='/images/joe-shields-dLij9K4ObYY-unsplash.jpg' className="rounded-circle comment-avatar" alt="avatar" />
        }
          <Toast className='w-100 border shadow-none position-relative ms-3'>
            <Toast.Header closeButton={false}>
              <strong className="me-auto fs-6">{user.name}</strong>
              <small>11mins ago</small>
            </Toast.Header>
            <Toast.Body>
              {mode === false?
                <div className='d-flex justify-content-between align-items-center'>
                  <span onClick={()=> {if(userInfo?.id === user._id )setEdit(true)}}>{comment}</span>
                  {
                    userInfo?.id === user._id 
                      &&
                    <Icon 
                      icon='x' 
                      className="opacity-0 mouseHover"                   
                      style={{cursor:"pointer"}}
                      onClick={deleteComment}
                    />
                  } 
                </div>
                :
                <textarea 
                  className='border-0 border-bottom input-outline w-100 text-addItem' 
                  value={newcomment || ''} 
                  autoFocus
                  onBlur={()=>setEdit(false)} 
                  onChange={(e)=> setComment(e.target.value)}
                  onKeyDown={(e)=>{
                    if(e.key==="Enter"){
                      setEdit(false)
                    }
                  }}
                />
              }
            </Toast.Body>
            <div className='triangle'></div>
          </Toast>
        </div>
    )
}