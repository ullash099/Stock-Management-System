import React from 'react'
import axios from 'axios'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import BtnSaving from '../../../components/BtnSaving'
import { AppUrl, ShowToast } from '../../../Context'

export default function CompanyProfile(props) {
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [data,setData] = React.useState({
        company_name : ``,
        company_phone : ``,
        company_email : ``,
        company_address : ``
    })

    const handelSaveData = async () => {
        setSavingInfo(true);
        const formData = new FormData()
        formData.append('company_name', data.company_name)
        formData.append('company_phone', data.company_phone)
        formData.append('company_email', data.company_email)
        formData.append('company_address', data.company_address)

        await axios.post(AppUrl(`/secure/settings/save-profile-company-info`),data)
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
                props.onSaveData()
            }
            setSavingInfo(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        })
    }

    React.useEffect(() => {
        let settings = props.settings
        setData({
            ...data,
            company_name :  settings.company_name ? settings.company_name : ``,
            company_phone :  settings.company_phone ? settings.company_phone : ``,
            company_email :  settings.company_email ? settings.company_email : ``,
            company_address : settings.company_address ? settings.company_address : ``
        })
    }, [props]);

    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col>
                        <Form.Group className="mb-2" controlId="company_name">
                            <Form.Label className="m-0">Company Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text"
                                required
                                value={data.company_name} 
                                onChange={
                                    e => {
                                        setData({
                                            ...data,
                                            company_name : e.target.value
                                        })
                                    }
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="company_phone">
                            <Form.Label className="m-0">Company Phone <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text"
                                required
                                value={data.company_phone} 
                                onChange={
                                    e => {
                                        setData({
                                            ...data,
                                            company_phone : e.target.value
                                        })
                                    }
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="company_email">
                            <Form.Label className="m-0">Company Email</Form.Label>
                            <Form.Control type="text"
                                value={data.company_email} 
                                onChange={
                                    e => {
                                        setData({
                                            ...data,
                                            company_email : e.target.value
                                        })
                                    }
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2" controlId="company_address">
                            <Form.Label className="m-0">Company Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" style={{ height: "180px", resize: "none" }}
                                as="textarea"
                                value={data.company_address} 
                                onChange={
                                    e => {
                                        setData({
                                            ...data,
                                            company_address : e.target.value
                                        })
                                    }
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer>
                {
                    !isSavingInfo ? (
                        <Button 
                            variant="primary" 
                            className="float-end"
                            onClick={handelSaveData.bind(this)}
                        >
                            Save
                        </Button>
                    ):(
                        <BtnSaving variant="primary" text="Saving..." />
                    )
                }
            </Card.Footer>
        </Card>
    )
}
