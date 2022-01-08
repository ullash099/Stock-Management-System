import axios from 'axios'
import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import AlertMsg from '../../components/AlertMsg'
import { ShowToast } from '../../Context'

export default function VerifyEmail() {
    const [isSavingInfo,setSavingInfo] = React.useState(false)

    const handelSendEmailVerificationNotification = async () => {
        setSavingInfo(true);
        await axios.post('/email/verification-notification',{})
        .then(function (response) {
            if(response.status == 202){
                ShowToast({
                    type : 'success',
                    msg  : 'verification link has been sent to your email address.'
                })
            }
            setSavingInfo(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }
    return (
        <Card.Body>
            <div className="auth-brand text-center text-lg-start">
                <h4 className="h3 text-center">Inventory Management System</h4>
                <h4 className='text-center h4'>Verify Your Email Address</h4>
                <AlertMsg type="success" msg="Before proceeding, please check your email for a verification link. If you did not receive the email" />
                {
                    !isSavingInfo ? 
                    (
                        <Button 
                            className='w-100'
                            onClick={handelSendEmailVerificationNotification.bind(this)}
                        >
                            click here to request another
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
            </div>
            <ToastContainer />
        </Card.Body>
    )
}
