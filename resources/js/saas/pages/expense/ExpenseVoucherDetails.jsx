import React from 'react'
import { Button, Card, Col, Row, Table } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import Loading from '../../components/Loading'
import { AppUrl, ShowToast } from '../../Context'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function ExpenseVoucherDetails(props) {
    const [data,setData] = React.useState({
        id : ``,
        company_name : ``,
        company_phone : ``,
        company_email : ``,
        company_address : ``,
        footer_note : ``,
        currency : ``,
        
        details : {},
        
        voucher_date : ``,
        voucher : ``,
        
        account_head : ``,
        total : 0,
        cash_amount : 0,
        bank_amount : 0,
        
        supplier : {},
        customer : {},
        bank : {},
        
        created_by : ``
    });

    const handelGetVoucherInfo = async (voucher) => {
        const formData = new FormData()
        formData.append('voucher', voucher)

        await axios.post(AppUrl(`/secure/expense/get-expense-voucher-details`),formData)
        .then(function (response) {
            let info = response.data;

            setData({
                ...data,
                id : info.record.id,
                company_name : info.company_name ? info.company_name : `` ,
                company_phone : info.company_phone ? info.company_phone : `` ,
                company_email : info.company_email ? info.company_email : `` ,
                company_address : info.company_address  ? info.company_address : `` ,
                footer_note : info.expense_voucher_footer_note  ? info.expense_voucher_footer_note : `` ,
                currency : info.currency,

                details : info.record.details,

                voucher_date : info.record.voucher_date,
                voucher : info.record.voucher,

                account_head : info.record.account_head.name,
                total : info.record.total,

                cash_amount : info.record.cash_amount,
                bank_amount : info.record.bank_amount,

                supplier : info.record.supplier,
                customer : info.record.customer,
                bank : info.record.bank,
                created_by : info.record.user.name,
            })
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
                await axios.post(AppUrl(`/secure/expense/delete-expense-voucher`),formData)
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
                        props.history.push(AppUrl(`/control/expense/delete-expense-voucher`))
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

    const handlePrintVoucher = async () => {
        let voucher = props.match.params.id;
        window.open(AppUrl(`/expense/print/`+voucher), "sales-invoice", "fullscreen=yes");
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
                            <Link to={AppUrl('/control/expense/expense-vouchers')} 
                                className='btn btn-primary ms-2'>
                                    <i className="uil uil-arrow-left fs-4"></i> Back
                            </Link>
                            <Button variant="success" className="float-end ms-2" 
                                onClick={handlePrintVoucher.bind(this)}
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
                                                <h5 className='m-0'>Account Head : {data.account_head}</h5>

                                                {
                                                    data.supplier ? 
                                                    (
                                                        <React.Fragment>
                                                            <h5 className='m-0'>{data.supplier.name}</h5>
                                                            {<p className='m-0'>Phone : {data.supplier.phone}</p>}
                                                            {
                                                                data.supplier.email ? 
                                                                (<p className='m-0'>Email : {data.supplier.email}</p>):(``)
                                                            }
                                                            {
                                                                data.supplier.supplier_address ?
                                                                (<p className='m-0' dangerouslySetInnerHTML={{__html: data.supplier.supplier_address}} />):(``)
                                                            }
                                                        </React.Fragment>
                                                    )
                                                    :(``)
                                                }

                                                {
                                                    data.customer ? 
                                                    (
                                                        <React.Fragment>
                                                            <h5 className='m-0'>{data.customer.name}</h5>
                                                            {<p className='m-0'>Phone : {data.customer.phone}</p>}
                                                            {
                                                                data.customer.email ? 
                                                                (<p className='m-0'>Email : {data.customer.email}</p>):(``)
                                                            }
                                                            {
                                                                data.customer.customer_address ?
                                                                (<p className='m-0' dangerouslySetInnerHTML={{__html: data.customer.customer_address}} />):(``)
                                                            }
                                                        </React.Fragment>
                                                    )
                                                    :(``)
                                                }
                                                
                                                {
                                                    data.bank ? 
                                                    (
                                                        <React.Fragment>
                                                            <h5 className='m-0'>{data.bank.name}</h5>
                                                            {<p className='m-0'>A/C : {data.bank.account_holder}</p>}
                                                            {<p className='m-0'>A/C No. : {data.bank.account_no}</p>}
                                                            {
                                                                data.bank.bank_address ?
                                                                (<p className='m-0' dangerouslySetInnerHTML={{__html: data.bank.bank_address}} />):(``)
                                                            }
                                                        </React.Fragment>
                                                    )
                                                    :(``)
                                                }
                                            </Col>
                                            <Col>
                                                <p className='text-center mt-2'>
                                                    <span className='border border-dark rounded fw-bolder p-1' style={{ width : "fit-content" }}>
                                                        Expense Voucher
                                                    </span>
                                                </p>
                                            </Col>
                                            <Col>
                                                <div className='text-end'>
                                                    <p className='m-0'>Date : {data.voucher_date}</p>
                                                    <p className='m-0'>Voucher : {data.voucher}</p>
                                                    <p className='mt-2 mb-0'>Created by : {data.created_by}</p>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                <Table striped bordered className='mb-0'>
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center" style={{ width : "5%" }}>#</th>
                                                            <th style={{ width : "75%" }}>Description</th>
                                                            <th className="text-end" style={{ width : "20%" }}>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(data.details).length > 0 ? 
                                                                Object.values(data.details).map((detail,index)=>(
                                                                    <tr key={index}>
                                                                        <td className="text-center">{index+1}</td>
                                                                        <td>
                                                                            <div dangerouslySetInnerHTML={{__html: detail.description}}/>
                                                                        </td>
                                                                        <td className="text-end">
                                                                            {parseFloat(detail.amount).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            : (<tr><td colSpan={3} className="text-center py-3"><h3>No Data Found</h3></td></tr>)
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th className="text-end" colSpan={2}>Total</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.total).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={2}>Cash</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.cash_amount).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-end" colSpan={2}>Bank</th>
                                                            <th className="text-end">
                                                                {parseFloat(data.bank_amount).toFixed(2)} <span dangerouslySetInnerHTML={{__html: data.currency}}/>
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
