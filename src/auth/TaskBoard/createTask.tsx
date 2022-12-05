import {useState,useEffect} from 'react';
import {Card,Button } from 'react-bootstrap'
import { useAddTask } from './util';
import Icon from 'component/Icon'
export const CreateTask = (props:{kanbanId:string}) =>{
    const {kanbanId} = props
    const [task,setTask] = useState('')
    const {mutateAsync:asyncAddTask} = useAddTask()
    const [mode,setMode] = useState(false)
    const handleSubmit = async(e:React.KeyboardEvent<HTMLTextAreaElement>) =>{
        if(e.key==="Enter"){
            await asyncAddTask({kanbanId,taskName:task || ''})
            setMode(false);
            setTask('')
        }
    }
    
    useEffect(()=>{
        if(!mode){
            setTask('')
        }
    },[mode])

    if(!mode){
        return (
            <div 
                className='avatar-img rounded-circle d-flex align-items-center justify-content-center mb-2'
                style={{cursor:"pointer",width:30,height:30}}
                onClick={()=>setMode(!mode)}
                >
                <Icon icon='add' className='font-color' />
            </div>
        )
    }

    return (
        <div className='mb-3 mx-2 rounded w-100'>
            <Card style={{ cursor:"pointer" }} >
                <Card.Body>
                    <textarea 
                        value={task} 
                        placeholder="Write something...." 
                        onChange={(e)=> setTask(e.target.value)} 
                        onKeyPress={(e)=>handleSubmit(e)}
                        style={{height:30,maxHeight:60}}
                        className='border-0 border-bottom input-outline'
                    />
                    <div className="d-flex justify-content-end mt-2">
                        <Button className='btn-primary text-white' size='sm' onClick={()=> setMode(!mode)}>close</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}