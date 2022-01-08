import React from 'react'
import { Button, Card, Form, Nav, Tab } from 'react-bootstrap'
import AlertMsg from '../../components/AlertMsg'

export default function TwoFactorChallenge(props) {

    const [data,setData] = React.useState({
        csrf : document.getElementsByName('csrf-token')[0].content,
        recovery_code : ``,
        code : ``
    });

    React.useEffect(() => {
    }, [props]);
    return (
        <Card.Body>
            <div className="auth-brand text-center text-lg-start">
                <h4 className="h3 text-center">Inventory Management System</h4>

                <Card>
                    <Card.Header>
                        <Card.Title>2-Step Verification</Card.Title>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Tab.Container defaultActiveKey="authenticatorApplication">

                            <Nav variant="pills" as="ul" className="bg-nav-pills nav-justified mb-0">

                                <Nav.Item>
                                    <Nav.Link eventKey="authenticatorApplication">Authenticator</Nav.Link>
                                </Nav.Item>

                                <Nav.Item>
                                    <Nav.Link eventKey="recoveryCodes">Recovery Codes</Nav.Link>
                                </Nav.Item>

                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="authenticatorApplication">
                                    <div className="p-2">
                                        <AlertMsg type="success" msg="Please confirm access to your account by entering the authentication code provided by your authenticator application." />
                                        
                                        <Form action="/two-factor-challenge" method="post">
                                            <input name="_token" type="hidden" value={data.csrf} />
                                            <Form.Group className="mb-2" controlId="code">
                                                <Form.Control
                                                    type="text" 
                                                    name="code"
                                                    required 
                                                    defaultValue={data.recovery_code}
                                                />
                                            </Form.Group>

                                            <div className="d-grid mb-0 mt-3 text-center">
                                                <Button className="btn btn-primary" type="submit">
                                                    <i className="mdi mdi-login"></i> Log In 
                                                </Button>
                                            </div>
                                            
                                        </Form>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="recoveryCodes">
                                    <div className="p-2">
                                        <AlertMsg type="success" msg="Please confirm access to your account by entering one of your emergency recovery codes." />

                                        <Form action="/two-factor-challenge" method="post">
                                            <input name="_token" type="hidden" value={data.csrf} />
                                            
                                            <Form.Group className="mb-2" controlId="recovery_code">
                                                <Form.Control
                                                    type="text" 
                                                    name="recovery_code" 
                                                    required 
                                                    defaultValue={data.code}
                                                />
                                            </Form.Group>

                                            <div className="d-grid mb-0 mt-3 text-center">
                                                <Button className="btn btn-primary" type="submit">
                                                    <i className="mdi mdi-login"></i> Log In 
                                                </Button>
                                            </div>

                                        </Form>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                            
                        </Tab.Container>
                    </Card.Body>
                </Card>
            </div>
        </Card.Body>
    )
}
