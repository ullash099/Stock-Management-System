import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import AlertMsg from '../../components/AlertMsg'
import { ShowToast } from '../../Context'
import { ToastContainer } from 'react-toastify'

export default function ForgotPassword(props) {
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [formData,setFormData] = React.useState({
        email : ``
    })

    const handelForgotPassword = async () => {
        setSavingInfo(true);
        const data = new FormData()
        data.append('email', formData.email)
        await axios.post('/forgot-password',data)
        .then(function (response) {
            
            if(response.status == 200){
                ShowToast({
                    type : 'success',
                    msg  : 'your password has reseted'
                })
            }
            setSavingInfo(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 422'){
                setSavingInfo(false);
                ShowToast({
                    type : 'error',
                    msg  : 'Wrong information'
                })
            }
        });
    }

    return (
        <Card.Body>
            <div className="auth-brand text-center text-lg-start">
                <h4 className="h3 text-center">Inventory Management System</h4>

                <AlertMsg type="success" msg="Forgot your password?
                    No problem. Just let us know your email address and we will email you a password 
                    reset link that will allow you to choose a new one." 
                />

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
                            defaultValue={formData.email}
                            onChange={e=>{
                                setFormData({
                                    ...formData,
                                    email : e.target.value
                                })
                            }}
                        />
                    </InputGroup>
                </Form.Group>

                {
                    !isSavingInfo ? 
                    (
                        <Button 
                            className='w-100'
                            onClick={handelForgotPassword.bind(this)}
                        >
                            Send reset link
                        </Button>
                    )
                    :(
                        <Button  
                            className='w-100'
                            variant="primary"
                            disabled
                        >
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Sending Email...
                        </Button>
                    )
                }

                <h4 className="text-center my-2">OR</h4>

                <Link to="/login" className="w-100 btn btn-primary">
                    Login
                </Link>

            </div>
            <ToastContainer />
        </Card.Body>
    )
}
