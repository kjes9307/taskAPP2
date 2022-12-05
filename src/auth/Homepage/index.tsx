import {Container, Row, Col, Form , InputGroup } from 'react-bootstrap';
import { useState }  from 'react'
import { useNavigate } from "react-router-dom";
import { useDebounce  } from 'utils';
import { useProjectsSearchParams } from 'utils/url';
import { useProject } from 'utils/project';
import {useUserInfo} from 'utils/user';
import {useProjectModal} from 'component/useModal'
import {DataType,ItemProps,IfuncProps} from 'utils/type';
import Icon from 'component/Icon'
import "./style.scss"
export const SearchItem =(props:IfuncProps) =>{
    const [search,setOpen] = useState(false)
    const {open}=useProjectModal()
    const setSearchParam = (value:string) =>{
        props.searchItem({...props.param,name: value})
    }
    return (
        <section className='py-1'>
            <Container fluid='md' >
                <Row >
                    <Col md='5' className='d-flex align-items-center'>
                    <h3 className='font-color'>Note</h3>
                    <span onClick={open} style={{cursor:"pointer"}} className="material-symbols-outlined ms-3">
                        add
                    </span>
                    <span onClick={()=>{setOpen(!search);setSearchParam('')}} style={{cursor:"pointer"}} className="material-symbols-outlined ms-3">
                            search
                    </span>
                    {/* value: 預設值 刷新的時候 不會反白  */}
                    <Form.Select 
                        value={props.param.personId? props.param.personId : '0'} 
                        aria-label="Default select example" className='ms-3 font-color' 
                        onChange={(e)=>props.searchItem({...props.param,personId: e.target.value ==='0'? undefined : e.target.value })}
                    >
                    <option value={'0'}>建立者</option>
                    {
                        props.userList?.map(i=>(
                            <option value={i._id} key={i._id}>{i.name}</option>
                        )) || <option key='1'>未知</option>
                    }
                    </Form.Select>
                    </Col>
                    <Col md='7' className='d-flex align-items-center'>
                        { search ? 
                        <InputGroup>
                            <Form.Control
                                placeholder="Search Task"
                                onChange={(e)=> setSearchParam(e.currentTarget.value)}
                            />
                        </InputGroup>
                        : null}
                    </Col>
                </Row>
            </Container> 
        </section>
    )
}
export const ContainBox =(props: DataType) =>{
    const {todoList,userList} =props
    return (
            <Row className='note-board-overflow'>
            {
                todoList?.length !== 0 ? todoList?.map((item,idx)=>{
                    
                    return (
                        <ContainItem 
                            item={item} 
                            key={item._id}
                            index={idx}
                            creator = {userList?.find(x=> x._id === item.personId)?.name || '未知'}
                        />
                    )
                })
                :null
            }
            </Row>
    )
}
export const ContainItem = (props:ItemProps) =>{
    const {item,index,creator} =props
    const [open,setOpen] = useState(false);
    const {starEdit,starDelete}=useProjectModal()
    const navigate = useNavigate();
    const onHandleLink = (id:string) =>{
        if(id){
            navigate(`task/${id}/Event`)
        }
    }
    return (
        <Col sm='6' md='4' lg='4'>
        <div className="namecard mt-3">
            <h2 className="name">{item?.name}
            <span>(#{index as number +1})</span>
            </h2>
            <h5 className="grad">{creator}</h5>
            <p></p>
            <div className="function-panel">
                <Icon icon='heart' />
                <Icon icon='trash' onClick={()=> starDelete(item?._id || '')}  />
                <Icon icon='pen' 
                      onClick={()=> starEdit(item?._id || '')} 
                      className='editCard'
                      style={{cursor:"pointer"}}
                />
                {!open?
                <Icon icon='door-closed' onMouseEnter={()=>setOpen(!open)} />:
                <Icon 
                    icon='door-open' 
                    onMouseLeave={()=>setOpen(!open)} 
                    onClick={()=> onHandleLink(item?._id as string)}
                    style={{cursor:"pointer"}}
                />
                }
            </div>
            <div className="circle c1"></div>
            <div className="circle c2"></div>
        </div>
        </Col>
    )
}
export const Task = () =>{
    const [param,setParam] = useProjectsSearchParams()
    const {data:todo} = useProject(useDebounce(param,1000))
    const {data:userList} = useUserInfo();
    const searchItem = (newObj:{name?:string,personId?:string}) =>{
        setParam(newObj);
    }
    return (
        <>
        <Container fluid="md">  
        <SearchItem userList={userList || []} searchItem={searchItem} param={param} />
        <ContainBox todoList={todo || []} userList={userList|| []} />      
        </Container>
        </>
    )
}