import { Outlet } from "react-router";
import { ReactQueryDevtools } from 'react-query/devtools'
import { ProjectModal,DeleteNote } from "component/modal"
import { Container } from 'react-bootstrap';
import PageLayout from 'auth/pageLayout';
export const Main =() =>{
    return (
        <PageLayout>
            <Container fluid>
                <Outlet />
            </Container>
            <ProjectModal projectModalOpen={false} />
            <DeleteNote deleteModalOpen={false} />
            <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </PageLayout>
    )
}