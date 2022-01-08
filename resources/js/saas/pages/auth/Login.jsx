import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Form, InputGroup  } from 'react-bootstrap'
import {AppUrl} from '../../Context'

export default function Login(props) {
    const [data,setData] = React.useState({
        email: props.oldemail,
        csrf : document.getElementsByName('csrf-token')[0].content,
        isTypePassword : true,
        passwordType : 'password'
    });

    React.useEffect(() => {
    }, [props]);

    return (
        <Card.Body>
            <div className="auth-brand text-center text-lg-start">
                <h4 className="h3 text-center">Inventory Management System</h4>

                <h4 className="h3 mt-4">Sign In</h4>
                <p className="text-muted mb-4">Enter your email address and password to access account.</p>

                <Form action={AppUrl(`/login`)} method="post">
                    <input name="_token" type="hidden" value={data.csrf} />
                    <Form.Group className="mb-2" controlId="email">
                        <Form.Label className="m-0 form-label">Email <span className="text-danger">*</span></Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                <i className="uil uil-envelope"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="email" 
                                name="email" 
                                placeholder="yourname@email.com" 
                                required 
                                defaultValue={data.email ? data.email : ``}
                            />
                        </InputGroup>
                    </Form.Group>
                    
                    <Form.Group className="mb-2" controlId="password">
                        <Link to="/forgot-password" className="text-muted float-end">
                            <small>Forgot your password?</small>
                        </Link>
                        <Form.Label className="m-0 form-label">Password <span className="text-danger">*</span></Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                <i className="uil uil-padlock"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type={data.isTypePassword ? `password` : `text`}
                                name="password" 
                                placeholder="your secret" 
                                required 
                            />
                            <InputGroup.Text onClick={()=>{
                                setData({
                                    ...data,
                                    isTypePassword : !data.isTypePassword
                                })
                            }}>
                                {
                                    data.isTypePassword ? 
                                    (<i className="uil uil-eye-slash"></i>)
                                    :(<i className="uil uil-eye"></i>)
                                }
                            </InputGroup.Text>

                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="remember">
                        <Form.Check
                            label="Keep me signed in"
                            name="remember"
                            type="checkbox"
                        />
                    </Form.Group>

                    <div className="d-grid mb-0 text-center">
                        <Button className="btn btn-primary" type="submit">
                            <i className="mdi mdi-login"></i> Log In 
                        </Button>
                    </div>
                </Form>

            </div>
        </Card.Body>
    )
}