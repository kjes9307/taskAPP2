import { ReactQueryDevtools } from 'react-query/devtools'
import { Route, Routes } from "react-router";
import { Container,Row, Col } from 'react-bootstrap';
import { ProjectModal,DeleteNote } from "component/modal"

import {AuthHeader} from 'component/auth-header';
import {Task} from 'auth/Homepage'
import {Board} from 'auth/board'
import {Epic} from 'auth/epic'
import {TaskBoard} from 'auth/TaskBoard'
import {TeamUp} from 'auth/Team';
import {Group} from 'auth/Team/group'
import {Invites} from 'auth/Team/invite'
import {IconName} from '@fortawesome/fontawesome-common-types';

import Icon from 'component/Icon';
import { useState } from 'react';
export const Main =() =>{
    const [colapse,setColapse] = useState(false)
    let array:{name:string,icon:IconName}[] = [
        {name:'project',icon:'diagram-project'},
        {name:'member',icon:"user"},
        {name:"invite",icon:"envelope"}
    ]
    return (
        <>
            <AuthHeader />
            <Container fluid>
                <Row>
                <Col xs='2'>
                <ul className={`sidebar list-unstyled text-white position-relative border ${!colapse?'w-150':'w-40'}`}>
                    {array?.map(i=>{return(
                        <li key={i.name} className={`p-2 mt-3 mouseIn d-flex ${!colapse ? 'justify-content-start':'justify-content-center'} align-items-center`}>
                            <Icon icon={i.icon} color='white' size='1x' className={!colapse ?'ms-2 me-3' :''} />
                            { !colapse &&<p className='text-size mb-0'>{i.name}</p> }
                        </li>
                    )})}
                    <Icon 
                        onClick={()=>setColapse(!colapse)} 
                        icon={!colapse?'square-caret-left':'square-caret-right'} 
                        color='white' 
                        size='1x' 
                        className='position-absolute top-0 start-100 translate-middle mt-2' 
                    />
                </ul>
                </Col>
                <Col xs='10'>
                <Routes>
                    <Route index element={<Task />} ></Route>
                    <Route path='task/:id' element={<Board />}>
                        <Route path='Epic' element={<Epic />} />
                        <Route path='Event' element={<TaskBoard />} /> 
                        <Route index element={<TaskBoard />} />
                    </Route>
                    <Route path='team' element={<TeamUp />}>
                        <Route path='group' element={<Group />} />
                        <Route path='invites' element={<Invites />} />
                        <Route index element={<Group />} />
                    </Route>
                </Routes>
                </Col>
                </Row>
            </Container>
            <ProjectModal projectModalOpen={false} />
            <DeleteNote deleteModalOpen={false} />
            <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </>
    )
}