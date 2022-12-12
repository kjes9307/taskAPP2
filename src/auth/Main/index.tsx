import { Outlet } from "react-router";
import { ReactQueryDevtools } from 'react-query/devtools'
import { Container } from 'react-bootstrap';
import PageLayout from 'auth/pageLayout';
export const Main =() =>{
    return (
        <PageLayout>
            <Container fluid>
                <Outlet />
            </Container>
            <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </PageLayout>
    )
}