import {Container, Nav ,Navbar ,NavDropdown} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useAuth } from 'context/userContext';

export const AuthHeader = () =>{
    const {user,appLogout} = useAuth()
    return (
    <>
    <Navbar bg="white" expand="lg" className="mb-md-3">
      <Container fluid="md" >
        <Link to="/" className='text-decoration-none brand-color bg-brand-font fs-2'>DETAILS</Link>
        <Navbar.Toggle aria-controls="navbarScroll" className='border-0 fas fa-bars fa-2x brand-color' />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <NavDropdown title={user?.name} id="navbarScrollingDropdown" className='text-secondary customize ms-lg-3 fs-6'>
              <NavDropdown.Item href="#action2" className='text-secondary fs-6'>會員資料</NavDropdown.Item>
              <Link to="/" className='text-decoration-none text-secondary fs-6 dropdown-item'>主頁</Link>
              <Link to="/team" className='text-decoration-none text-secondary fs-6 dropdown-item'>組隊</Link>
              <NavDropdown.Item className='text-secondary fs-6' onClick={appLogout}>登出</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
    )
}