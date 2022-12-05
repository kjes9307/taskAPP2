import {Container,Row,Col} from 'react-bootstrap'
import { Outlet } from 'react-router'
import { Link } from 'react-router-dom'
import Icon from 'component/Icon'
export const TeamUp =() =>{
    return (
        <Container>
            <Row className='team-board-overflow'>
                <Col sm='12' md='2' className='mb-2'>
                <h2 className='font-color fs-4 text-left'>Group</h2>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link to='group' className='text-decoration-none'>
                            <Icon icon='user-group' /> Your Group              
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link to='invites' className='text-decoration-none'>
                            <Icon icon='id-card' /> Pending invites
                        </Link></li>
                </ul>
                </Col>
                <Outlet />
            </Row>
        </Container>
    )
}