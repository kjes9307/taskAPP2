import {Container} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router'
import PageLayout from 'auth/pageLayout';
export const Board = ()=>{
  return (
    <PageLayout>
    <Container fluid='md'>
    <Link to='/team'>隊伍</Link>
    <Link to="Event" className='ms-3'>看板</Link>
    </Container>
    <Outlet />
    </PageLayout>
  )
}