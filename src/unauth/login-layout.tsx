import { ReactNode,FC } from "react"
import {Container, Row, Col } from 'react-bootstrap';
import {UnAuthFooter} from 'component/unauth-footer';

interface PropsType{
    children : ReactNode
}
export const MainLayout:FC<PropsType> = ({children}) =>{
    return (
    <div style={{height:'100vh'}} className='d-flex align-items-center App-background'>
        <Container>
            <Row>
                <Col>
                <div className="member-form p-4">
                    {children}
                </div>
                </Col>
            </Row>
        <UnAuthFooter />
        </Container>
    </div>
    )

}