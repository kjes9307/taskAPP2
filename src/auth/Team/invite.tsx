import {Col,Card,Button} from 'react-bootstrap'
import { useState,useEffect } from 'react'
import moment from 'moment'
import { SearchComplete,DataSourceType } from 'component/searchComplete'
import { useGetMember, member } from 'component/searchComplete/util'
import { useDebounce } from 'utils'
import Icon from 'component/Icon'
import {useUserProjectList,useAddInvite,useEditInvite,useGetSendinglist,useGetReceivinglist,sendInvite} from './util'
interface UserProps {
    photo?: string;
    name?: string;
    _id?:string;
    currentVal?: string;
    message?:string
}
export const Invites = () =>{
    const [user,setUser] = useState<UserProps[]>([])
    const [dataList,setDataList] = useState<member[]|[]>([])
    const [param,setParam] = useState<string|undefined>(undefined)
    const [ history, setHistory] = useState<string[]>([])
    const devalue = useDebounce(param,700)
    const {data:fetchData,isLoading} = useGetMember(devalue as string) 
    const {data} = useUserProjectList()
    const {mutateAsync:addInviteAsync} = useAddInvite()
    const {mutateAsync:editInviteAsync} = useEditInvite()
    const {data:sendingList}=useGetSendinglist()
    const {data:receivingList}=useGetReceivinglist()
    const renderCustom = (item: DataSourceType<UserProps>) => {
        return (
            <div className="d-flex align-items-center">
            {
            item.photo?
             <img src={item.photo} alt='user-avatar' className="user-avatar test rounded-circle" />
            : 
            <Icon 
                className='Icon-border rounded-circle' 
                icon='circle-question' 
                theme='dark' 
                size='1x' 
                style={{cursor:"pointer"}} 
            />
            }
            <p className="ms-2 mb-0">{item.name}</p>
            </div>
        )
    }
    const handleNoteChange = (e: React.ChangeEvent<HTMLSelectElement>,userInvite :string) =>{
        // console.log("prk",e.target.value,'user',userInvite)
        if(userInvite){
            let updateObj ={
                currentVal : e.target.value
            }
            handleUserChange(userInvite,updateObj)
        }
    }
    const handleUserChange = (userInvite :string,updateObj :Partial<UserProps>) =>{
        setUser(prevState => {
            return prevState.map(x => {
                if (x?._id === userInvite) {
                    // console.log({...x, ...updateObj})
                    return {...x, ...updateObj}
                }else{
                    return x
                }
            })
        })
    }
    const handleAddInvite = (e:DataSourceType<UserProps>) =>{
        const {name,_id,photo} = e ;
        setHistory([...history, _id as string])
        let isDuplicate = user.filter(x=> x._id === _id)
        if(isDuplicate.length < 1){
            const arr = [{name,_id,photo,currentVal:'',message:''}]
            setUser([...user,...arr])
        }
    }
    const handleDeleteList = (inviteId:string) =>{
        if(inviteId){
            setUser(prevState=> prevState.filter(x=> x._id !== inviteId))
        }
    }
    const handInviteSend = async(userId:string) =>{
        if(!userId) return;
        let submit = user?.filter(x=> userId === x?._id)
        if(!submit[0].currentVal){
            let updataObj={
                message: "尚未選擇項目"
            }
            handleUserChange(userId,updataObj)
            return;
        }
        let data:sendInvite = {
            state: "await",
            userId,
            projectId: submit[0].currentVal
        }
        await addInviteAsync({...data})
    }
    const onCheckInvitation = async(inviteId:string,state: 'reject' | 'check') =>{
        await editInviteAsync({inviteId,state})
    }
    const handleSearchChange = (e:string) => setParam(e)
    useEffect(()=>{
        if(fetchData){
            if(history && history.length>0){
                let filterResult = fetchData.filter(x=> history.indexOf(x._id) === -1)
                setDataList(filterResult)
            }else{
                setDataList(fetchData)
            }
        }
    },[fetchData])
    //note-board-overflow
    return (
        <Col sm='12' md='10'>
          <div className='flex-column d-flex justify-content-between gap-12'>  
            <h2>收到的邀請</h2>
            {receivingList&& receivingList?.map(x=>(
                <Card key={x?._id} className='w-45 ms-2 mt-1'>
                    <Card.Body>
                        <div className='d-flex align-items-center mb-2'>
                            <Card.Title className='mb-0'>
                                <img src={x?.sender.photo || '/\images/\joe-shields-dLij9K4ObYY-unsplash.jpg'} alt="test" className='avatar-img' />
                            </Card.Title>
                            <div className='ms-2'>
                                <h4 className='mb-0 font-color'>{x?.sender.name}</h4>
                                <span className='text-dark fs-6 mt-1'>邀請您進入 : {x?.projectId.name}</span>
                            </div>
                        </div>
                        <Card.Subtitle className="text-muted fs-6 mt-2">{moment(x?.createdAt).format("YYYY.MM.DD HH:mm")}</Card.Subtitle>
                        <Card.Text>
                            Hello , i am here to invite you to join our mission.
                        </Card.Text>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div>
                                {x?.status==='await' &&
                                    <div>
                                    <Button className='text-white' onClick={()=>onCheckInvitation(x?._id,'check')}>Accept</Button>
                                    <Button className='text-white ms-2' onClick={()=>onCheckInvitation(x?._id,'reject')}>Reject</Button>
                                    </div>
                                }
                            </div>
                            <div>
                                {x?.status === 'check' && <p className='mb-0 text-success'><Icon icon='check' /> 已加入</p> }
                                {x?.status === 'reject' && <p className='mb-0 text-danger'><Icon icon='x' /> 已拒絕</p>}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
            <Col sm='12' md='8'>
                <div className='d-sm-flex'>
                <h2 className='mb-0'>邀請別人</h2>
                <SearchComplete
                    onSelect={handleAddInvite}
                    renderOption = {renderCustom}
                    icon={!devalue?'magnifying-glass':'x'}
                    className='form-control mt-1'
                    onInputChange={handleSearchChange}
                    fetchResult={dataList || []}
                    isLoading={isLoading}
                    searchKey={devalue}
                />
                </div>
            </Col>
            <div className="flex-wrap d-flex">
                {user.length>0 ? user?.map((x)=> (
                    <Card className='w-45 ms-2 mt-1' key={x._id}>
                        <Card.Body>
                        <div className='d-flex align-items-center mb-2'>
                            <Card.Title className='mb-0'>
                                <img src={x?.photo || '/\images/\joe-shields-dLij9K4ObYY-unsplash.jpg'} alt="test" className='avatar-img' />
                            </Card.Title>
                            <div className='ms-2'>
                                <span className='text-dark fs-6'>{x.name}</span>
                            </div>
                        </div>
                        <Card.Text>     
                            Hello , i am here to invite you to join our mission.
                        </Card.Text>
                        <div>
                            <select className='form-control' onChange={e=>handleNoteChange(e,x?._id || '')}>
                                <option key='' value=''>選擇Note...</option>
                                {data && data?.map(project=>(
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                            {x.message && <p className='text-danger mb-0'>{x.message}</p>}
                            {data?.length ===0 && <p className='text-danger mb-0'>尚未新增Note，無法邀請成員</p>}
                        </div>
                        <div className='mt-2 d-flex'>
                        <Button onClick={()=>handInviteSend(x?._id ||'')} className='text-white'>Invite</Button>
                        <Button onClick={()=>handleDeleteList(x?._id ||'')} className='text-white ms-2'>Cancel</Button>
                        </div>
                        </Card.Body>
                    </Card>
                )):null}
            </div>
            <h2 className='mb-0'>邀請中</h2>
            <div className="flex-wrap d-flex">
                {sendingList&&sendingList?.map(x=>
                    <Card className='w-45 ms-2 mt-1' key={x._id}>
                         <Card.Body>
                        <div className='d-flex align-items-center mb-2'>
                            <Card.Title className='mb-0'>
                                <img src={x?.receiver.photo || '/\images/\joe-shields-dLij9K4ObYY-unsplash.jpg'} alt="test" className='avatar-img' />
                            </Card.Title>
                            <div className='ms-2'>
                                <h4 className='mb-0'>{x?.receiver.name}</h4>
                                <span className='text-dark fs-6'>{x?.projectId.name}</span>
                            </div>
                        </div>
                        <Card.Subtitle className='font-color'>
                                {moment(x?.updatedAt).format("YYYY.MM.DD HH:mm")}
                        </Card.Subtitle>
                        <Card.Text className='text-dark'>     
                            {x.status === 'await' && `Waiting for user's response.`}
                            {x.status === 'reject' && `The invitation has been rejected`}
                            {x.status === 'check' && `This user has joined your Note`}
                        </Card.Text>
                        <div className='mt-2 d-flex'>
                            {x.status === 'await' && <span className='text-dark fs-6'>狀態: 等待中</span>}
                            {x.status === 'reject' && <span className='text-danger fs-6'>狀態: 拒絕</span>}
                            {x.status === 'check' && <span className='text-success fs-6'>狀態: 成功</span>}
                        </div>
                        </Card.Body>
                    </Card>    
                )}
            </div>
          </div>  
        </Col>
    )
}