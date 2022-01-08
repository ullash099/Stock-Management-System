import React from 'react'
import { Button, Card, Col, Row, Table } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import Loading from '../../components/Loading'
import { AppUrl, ShowToast } from '../../Context'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function SalesVoucherDetails(props) {
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
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handleDeleteInvoice = async (id) => {
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
                await axios.post(AppUrl(`/secure/sales/delete-invoice`),formData)
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
                        props.history.push(AppUrl(`/control/sales/invoices`))
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

    const handlePrintInvoice = async () => {
        let invoice = props.match.params.id;
        window.open(AppUrl(`/sales/print/`+invoice), "sales-invoice", "fullscreen=yes");
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
                            <Link to={AppUrl('/control/sales/invoices')} 
                                className='btn btn-primary ms-2'>
                                    <i className="uil uil-arrow-left fs-4"></i> Back
                            </Link>
                            <Button variant="success" className="float-end ms-2" 
                                onClick={handlePrintInvoice.bind(this)}
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
                                                            <th style={{ width : "45%" }}>Items</th>
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
                                                                            {parseFloat(detail.quantity).toFixed(3)}
                                                                            {
                                                                                detail.rtn_quantity == 0 ? 
                                                                                '('+parseFloat(detail.rtn_quantity).toFixed(3)+')' : (``)
                                                                            }
                                                                        </td>
                                                                        <td className="text-end">
                                                                            {parseFloat(detail.price).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                                        </td>
                                                                        <td className="text-end">
                                                                            {parseFloat(detail.quantity*detail.price).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            : (<tr><td colSpan={5} className="text-center py-3"><h3>No Data Found</h3></td></tr>)
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Sub Total</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.sub_total).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>VAT</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.vat).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Total</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.total).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>(-) Advance</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.advance).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>(-) Discount</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.discount).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Net Payable</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.net_payable).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Cash</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.cash).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Bank Amount</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.bank_amount).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Bank</th>
                                                            <th className="text-end">
                                                                {data.bank ? data.bank.name : ``} <br />
                                                                {data.bank ? data.bank.account_no : ``}
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Bank Ref.</th>
                                                            <th className="text-end">
                                                                { data.bank_ref }
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>Receive</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.receive).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={4}>
                                                                {data.return_due < 0 ? `Due` : `Return`}
                                                            </th>
                                                            <th className="text-end">
                                                                {parseFloat(data.return_due).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        {
                                                            data.exchange_amount != 0 ?
                                                                <React.Fragment>
                                                                    <tr>
                                                                        <th className="text-end" colSpan={4}>Sales Return</th>
                                                                        <th className="text-end">
                                                                            {parseFloat(data.exchange_amount*-1).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                                        </th>
                                                                    </tr>
                                                                </React.Fragment>
                                                            :(``)
                                                        }                                                        
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
