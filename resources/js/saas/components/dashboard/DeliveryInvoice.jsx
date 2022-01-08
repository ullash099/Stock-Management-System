import React from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { AppUrl, ShowToast } from '../../Context'
import axios from 'axios'
import BtnSaving from '../BtnSaving'
import { Link } from 'react-router-dom'

export default function DeliveryInvoice(props) {
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [isAddNewModalOpen,setAddNewModalOpen] = React.useState(false)
    const [data,setData] = React.useState({
        id : ``,
        company_name : ``,
        company_phone : ``,
        company_email : ``,
        company_address : ``,
        footer_note : ``,
        currency : ``,

        details : {},
        
        invoice_date : ``,
        invoice : ``,
        created_by : ``,

        sub_total : ``,
        vat : ``,
        total : ``,
        advance : ``,
        discount : ``,
        net_payable : ``,
        cash : ``,
        bank : ``,
        bank_ref : ``,
        bank_amount : ``,
        exchange_amount : ``,
        receive : ``,
        return_due : ``,

        customer_name : ``,
        customer_phone : ``,
        customer_email : ``,
        customer_address : ``,

    });

    const [deliveryDetails, setDeliveryDetails] = React.useState({})
    const [tempDetails, setTempDetails] = React.useState({})

    const handelGetInvoiceInfo = async (invoice) => {
        const formData = new FormData()
        formData.append('invoice', invoice)

        await axios.post(AppUrl(`/secure/sales/get-invoice-details`),formData)
        .then(function (response) {
            let info = response.data;
            setData({
                ...data,
                id : info.record.id,
                company_name : info.company_name ? info.company_name : `` ,
                company_phone : info.company_phone ? info.company_phone : `` ,
                company_email : info.company_email ? info.company_email : `` ,
                company_address : info.company_address  ? info.company_address : `` ,
                footer_note : info.invoice_footer_note  ? info.invoice_footer_note : `` ,
                currency : info.currency,

                details : info.record.details,

                invoice_date : info.record.invoice_date,
                invoice : info.record.invoice,
                created_by : info.record.user.name,

                sub_total : info.record.sub_total,
                vat : info.record.vat,
                total : info.record.total,
                advance : info.record.advance,
                discount : info.record.discount,
                net_payable : info.record.net_payable,
                cash : info.record.cash,
                bank : info.record.bank,
                bank_ref : info.record.bank_ref,
                bank_amount : info.record.bank_amount,
                exchange_amount : info.record.exchange_amount,
                receive : info.record.receive,
                return_due : info.record.return_due,

                customer_name : info.record.customer ? info.record.customer.name : ``,
                customer_phone : info.record.customer ? info.record.customer.phone : ``,
                customer_email : info.record.customer ? info.record.customer.email : ``,
                customer_address : info.record.customer ? info.record.customer.customer_address : ``,
            })
            let newDetails = []
            Object.keys(info.record.details).length > 0 ? 
                Object.values(info.record.details).map((detail)=>(
                    newDetails.push({
                        id : detail.id,
                        product_id : detail.product_id,
                        warehouse_id : detail.warehouse_id,
                        product : detail.product,
                        warehouse : detail.warehouse,
                        category : detail.product.category.name,
                        measurement : detail.product.measurement.name,
                        quantity : detail.quantity,
                        delivered_qty : detail.delivery_quantity,
                        rtn_quantity : detail.rtn_quantity,
                        delivery_qty : 0,
                    })
                ))
            :``

            setDeliveryDetails(newDetails)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handleAddNewModalShow = () => setAddNewModalOpen(true);
    const handleAddNewModalClose = () => setAddNewModalOpen(false);
    const handelDeliveryQty = (obj) => {
        handleAddNewModalShow()
        setTempDetails({
            ...tempDetails,
            id : obj.id,
            quantity : obj.quantity-(obj.rtn_quantity+obj.delivered_qty),
            delivery_qty : 0
        })
    }

    const handelAddDeliveryQty = ()  => {
        let details = [...deliveryDetails]
        Object.values(deliveryDetails).map((detail,index)=>{
            if(detail.id == tempDetails.id){
                details[index].delivery_qty = tempDetails.delivery_qty
            }          
        })
        setDeliveryDetails(details)
        handleAddNewModalClose()
        setTempDetails({
            ...tempDetails,
            id : 0,
            quantity : 0,
            delivery_qty : 0
        })
    }

    const handelSavingInfo = async () => {
        setSavingInfo(true)
        const data = new FormData()
        data.append(`invoice`, props.match.params.id)
        Object.values(deliveryDetails).map((detail,i)=> {
            data.append(`id[`+i+`]`, detail.id)
            data.append(`delivery_qty[`+i+`]`, detail.delivery_qty)
        })

        await axios.post(AppUrl(`/secure/sales/save-delivery-invoice`),data)
        .then(function (response) {
            let info = response.data;

            if(info.errors){
                (info.errors).map((error)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
            else if(info.success){
                props.history.push(AppUrl(`/control/dashboard`))
            }
            setSavingInfo(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    React.useEffect(() => {        
        handelGetInvoiceInfo(props.match.params.id)
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Link to={AppUrl('/control/dashboard')} 
                                className='btn btn-primary ms-2'>
                                    <i className="uil uil-arrow-left fs-4"></i> Back
                            </Link>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <div className='text-center'>
                                        <h3 className='m-0'>{data.company_name}</h3>
                                        {
                                            data.company_phone ? 
                                            (<p className='m-0'>Phone : {data.company_phone}</p>):(``)
                                        }
                                        {
                                            data.company_email ? 
                                            (<p className='m-0'>Email : {data.company_email}</p>):(``)
                                        }
                                        {
                                            data.company_address ? 
                                            (<p className='m-0' dangerouslySetInnerHTML={{__html: data.company_address}} />):(``)
                                        }
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <p className='m-0'>Date : {data.invoice_date}</p>
                                    <p className='m-0'>Invoice No. : {data.invoice}</p>                                                

                                    <h5 className='m-0'>Customer : {data.customer_name}</h5>
                                    {
                                        data.customer_phone ? 
                                        (<p className='m-0'>Phone : {data.customer_phone}</p>):(``)
                                    }
                                    {
                                        data.customer_email ? 
                                        (<p className='m-0'>Email : {data.customer_email}</p>):(``)
                                    }
                                    {
                                        data.customer_address ?
                                        (<p className='m-0' dangerouslySetInnerHTML={{__html: data.customer_address}} />):(``)
                                    }
                                    <p className='mt-2 mb-0'>Created by : {data.created_by}</p>
                                </Col>
                                <Col>
                                    <p className='text-center mt-2'>
                                        <span className='border border-dark rounded fw-bolder p-1' style={{ width : "fit-content" }}>
                                        Invoice
                                        </span>
                                    </p>
                                </Col>
                                <Col>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Table striped bordered className='mb-0'>
                                        <thead>
                                            <tr>
                                                <th className="text-center" style={{ width : "5%" }}>#</th>
                                                <th style={{ width : "35%" }}>Items</th>
                                                <th className="text-end" style={{ width : "15%" }}>Qty</th>
                                                <th className="text-end" style={{ width : "15%" }}>Already Delivered</th>
                                                <th className="text-center" style={{ width : "30%" }}>Delivery</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(deliveryDetails).length > 0 ? 
                                                    Object.values(deliveryDetails).map((detail,index)=>(
                                                        <tr key={index}>
                                                            <td className="text-center">{index+1}</td>
                                                            <td>
                                                                {detail.product.name} <br />
                                                                Category : {detail.category}<br />
                                                                Godown : {detail.warehouse.name}
                                                            </td>
                                                            <td className="text-end">
                                                                {parseFloat(detail.quantity-detail.rtn_quantity).toFixed(3)} /{detail.measurement}
                                                            </td>
                                                            <td className="text-end">
                                                                {parseFloat(detail.delivered_qty).toFixed(3)} /{detail.measurement}
                                                            </td>
                                                            <td className="text-end">
                                                                {
                                                                    ((detail.quantity-detail.rtn_quantity) > detail.delivered_qty) ?
                                                                    (
                                                                        <React.Fragment>
                                                                            <span className='me-3'>{detail.delivery_qty}</span>
                                                                            <Button variant="primary" className="input-group-text"
                                                                                onClick={()=>handelDeliveryQty(detail)} 
                                                                                >
                                                                                Delivery Qty
                                                                            </Button>
                                                                        </React.Fragment>
                                                                    )
                                                                    :(`-`)
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                : (<tr><td colSpan={5} className="text-center py-3"><h3>No Data Found</h3></td></tr>)
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                        {
                            !isSavingInfo ? 
                            (
                                <Button className="float-end" variant="primary" 
                                    onClick={handelSavingInfo.bind(this)}
                                >
                                    Save
                                </Button>
                            )
                            :(<BtnSaving variant="primary" text="Saving..." />)
                        }
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            <Modal
                size="sm"
                show={isAddNewModalOpen}
                onHide={handleAddNewModalClose.bind(this)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Delivery Qty</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group className="mb-1" controlId="delivery_qty">
                    <Form.Label className="m-0">Qty <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" 
                        max={tempDetails.quantity} step="any"
                        value={tempDetails.delivery_qty}
                        onChange={
                            e => {
                                let max = e.target.max;
                                let value = parseFloat(e.target.value);
                                let delivery_qty;
                                
                                if(value > max){
                                    delivery_qty = max
                                }
                                else{
                                    if(value){
                                        delivery_qty = value
                                    }
                                }
                                setTempDetails({
                                    ...tempDetails,
                                    delivery_qty : value ? delivery_qty : ``
                                })
                            }
                        }
                    />
                </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="float-end" variant="primary" 
                        onClick={handelAddDeliveryQty.bind(this)}
                    >
                        Delivery
                    </Button>
                </Modal.Footer>
            </Modal>
            
        </React.Fragment>
    )
}
