import React from 'react'
import { Button, Card, Col, Form, ListGroup, Modal, Nav, Row, Tab  } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify';
import { AppUrl, ShowToast } from '../../Context'
import BtnSaving from '../../components/BtnSaving'
import Loading from '../../components/Loading'
import axios from 'axios'
import AlertMsg from '../../components/AlertMsg';

export default function MyAccount(props) {
    const [data,setData] = React.useState({
        name : ``,
        email : ``,
        phone : ``,
        address : ``,
        role_id : ``,
        role : ``,
        permissions : ``,
        photo : ``,
        sessions : {},
        two_factor : {},
        loading: true
    });

    const GetUserInfo = async () => {
        await axios.get(AppUrl(`/secure/my-info`))
        .then(response => {
            let info = response.data
            setData({
                ...data,
                loading: false,
                name : info.name,
                email : info.email,
                phone : info.phone,
                address : info.address,
                role_id : info.role_id,
                role : info.role,
                permissions : info.permissions,
                photo : info.photo,
                sessions : info.sessions,
                two_factor : info.two_factor,
            });
            setProfileInfo({
                ...profileInfo,
                name : info.name,
                email : info.email,
            })
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    //profile update start
    const [selectedFile, setSelectedFile] = React.useState();
    const [isSavingProfileInfo, savingProfileInfo] = React.useState(false);

    const [profileInfo,setProfileInfo] = React.useState({
        name : ``,
        email : ``
    });

    const handelFullName = (e) => {
        setProfileInfo({
            ...profileInfo,
            name : e.target.value
        })
    }
    
    const handelEmail = (e) => {
        setProfileInfo({
            ...profileInfo,
            email : e.target.value
        })
    }

    const handelSelectFile = (e) => {
        const file = e.target.files[0];

        if (file && file.size > 1048576){
            ShowToast({
                type : 'error',
                msg  : `File size cannot exceed more than 1MB`
            });
            setSelectedFile(null);
            e.target.value = null;
        }
        else{
            setSelectedFile(file);
        }
    }

    const handelUpdateUserInfo = async () => {
        savingProfileInfo(true);
        const data = new FormData()
        data.append('name', profileInfo.name)
        data.append('email', profileInfo.email)
        data.append('file', selectedFile)

        await axios.post(AppUrl(`/secure/user/profile-information`),data)
        .then(function (response) {
            let info = response.data;
            if(info.errors){
                (info.errors).map((error,i)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
            else if(info.success){
                location.reload()
            }
            savingProfileInfo(false)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }
    //profile update end

    //password update start 
    const [isSavingPassword,savingPassword] = React.useState(false);
    const [password,setPassword] = React.useState({
        current_password : ``,
        password : ``,
        password_confirmation : ``
    })

    const handelCurrentPassword = (e) => {
        setPassword({
            ...password,
            current_password : e.target.value
        })
    }

    const handelPassword = (e) => {
        setPassword({
            ...password,
            password : e.target.value
        })
    }
    
    const handelPasswordConfirmation = (e) => {
        setPassword({
            ...password,
            password_confirmation : e.target.value
        })
    }

    const handelUpdatePassword = async () => {
        savingPassword(true);
        const data = new FormData()
        data.append('current_password', password.current_password)
        data.append('password', password.password)
        data.append('password_confirmation', password.password_confirmation)

        await axios.post(AppUrl(`/secure/user/update-password`),data)
        .then(function (response) {
            let info = response.data;
            if(info.errors){
                (info.errors).map((error,i)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
            else if(info.success){
                setPassword({
                    ...password,
                    current_password : ``,
                    password : ``,
                    password_confirmation : ``
                })
                ShowToast({
                    type : 'success',
                    msg  : info.success
                })
            }
            savingPassword(false)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }
    //password update end

    //Enable Two Factor Secret start
    const [isSavingTwoFactorSecret,savingTwoFactorSecret] = React.useState(false);
    const handelEnableTwoFactorSecret = async () => {
        savingTwoFactorSecret(true);
        await axios.post(AppUrl(`/secure/user/two-factor-authentication`))
        .then(function (response) {
            let info = response.data;
            if(info.errors){
                (info.errors).map((error,i)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
            else if(info.success){
                ShowToast({
                    type : 'success',
                    msg  : info.success
                })
                GetUserInfo()
            }
            savingTwoFactorSecret(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const [isRegeneratingRecoveryCodes,savingRegenerateRecoveryCodes] = React.useState(false);
    const handelRegeneratingRecoveryCodes = async () => {
        savingRegenerateRecoveryCodes(true);
        await axios.post(AppUrl(`/secure/user/two-factor-recovery-codes`))
        .then(function (response) {
            let info = response.data;
            if(info.errors){
                (info.errors).map((error,i)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
            else if(info.success){
                ShowToast({
                    type : 'success',
                    msg  : info.success
                })
                GetUserInfo()
            }
            savingRegenerateRecoveryCodes(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }
    
    const [isDisablingRecoveryCodes,savingDisableRecoveryCodes] = React.useState(false);
    const handelDisablingRecoveryCodes = async () => {
        savingDisableRecoveryCodes(true);
        await axios.post(AppUrl(`/secure/user/delete-two-factor-authentication`))
        .then(function (response) {
            let info = response.data;
            if(info.errors){
                (info.errors).map((error,i)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
            else if(info.success){
                ShowToast({
                    type : 'success',
                    msg  : info.success
                })
                GetUserInfo()
            }
            savingDisableRecoveryCodes(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }
    //Enable Two Factor Secret end
    
    //Logout Other Browser Sessions start
    const [isConfirmPassModalOpen,setConfirmPassModalOpen] = React.useState(false);
    const [isWorkingOnLogoutOtherSessions,setWorkingOnLogoutOtherSessions] = React.useState(false);
    const [confirmPassForSession,setConfirmPassForSession] = React.useState('');

    const handleModalClose = () => {setConfirmPassModalOpen(false),setConfirmPassForSession('')};
    const handleModalShow = () => setConfirmPassModalOpen(true);

    const handleLogoutOtherBrowserSessions = async () => {
        setWorkingOnLogoutOtherSessions(true);
        await axios.post(AppUrl(`/secure/user/other-browser-sessions`),{password:confirmPassForSession})
        .then(function (response) {
            let info = response.data;
            if(info.errors){
                (info.errors).map((error,i)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
            else if(info.success){
                ShowToast({
                    type : 'success',
                    msg  : info.success
                })
                GetUserInfo()
            }
            setWorkingOnLogoutOtherSessions(false);
            handleModalClose();
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }
    //Logout Other Browser Sessions end

    React.useEffect(() => {
        GetUserInfo();
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col sm={12} md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            {
                                data.loading ? (<Loading />) : 
                                (
                                    <React.Fragment>
                                        {
                                            data.photo ?
                                            (<img src={data.photo} className="rounded-circle avatar-lg img-thumbnail" alt="profile-image" />)
                                            :(``)
                                        }
                                        <h4 className="mb-0 mt-2">{data.name}</h4>
                                        <p className="text-muted font-14">{data.role}</p>
                                        <div className="text-start mt-3">
                                            <p className="text-muted mb-2 font-13">
                                                <strong>Full Name :</strong> 
                                                <span className="ms-2">{data.name}</span>
                                            </p>
                                            
                                            <p className="text-muted mb-2 font-13">
                                                <strong>Email :</strong> 
                                                <span className="ms-2 ">{data.email}</span>
                                            </p>
                                            
                                            {
                                                data.phone ?
                                                (
                                                    <p className="text-muted mb-2 font-13">
                                                        <strong>Phone :</strong> 
                                                        <span className="ms-2 ">{data.phone}</span>
                                                    </p>
                                                )
                                                :(``)
                                            }
                                            {
                                                data.phone ? 
                                                (
                                                    <p className="text-muted mb-2 font-13">
                                                        <strong>Address :</strong> 
                                                        <span className="ms-2 ">{data.address}</span>
                                                    </p>
                                                )
                                                :(``)
                                            }
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={8}>
                    <Card>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="profileInformation">

                                <Nav variant="pills" as="ul" className="bg-nav-pills nav-justified mb-3">

                                    <Nav.Item>
                                        <Nav.Link eventKey="profileInformation">Profile Information</Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link eventKey="updatePassword">Update Password</Nav.Link>
                                    </Nav.Item>

                                    {
                                        data.two_factor.is_two_factor_available ?
                                        (
                                            <Nav.Item>
                                                <Nav.Link eventKey="twoFactor">Two Factor</Nav.Link>
                                            </Nav.Item>
                                        ):(``)
                                    }

                                    <Nav.Item>
                                        <Nav.Link onClick={()=>GetUserInfo()} eventKey="browserSessions">Browser Sessions</Nav.Link>
                                    </Nav.Item>

                                </Nav>

                                <Tab.Content>

                                    <Tab.Pane eventKey="profileInformation">

                                        <AlertMsg type="success" msg="Update your account's profile information and email address." />

                                        <Form.Group className="mb-2" controlId="fullName">
                                            <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" defaultValue={data.name} onKeyUp={handelFullName.bind(this)} />
                                        </Form.Group>

                                        <Form.Group className="mb-2" controlId="email">
                                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" defaultValue={data.email} onKeyUp={handelEmail.bind(this)} />
                                        </Form.Group>

                                        <Form.Group controlId="formFile" className="mb-3">
                                            <Form.Label>Select A New Photo</Form.Label>
                                            <Form.Control accept=".jpg,.png,.jpeg" type="file" 
                                                onChange={handelSelectFile.bind(this)}
                                            />
                                        </Form.Group>

                                        <hr style={{ margin : "1rem -1.5rem" }} />

                                        {
                                            !data.loading ?
                                            (
                                                !isSavingProfileInfo ? 
                                                (<Button variant="primary" onClick={handelUpdateUserInfo.bind(this)} className="float-end">Save</Button>)
                                                :(<BtnSaving variant="primary" text="Saving..." />)
                                            ):(<BtnSaving variant="primary" />)
                                        }

                                    </Tab.Pane>

                                    <Tab.Pane eventKey="updatePassword">

                                        <AlertMsg type="success" msg="Ensure your account is using a long, random password to stay secure." />

                                        <Form.Group className="mb-2" controlId="currentPassword">
                                            <Form.Label>Current Password <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="password" value={password.current_password} onChange={handelCurrentPassword.bind(this)} />
                                        </Form.Group>

                                        <Form.Group className="mb-2" controlId="newPassword">
                                            <Form.Label>New Password <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="password" value={password.password} onChange={handelPassword.bind(this)} />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-2" controlId="confirmPassword">
                                            <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="password" value={password.password_confirmation} onChange={handelPasswordConfirmation.bind(this)} />
                                        </Form.Group>
                                        
                                        <hr style={{ margin : "1rem -1.5rem" }} />

                                        {
                                            !data.loading ?
                                            (
                                                !isSavingPassword ? 
                                                (<Button variant="primary" onClick={handelUpdatePassword.bind(this)} className="float-end">Save</Button>)
                                                :(<BtnSaving variant="primary" text="Saving..." />)
                                            ):(<BtnSaving variant="primary" />)
                                        }
                                    </Tab.Pane>

                                    {
                                        data.two_factor.is_two_factor_available ?
                                        (
                                            <Tab.Pane eventKey="twoFactor">
                                            
                                                <AlertMsg type="success" msg="Add additional security to your account using two factor authentication." />
                                            
                                                <AlertMsg type="secondary" 
                                                    heading={data.two_factor.two_factor_secret ? `You have enabled two factor authentication.` : `You have not enabled two factor authentication.` } 
                                                    msg="When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application." 
                                                />
                                                {
                                                    data.two_factor.two_factor_secret ?
                                                    (
                                                        <React.Fragment>
                                                            <AlertMsg type="primary" msg="Two factor authentication is now enabled. Scan the following QR code using your phone's authenticator application." />
                                                            <div className="text-center my-3" dangerouslySetInnerHTML={{__html: data.two_factor.twoFactorQrCodeSvg}} />
                                                        </React.Fragment>
                                                    )
                                                    :(``)
                                                }
                                                
                                                {
                                                    data.two_factor.two_factor_recovery_codes ?
                                                    (
                                                        <React.Fragment>
                                                            <AlertMsg type="primary" msg="Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost." />

                                                            <ListGroup>
                                                            {
                                                                (data.two_factor.two_factor_recovery_codes).map((code,index)=>(
                                                                    <ListGroup.Item key={index}>{code}</ListGroup.Item>
                                                                ))
                                                            }
                                                            </ListGroup>

                                                        </React.Fragment>
                                                    )
                                                    :(``)
                                                }

                                                <hr style={{ margin : "1rem -1.5rem" }} />

                                                {
                                                    !data.two_factor.two_factor_secret ?
                                                    (
                                                        <React.Fragment>
                                                        {
                                                            !isSavingTwoFactorSecret ? 
                                                            (<Button variant="primary" onClick={handelEnableTwoFactorSecret.bind(this)} className="float-end">Enable</Button>)
                                                            :(<BtnSaving variant="primary" text="Saving..." />)
                                                        }
                                                        </React.Fragment>
                                                    )
                                                    :(
                                                        <React.Fragment>
                                                            {
                                                                !isDisablingRecoveryCodes ? 
                                                                (<Button variant="danger" onClick={handelDisablingRecoveryCodes.bind(this)} className="float-end mx-2">Disable</Button>)
                                                                :(<BtnSaving variant="danger" text="Disabling..." />)
                                                            }
                                                            {
                                                                !isRegeneratingRecoveryCodes ? 
                                                                (<Button variant="secondary" onClick={handelRegeneratingRecoveryCodes.bind(this)} className="float-end">Regenerate Recovery Codes</Button>)
                                                                :(<BtnSaving variant="secondary" text="Regenerating..." />)
                                                            }
                                                        </React.Fragment>
                                                    )
                                                }

                                            </Tab.Pane>
                                        )
                                        :(``)
                                    }

                                    <Tab.Pane eventKey="browserSessions">
                                        
                                        <AlertMsg type="success" msg="Browser Sessions" />

                                        <AlertMsg type="secondary" heading="Manage and logout your active sessions on other browsers and devices." msg="If necessary, you may logout of all of your other browser sessions across all of your devices. If you feel your account has been compromised, you should also update your password." />

                                        {
                                            Object.keys(data.sessions).length > 0 ? 
                                            (                                            
                                                <ListGroup>
                                                {
                                                    (data.sessions).map((session,i)=>(
                                                        <ListGroup.Item key={i} 
                                                            className={session.is_current_device ? `list-group-item-action active` : `list-group-item-action`}
                                                        >
                                                            <div className="d-flex w-100 justify-content-between">
                                                                <h5 className="mb-0">
                                                                    {
                                                                        session.agent.is_desktop ?
                                                                        (<i className="dripicons-device-desktop"></i>)
                                                                        :(<i className="dripicons-device-mobile"></i>)
                                                                    }
                                                                    <span> {session.agent.platform} - {session.agent.browser}</span>
                                                                </h5>
                                                                <small>{session.last_active}</small>
                                                            </div>
                                                            <small>IP Address : {session.ip_address}</small>
                                                        </ListGroup.Item>
                                                    ))
                                                }
                                                </ListGroup>
                                            )
                                            : (``)
                                        }

                                        {
                                            Object.keys(data.sessions).length > 1 ?
                                            (
                                                <React.Fragment>
                                                    <hr style={{ margin : "1rem -1.5rem" }} />

                                                    <Button variant="primary" onClick={handleModalShow.bind(this)} className="float-end">Logout Other Browser Sessions</Button>
                                                </React.Fragment>
                                            )
                                            :(``)
                                        }
                                    
                                    </Tab.Pane>
                                    
                                </Tab.Content>

                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <ToastContainer />

            <Modal show={isConfirmPassModalOpen} onHide={handleModalClose.bind(this)} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Logout Other Browser Sessions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Please enter your password to confirm you would like to logout of your other browser sessions across all of your devices.</strong>

                    <Form.Group className="my-3" controlId="newPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={confirmPassForSession} onChange={(e)=>setConfirmPassForSession(e.target.value)} />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose.bind(this)}>
                        Nevermind
                    </Button>
                    {
                        !isWorkingOnLogoutOtherSessions ? 
                        (<Button variant="primary" onClick={handleLogoutOtherBrowserSessions.bind(this)} className="float-end">Logout Other Browser Sessions</Button>)
                        :(<BtnSaving variant="primary" text="Saving..." />)
                    }
                </Modal.Footer>
            </Modal>

        </React.Fragment>
    )
}
