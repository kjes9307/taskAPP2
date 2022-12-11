import { useState } from "react";
import {Container, Row, Col } from 'react-bootstrap';
import {UnAuthFooter} from 'component/unauth-footer';
import LoginForm from "unauth/login";
import RegisterForm from "unauth/register";

const MemberForm = () => {
    const [mode,setMode] = useState(false);
    const setModeChange = () =>{
        setMode(!mode)
    }
    return (
      <div style={{height:'100vh'}} className='d-flex align-items-center App-background'>
      <Container>
        <Row>
          <Col>
            {!mode?<LoginForm setMode={setModeChange} /> : <RegisterForm setMode={setModeChange} />}
          </Col>
        </Row>
        <UnAuthFooter />
      </Container>
      </div>
    );
  };

export default MemberForm;