import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ShowToast } from '../../Context'

export default function ResetPassword(props) {
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [formData,setFormData] = React.useState({
        token : ``,
        email : ``,
        password : ``,
        password_confirmation : ``,
    })

    const handelResetPassword = async () => {
        setSavingInfo(true);
        const data = new FormData()
        data.append('token', formData.token)
        data.append('email', formData.email)
        data.append('password', formData.password)
        data.append('password_confirmation', formData.password_confirmation)
        await axios.post('/reset-password',data)
        .then(function (response) {
            if(response.status == 200){
                ShowToast({
                    type : 'success',
                    msg  : 'verification link has been sent to your email address.'
                })
            }
            setSavingInfo(false)
            setTimeout(() => {
                window.location.href = "/login";
            }, 5000);
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

    React.useEffect(() => {
        let token = props.match.params.slug;
        let email = new URLSearchParams(props.location.search).get("email");

        setFormData({
            token : token,
            email : email,
        })
    }, [props]);

    return (
        <Card.Body>
            <div className="auth-brand text-center text-lg-start">
                <h4 className="h3 text-center">Inventory Management System</h4>
                <h4 className="h3 text-center">Reset Your Password</h4>                

                <Form.Group className="mb-2" controlId="password">
                    <Form.Label className="m-0">Password <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                        type="password" 
                        onChange={
                            e => {
                                setFormData({
                                    ...formData,
                                    password : e.target.value
                                })
                            }
                        }
                    />
                </Form.Group>

                <Form.Group className="mb-2" controlId="password_confirmation">
                    <Form.Label className="m-0">Confirm Password <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                        type="password" 
                        onChange={
                            e => {
                                setFormData({
                                    ...formData,
                                    password_confirmation : e.target.value
                                })
                            }
                        }
                    />
                </Form.Group>

                {
                    !isSavingInfo ? 
                    (
                        <Button 
                            className='w-100'
                            onClick={handelResetPassword.bind(this)}
                        >
                            Reset Password
                        </Button>
                    )
                    :(
                        <Button  
                            className='w-100'
                            variant="primary"
                            disabled
                        >
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Resetting...
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
