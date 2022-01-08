import React from 'react'
import { Button, Card, Col, Row, Table } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import Loading from '../../components/Loading'
import { AppUrl, ShowToast } from '../../Context'
import { Link } from 'react-router-dom'

export default function PurchaseVoucherDetails(props) {
    const [total,setTotal] = React.useState(0)
    const [data,setData] = React.useState({
        id : ``,
        company_name : ``,
        company_phone : ``,
        company_email : ``,
        company_address : ``,
        footer_note : ``,
        currency : ``,

        details : {},
        
        purchase_date : ``,
        voucher : ``,
        ref : ``,

        supplier_name : ``,
        supplier_phone : ``,
        supplier_email : ``,
        supplier_address : ``,

    });

    const handelGetVoucherInfo = async (voucher) => {
        const formData = new FormData()
        formData.append('voucher', voucher)

        await axios.post(AppUrl(`/secure/purchase/get-purchase-voucher-details`),formData)
        .then(function (response) {
            let info = response.data;
            
            let totalAmount = 0;
            Object.values(info.record.details).map((detail)=>(
                totalAmount+=detail.subtotal
            ))

            setData({
                ...data,
                id : info.record.id,
                company_name : info.company_name ? info.company_name : `` ,
                company_phone : info.company_phone ? info.company_phone : `` ,
                company_email : info.company_email ? info.company_email : `` ,
                company_address : info.company_address  ? info.company_address : `` ,
                footer_note : info.purchase_voucher_footer_note  ? info.purchase_voucher_footer_note : `` ,
                currency : info.currency,

                details : info.record.details,

                purchase_date : info.record.purchase_date,
                voucher : info.record.voucher,
                ref : info.record.ref,

                supplier_name : info.record.supplier.name,
                supplier_phone : info.record.supplier.phone,
                supplier_email : info.record.supplier.email,
                supplier_address : info.record.supplier.supplier_address,
            })
            setTotal(totalAmount)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handleDeleteVoucher = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData()
                formData.append('id',id)
                await axios.post(AppUrl(`/secure/purchase/delete-purchase-voucher`),formData)
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
        })
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
                            <Button variant="danger" className="float-end ms-2" 
                                onClick={()=>handleDeleteVoucher(data.id)}
                            >
                                <i className="uil uil-trash-alt fs-4"></i>
                            </Button>
                            <Button variant="success" className="float-end ms-2" 
                                //onClick={()=>handleDeleteVoucher(data.record.id)}
                            >
                                <i className="uil uil-print fs-4"></i>
                            </Button>

                        </Card.Header>
                        <Card.Body>
                            {
                                Object.keys(data.details).length > 0 ? 
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
                                                <h5 className='m-0'>Supplier : {data.supplier_name}</h5>
                                                {
                                                    data.supplier_phone ? 
                                                    (<p className='m-0'>Phone : {data.supplier_phone}</p>):(``)
                                                }
                                                {
                                                    data.supplier_email ? 
                                                    (<p className='m-0'>Email : {data.supplier_email}</p>):(``)
                                                }
                                                {
                                                    data.supplier_address ?
                                                    (<p className='m-0' dangerouslySetInnerHTML={{__html: data.supplier_address}} />):(``)
                                                }
                                            </Col>
                                            <Col>
                                                <p className='text-center mt-2'>
                                                    <span className='border border-dark rounded fw-bolder p-1' style={{ width : "fit-content" }}>
                                                        Purchase Voucher
                                                    </span>
                                                </p>
                                            </Col>
                                            <Col>
                                                <div className='text-end'>
                                                    <p className='m-0'>Date : {data.purchase_date}</p>
                                                    <p className='m-0'>Voucher : {data.voucher}</p>
                                                    <p className='m-0'>Ref : {data.ref}</p>
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
                                                            <th className="text-end" style={{ width : "15%" }}>Qty</th>
                                                            <th className="text-end" style={{ width : "15%" }}>Price</th>
                                                            <th className="text-end" style={{ width : "20%" }}>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(data.details).length > 0 ? 
                                                                Object.values(data.details).map((detail,index)=>(
                                                                    <tr key={index}>
                                                                        <td className="text-center">{index+1}</td>
                                                                        <td>
                                                                            {detail.product.name} <br />
                                                                            Godown : {detail.warehouse.name}
                                                                        </td>
                                                                        <td className="text-end">
                                                                            {detail.rtn_qty == 0 ? parseFloat(detail.qty).toFixed(3) : 
                                                                            (<React.Fragment>{parseFloat(detail.rtn_qty).toFixed(3)} <br /><del>{parseFloat(detail.qty).toFixed(3)}</del></React.Fragment>)} /{detail.product.measurement.name}
                                                                        </td>
                                                                        <td className="text-end">
                                                                            {parseFloat(detail.price).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                                        </td>
                                                                        <td className="text-end">
                                                                            {parseFloat(detail.subtotal).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            : (<tr><td colSpan={5} className="text-center py-3"><h3>No Data Found</h3></td></tr>)
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Total</th>
                                                            <th className="text-end">
                                                                {parseFloat(total).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                {
                                                    data.footer_note ?
                                                    (<p className='my-2' dangerouslySetInnerHTML={{__html: data.footer_note}} />):(``)
                                                }
                                            </Col>
                                        </Row>
                                        
                                    </React.Fragment>
                                :(<div className='text-center'><Loading /></div>)
                                
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ToastContainer />
        </React.Fragment>
    )
}
