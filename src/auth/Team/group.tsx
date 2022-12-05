import {Col,Card,Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {useUserProjectList,useGetReceivinglist} from './util' 
export const Group = () =>{
    const {data} = useUserProjectList()
    const {data:userGroup} =useGetReceivinglist()
    return (
        <Col sm='12' md='10'>
            <h2>建立的項目</h2>
            <div className='d-flex flex-wrap'> 
            {data?.map(x=>(
                <Card key={x._id} className='w-45 ms-2 mt-1'>
                <Card.Body>
                    <span className='text-dark fs-5'>Notes : {x.name}</span>
                    <Card.Subtitle className="text-muted fs-6">{moment(new Date()).format("YYYY.MM.DD HH:mm")}</Card.Subtitle>
                    <Card.Text className='mt-2'>
                        Member of this notes
                    </Card.Text>
                    <Button size='sm' className='p-0'>
                        <Link to={`/task/${x._id}/Event`} className='text-white text-decoration-none px-3'>前往</Link>
                    </Button>
                </Card.Body>
                </Card>
            ))}
            </div>
            <h2 className='mt-2'>被邀請的項目</h2>
             <div className='d-flex flex-wrap'> 
            {userGroup?.map(x=>{
                if(x.status==='check'){
                    return (
                        <Card key={x._id} className='w-45 ms-2 mt-1'>
                        <Card.Body>
                            <span className='text-dark fs-5'>Notes : {x?.projectId.name}</span>
                            <Card.Subtitle className="text-muted fs-6">{moment(x?.updatedAt).format("YYYY.MM.DD HH:mm")}</Card.Subtitle>
                            <Card.Text className='mt-2'>
                                Member of this notes
                            </Card.Text>
                            <Button size='sm' className='p-0'>
                                <Link to={`/task/${x?.projectId._id}/Event`} className='text-white text-decoration-none px-3'>前往</Link>
                            </Button>
                        </Card.Body>
                        </Card>
                    )
                }
                else{
                    return null
                }
            })}
            </div>
        </Col>
    )
}