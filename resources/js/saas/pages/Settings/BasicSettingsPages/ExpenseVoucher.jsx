import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import BtnSaving from '../../../components/BtnSaving'
import { AppUrl, ShowToast } from '../../../Context'

export default function ExpenseVoucher(props) {
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const pageSize = [
        { value: 'pos', label: 'POS' },
        { value: 'a4', label: 'A4' }
    ]

    const [data,setData] = React.useState({
        expense_voucher_print_layout : ``,
        expense_voucher_font_size : 10,
        expense_voucher_footer_note : ``
    })
    
    const handelSaveData = async () => {
        setSavingInfo(true);
        const formData = new FormData()

        formData.append('expense_voucher_print_layout', data.expense_voucher_print_layout)
        formData.append('expense_voucher_font_size', data.expense_voucher_font_size.toString())
        formData.append('expense_voucher_footer_note', data.expense_voucher_footer_note)

        await axios.post(AppUrl(`/secure/settings/save-expense-voucher-layout-info`),data)
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
            expense_voucher_print_layout :  settings.expense_voucher_print_layout ? settings.income_voucher_print_layout : 'a4',
            expense_voucher_font_size :  settings.expense_voucher_font_size ? settings.expense_voucher_font_size : 10,
            expense_voucher_footer_note :  settings.expense_voucher_footer_note ? settings.expense_voucher_footer_note : ``
        })
    }, [props]);

    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col md={6} sm={12}>
                        <Form.Group className="mb-2" controlId="expense_voucher_print_layout">
                            <Form.Label className="m-0">Print Layout <span className="text-danger">*</span></Form.Label>
                            <Select
                                value={pageSize.filter(
                                    option => (data.expense_voucher_print_layout && option.value.toString() === (data.expense_voucher_print_layout).toString())
                                )}
                                required
                                isClearable
                                options={pageSize}
                                onChange={
                                    option => {
                                        setData({
                                            ...data,
                                            expense_voucher_print_layout : option ? option.value.toString() : 'a4'
                                        })
                                    }
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} sm={12}>
                        <Form.Group className="mb-2" controlId="expense_voucher_font_size">
                            <Form.Label className="m-0">Font Size <span className="text-danger">*</span></Form.Label>
                            <InputGroup>
                                <Form.Control type="number"
                                    min={5} max={99} step="any"
                                    value={data.expense_voucher_font_size} 
                                    onChange={
                                        e => {
                                            let min = e.target.min;
                                            let max = e.target.max;
                                            let value = parseFloat(e.target.value);
                                            let font_size = min;
                                            
                                            if(value < min){
                                                font_size = min
                                            }
                                            else if(value > max){
                                                font_size = max
                                            }
                                            else{
                                                if(value){
                                                    font_size = value
                                                }
                                                else{
                                                    font_size = min
                                                }
                                            }
                                            setData({
                                                ...data,
                                                expense_voucher_font_size : font_size
                                            })
                                        }
                                    }
                                />
                                <InputGroup.Text>pt</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-2" controlId="expense_voucher_footer_note">
                    <Form.Label className="m-0">Footer Note</Form.Label>
                    <Form.Control type="text" style={{ height: "80px", resize: "none" }}
                        as="textarea"
                        value={data.expense_voucher_footer_note} 
                        onChange={
                            e => {
                                setData({
                                    ...data,
                                    expense_voucher_footer_note : e.target.value
                                })
                            }
                        }
                    />
                </Form.Group>
            </Card.Body>
            <Card.Footer>
                {
                    !isSavingInfo ? (
                        <Button variant="primary" className="float-end" 
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
