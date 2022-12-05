import { Container,Row,Col,Button } from "react-bootstrap"
import Icon from "component/Icon"
export const BrandInfo = () =>{
    return (
        <div>
            <header className="sticky-top pt-2">
                <Container>
                    <div className="d-flex justify-content-between align-items-center brand-line">
                        <div className="fs-3 text-gradient">TASK</div>
                        <ul className="d-none d-sm-block d-sm-flex mb-0">
                            <li className="list-unstyled "><a href="#" className="text-decoration-none fs-6 text-white">先看看再決定</a></li>
                            <li className="list-unstyled ms-7"><a href="#" className="text-decoration-none fs-6 text-white">登入</a></li>
                        </ul>
                    </div>
                </Container>
            </header>
            <section>
                <Container>
                    <div className="brand-img d-flex align-items-center justify-content-center">
                        <h2 className="text-center text-white">任務管理工具</h2>
                    </div>
                </Container>
            </section>
            <section>
                <Container>
                    <h2 className="fs-4 text-center text-white mt-2">
                        釋放工作潛能
                    </h2>
                    <Row className="mt-3">
                        <Col>
                            <div className="card card-hover position-relative p-5 d-flex flex-column align-items-center border-0 ">
                                <Icon icon='people-group' size='5x' />
                                <h2 className="card-title mb-0 fs-6 text-start mt-2">團隊協作</h2>
                                <p className="card-text mt-3 fs-7">及時控管團隊狀況，確保產出效率</p>
                            </div>
                        </Col>
                        <Col>
                            <div className="card card-hover position-relative p-5 d-flex flex-column align-items-center border-0 ">
                                <Icon icon='person-digging' size='5x' />
                                <h2 className="card-title mb-0 fs-6 text-start mt-2">敏捷開發</h2>
                                <p className="card-text mt-3 fs-7">免費的線上敏捷服務</p>
                            </div>
                        </Col>
                        <Col>
                            <div className="card p-5 d-flex flex-column align-items-center border-0 ">
                                <Icon icon='cubes' size='5x' />
                                <h2 className="card-title mb-0 fs-6 text-start mt-2">建立良好的工作規範</h2>
                                <p className="card-text mt-3 fs-7">流程化您的工作事項，達到預期產出</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section>
                <Container>
                    <div className="d-flex mt-3 justify-content-center align-items-center brand-img1">
                        <div className="d-flex justify-content-center align-items-center flex-column">
                            <Icon icon='recycle' size='10x' color="purple"/>
                            <Button className="mt-2">試試看</Button>
                        </div>
                        <ul>
                            <li className="list-unstyled">
                                <h3 className="text-white fs-4 text-center">對症下藥，專案製作</h3>
                                <p className="text-white fs-6 text-center opacity-75">
                                    進度安排&個人化<br/>有效管理
                                </p>
                            </li>
                            <li className="list-unstyled">
                                <h3 className="text-white fs-4 text-center">團隊作戰</h3>
                                <p className="text-white fs-6 text-center opacity-75">
                                    針對目標進行客製化安排<br/>快速反應
                                </p>
                            </li>
                        </ul>
                    </div>
                    
                </Container>
            </section>
            <section>
                <Container>
                    <div className="text-center mt-5">
                        <h2 className="text-white fs-3">關於我們的目標</h2>
                        <p className="text-white mt-4 fs-6">致力於適合小型團隊合作的軟體開發<br/>  CopyRight© 2022 僅用於練習使用</p>
                    </div>
                </Container>
            </section> 
        </div>
    )
}