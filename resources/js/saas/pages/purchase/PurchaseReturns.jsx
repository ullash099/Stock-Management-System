import React from 'react'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../../components/Loading'
import { AppUrl, ShowToast } from '../../Context'
import { Link } from 'react-router-dom'
import BtnSaving from '../../components/BtnSaving'

export default function PurchaseReturns(props) {
    const [rtnTotal,setRtnTotal] = React.useState(0)
    const [rtnDetails,setRtnDetails] = React.useState([])
    const [isAddingInfo,setAddingInfo] = React.useState(false)
    const [data,setData] = React.useState({
        record : {},
        company_name : ``,
        company_phone : ``,
        company_email : ``,
        company_address : ``,
        footer_note : ``,
        currency : ``,
    });

    const handelGetVoucherInfo = async (voucher) => {        
        const formData = new FormData()
        formData.append('voucher', voucher)

        await axios.post(AppUrl(`/secure/purchase/get-purchase-voucher-details`),formData)
        .then(function (response) {
            let info = response.data;
            setData({
                ...data,
                record : info.record,
                company_name : info.company_name,
                company_phone : info.company_phone,
                company_email : info.company_email,
                company_address : info.company_address,
                footer_note : info.purchase_voucher_footer_note,
                currency : info.currency,
            })
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelSaveingInfo = async () => {
        setAddingInfo(true)
        const formData = new FormData()
        formData.append(`voucher`, props.match.params.id)
        rtnDetails.map((detail,i)=> {
            if (detail.rtn_qty > 0) {
                formData.append(`id[`+i+`]`, detail.id)
                formData.append(`rtn_qty[`+i+`]`, detail.rtn_qty)
            }
        })
        await axios.post(AppUrl(`/secure/purchase/save-purchase-return`),formData)
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
                ShowToast({
                    type : 'success',
                    msg  : info.success
                })
                props.history.push(AppUrl(`/control/purchase/purchase-vouchers`))
            }
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    React.useEffect(() => {
        handelGetVoucherInfo(props.match.params.id)
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Link to={AppUrl('/control/purchase/purchase-vouchers')} 
                                className='btn btn-primary ms-2'>
                                    <i className="uil uil-arrow-left fs-4"></i> Back
                            </Link>
                        </Card.Header>
                        <Card.Body>
                            {
                                !data.company_name ? (<div className='text-center'><Loading /></div>) : 
                                (
                                    <React.Fragment>
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
                                                <h5 className='m-0'>Supplier : {data.record.supplier.name}</h5>
                                                {
                                                    data.record.supplier.phone ? 
                                                    (<p className='m-0'>Phone : {data.record.supplier.phone}</p>):(``)
                                                }
                                                {
                                                    data.record.supplier.email ? 
                                                    (<p className='m-0'>Email : {data.record.supplier.email}</p>):(``)
                                                }
                                                {
                                                    data.record.supplier.supplier_address ?
                                                    (<p className='m-0' dangerouslySetInnerHTML={{__html: data.record.supplier.supplier_address}} />):(``)
                                                }
                                            </Col>
                                            <Col>
                                                <div className='text-end'>
                                                    <p className='m-0'>Date : {data.record.purchase_date}</p>
                                                    <p className='m-0'>Voucher : {data.record.voucher}</p>
                                                    <p className='m-0'>Ref : {data.record.ref}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Table striped bordered className='mb-0'>
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center" style={{ width : "5%" }}>#</th>
                                                            <th style={{ width : "45%" }}>Purchase Information</th>
                                                            <th className="text-end" style={{ width : "15%" }}>Price</th>
                                                            <th className="text-end" style={{ width : "15%" }}>Qty</th>
                                                            <th className="text-end" style={{ width : "20%" }}>Return Qty</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(data.record.details).length > 0 ? 
                                                            Object.values(data.record.details).map((detail,index)=>(
                                                                <tr key={index}>
                                                                    <td className="text-center">{index+1}</td>
                                                                    <td>
                                                                        {detail.product.name} <br />
                                                                        Godowns : {detail.warehouse.name}
                                                                    </td>
                                                                    <td className="text-end">
                                                                        {parseFloat(detail.price).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                                    </td>
                                                                    <td className="text-end">
                                                                        {detail.rtn_qty == 0 ? parseFloat(detail.qty).toFixed(3) : 
                                                                        (<React.Fragment>{parseFloat(detail.rtn_qty).toFixed(3)} <br /><del>{parseFloat(detail.qty).toFixed(3)}</del></React.Fragment>)} /{detail.product.measurement.name}
                                                                    </td>
                                                                    <td className="text-end">
                                                                    <Form.Group className="mb-1" controlId="qty">
                                                                        <Form.Control type="number" 
                                                                            value={rtnDetails[index] ? rtnDetails[index].rtn_qty : 0 }
                                                                            min={0} max={detail.qty-detail.rtn_qty} step="any"
                                                                            onChange={
                                                                                e => {
                                                                                    let min = e.target.min;
                                                                                    let max = e.target.max;
                                                                                    let value = parseFloat(e.target.value);
                                                                                    let rtn_qty = min;
                                                                                    
                                                                                    if(value < min){
                                                                                        rtn_qty = min
                                                                                    }
                                                                                    else if(value > max){
                                                                                        rtn_qty = max
                                                                                    }
                                                                                    else{
                                                                                        if(value){
                                                                                            rtn_qty = value
                                                                                        }
                                                                                        else{
                                                                                            rtn_qty = min
                                                                                        }
                                                                                    }

                                                                                    let detailsInfo = [...rtnDetails]
                                                                                    detailsInfo[index] = {
                                                                                        id : detail.id,
                                                                                        rtn_qty : rtn_qty,
                                                                                    }
                                                                                    setRtnDetails(detailsInfo)
                                                                                    setRtnTotal(rtn_qty*detail.price)
                                                                                }
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                            : (<tr><td colSpan={5} className="text-center py-3"><h3>No Data Found</h3></td></tr>)
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Return Total</th>
                                                            <th className="text-end">
                                                                {parseFloat(rtnTotal).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )
                            }
                        </Card.Body>
                        <Card.Footer>
                            {
                                !isAddingInfo ? 
                                (
                                    <Button className="float-end" variant="primary" 
                                        onClick={handelSaveingInfo.bind(this)}
                                    >
                                        Save
                                    </Button>
                                )
                                :(<BtnSaving variant="primary" text="Saveing..." />)
                            }
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <ToastContainer />
        </React.Fragment>
    )
}
