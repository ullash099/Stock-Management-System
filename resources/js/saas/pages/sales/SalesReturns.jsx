import React from 'react'
import { Button, Card, Col, Row, ListGroup, Form, InputGroup,Table } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import Flatpickr from "react-flatpickr"
import Select from 'react-select'
import Swal from 'sweetalert2'
import { AppUrl, ShowToast } from '../../Context'
import { Link } from 'react-router-dom'
import axios from 'axios'
import BtnSaving from '../../components/BtnSaving'

export default function SalesReturns(props) {
    const toDay = new Date().toISOString().slice(0, 10);
    const [isShowWithdrawFromBank,setShowWithdrawFromBank] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)

    const transactionsType = [
        { value: 'cash', label: 'Cash' },
        { value: 'bank', label: 'Bank' },
        { value: 'both', label: 'Both' },
    ]
    const [accountHeads,setAccountHeads] = React.useState([])
    const [expenseTo,setExpenseTo] = React.useState([])
    const [banks,setBanks] = React.useState([])
    const [suppliers,setSuppliers] = React.useState([])
    const [currency,setCurrency] = React.useState([])

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

    const [total,setTotal] = React.useState(0)

    const [formData,setFormData] = React.useState({
        account_head : 0,
        transactions_type : 0,
        voucher_date : toDay,

        description : `Sales return`,

        expense_to : 0,
        withdraw_from_bank : 0,
        calculation : ``,
        search : ``,
        cash : 0,
        bank : 0,
    });

    const [details, setDetails] = React.useState({})

    const handelGetInvoiceInfo = async (invoice) => {
        const data = new FormData()
        data.append('invoice', invoice)

        await axios.post(AppUrl(`/secure/sales/get-invoice-details`),data)
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

                customer_id : info.record.customer ? info.record.customer.id : 0,
                customer_name : info.record.customer ? info.record.customer.name : ``,
                customer_phone : info.record.customer ? info.record.customer.phone : ``,
                customer_email : info.record.customer ? info.record.customer.email : ``,
                customer_address : info.record.customer ? info.record.customer.customer_address : ``,
            })

            let total = 0;
            let newDetails = []
            Object.keys(info.record.details).length > 0 ? 
                Object.values(info.record.details).map((detail)=>{
                    newDetails.push({
                        id : detail.id,
                        product_id : detail.product_id,
                        warehouse_id : detail.warehouse_id,
                        product : detail.product,
                        warehouse : detail.warehouse,
                        category : detail.product.category.name,
                        price : detail.price,
                        measurement : detail.product.measurement.name,
                        actual_qty : detail.quantity-detail.rtn_quantity,
                        quantity : detail.quantity-detail.rtn_quantity,
                        delivery_qty : 0,
                    })
                    total += detail.price*detail.quantity;
                })
            :``

            setDetails(newDetails)
            setTotal(total)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelIncreaseReturnQty = (obj) => {
        let actual_qty = obj.actual_qty
        let quantity = obj.quantity
        if(quantity < actual_qty)
        {
            let dts = [...details]
            let qty = quantity;
            qty++

            let total = 0

            Object.values(details).map((detail,index)=>{
                if(detail.id == obj.id){
                    dts[index].quantity = qty
                    total += detail.price*qty
                }
                else{
                    total += detail.price*detail.quantity
                }
            })
            setDetails(dts)
            setTotal(total)
        }
    }
    
    const handelDecreaseReturnQty = (obj) => {
        let actual_qty = obj.actual_qty
        let quantity = obj.quantity
        
        if(quantity != 0 && quantity <= actual_qty)
        {
            let dts = [...details]
            let qty = quantity;
            qty--

            let total = 0
            Object.values(details).map((detail,index)=>{
                if(detail.id == obj.id){
                    dts[index].quantity = qty
                    total += detail.price*qty
                }
                else{
                    total += detail.price*detail.quantity
                }
            })
            setDetails(dts)
            setTotal(total)
        }
    }

    const getDefaultData = async () => {
        await axios.get(AppUrl(`/secure/expense/get-expense-vouchers-default-data`))
        .then(response => {
            let info = response.data;

            let accountHeads = [];
            if(Object.keys(info.account_heads).length > 0){
                (info.account_heads).map((accountHead)=>{
                    accountHeads.push({ 
                        value: accountHead.id, label: accountHead.name, 
                        calculation: accountHead.calculation, search: accountHead.search, 
                    })
                });
            }
            
            let banks = [];
            if(Object.keys(info.banks).length > 0){
                (info.banks).map((bank)=>{
                    banks.push({ 
                        value: bank.id, label: bank.name+' ('+bank.account_no+')', 
                        outstanding: bank.outstanding, 
                    })
                });
            }
            
            let customers = [];
            if(Object.keys(info.customers).length > 0){
                (info.customers).map((customer)=>{
                    customers.push({ 
                        value: customer.id, label: customer.name+' ('+customer.phone+')', 
                        outstanding: customer.outstanding, 
                    })
                });
            }

            let suppliers = [];
            if(Object.keys(info.suppliers).length > 0){
                (info.suppliers).map((supplier)=>{
                    suppliers.push({ 
                        value: supplier.id, label: supplier.name+' ('+supplier.phone+')',
                        outstanding: supplier.outstanding,  
                    })
                });
            }

            setAccountHeads(accountHeads)
            setBanks(banks)
            setCustomers(customers)
            setSuppliers(suppliers)
            setCurrency(info.currency)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelSetExpenseTo = (search) => {
        if(search == 'bank'){
            setExpenseTo(banks)
        }
        else if(search == 'customer'){
            setExpenseTo(customers)
        }
        else if(search == 'supplier'){
            setExpenseTo(suppliers)
        }
        else{
            setExpenseTo([])
        }
    }

    const handelShowDepositToBank = (value) => {
        if(value != 'cash'){
            setShowWithdrawFromBank(true)
        }
        else{
            setShowWithdrawFromBank(false)
        }
    }

    /* saving info */
    const handelSavingInfo = async () => {
        //console.log(data.id);
        if(details.length > 0){
            //setSavingInfo(true);
            const submitData = new FormData()

            submitData.append('invoice', data.id)
            submitData.append('account_head', formData.account_head)
            submitData.append('search', formData.search)
            submitData.append('calculation', formData.calculation)
            submitData.append('transactions_type', formData.transactions_type)
            submitData.append('voucher_date', formData.voucher_date)
            submitData.append('expense_to', formData.expense_to)
            submitData.append('withdraw_from_bank', formData.withdraw_from_bank)
            submitData.append('description', formData.description)
            submitData.append('amount', total)
            submitData.append('total', total)
            submitData.append('cash', formData.cash)
            submitData.append('bank', formData.bank)

            details.map((detail,i)=> {
                submitData.append(`product_id[`+i+`]`, detail.product_id)
                submitData.append(`warehouse_id[`+i+`]`, detail.warehouse_id)
                submitData.append(`return_id[`+i+`]`, detail.id)
                submitData.append(`return_qty[`+i+`]`, detail.quantity)
            })
            
            await axios.post(AppUrl(`/secure/sales/save-sales-return`),submitData)
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
                    props.history.push(AppUrl(`/control/sales/invoices`))
                }
                setSavingInfo(false);
            })
            .catch(function (error) {
                if(error == 'Error: Request failed with status code 401'){
                    location.reload()
                }
            });
        }
        else{
            ShowToast({
                type : 'error',
                msg  : `details is missing`
            })
        }
    }

    React.useEffect(() => {
        handelGetInvoiceInfo(props.match.params.id).then(()=>{
            getDefaultData()
        })
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className='p-0'>
                            <Link to={AppUrl('/control/sales/invoices')} 
                                className='btn btn-primary ms-2 mt-1'>
                                    <i className="uil uil-arrow-left fs-4"></i> Back
                            </Link>
                            <Row>
                                <Col>
                                    <div className='p-2'>
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
                                    </div>
                                </Col>
                            </Row>
                            
                            <ListGroup>
                                <ListGroup.Item>
                                    Sold Products
                                </ListGroup.Item>
                                {
                                    Object.keys(details).length > 0 ?
                                        Object.values(details).map((detail,index)=>(
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col sm={8}>{detail.product.name}</Col>
                                                    <Col sm={4} className='float-end'>
                                                        <Form.Group className="mb-1" controlId={`qty_`+detail.id}>
                                                            <InputGroup>
                                                                <Button variant="danger" className="input-group-text"
                                                                    onClick={()=>handelDecreaseReturnQty(detail)}
                                                                >
                                                                    -
                                                                </Button>
                                                                <Form.Control type="number" readOnly style={{ textAlign : 'right' }}
                                                                    min={0} 
                                                                    max={999999999} step="any"
                                                                    value={detail.quantity}
                                                                />
                                                                <Button variant="primary" className="input-group-text"
                                                                    onClick={() => handelIncreaseReturnQty(detail)} 
                                                                >
                                                                    +
                                                                </Button>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))
                                    : ``
                                }
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body className='p-0'>
                            <div className='px-3 py-2'>
                                <Row>
                                    <Col sm={12} md={6}>
                                        <Form.Group className="mb-0" controlId="account_head">
                                            <Form.Label className="m-0">Account Heads <span className="text-danger">*</span></Form.Label>
                                            <Select
                                                value={accountHeads.filter(
                                                    option => (formData.account_head && option.value.toString() === (formData.account_head).toString())
                                                )}
                                                options={accountHeads}
                                                onChange={
                                                    option => {
                                                        if(option.value){
                                                            setFormData({
                                                                ...formData,
                                                                account_head : option.value.toString(),
                                                                calculation : option.calculation,
                                                                search : option.search,
                                                            })
                                                            handelSetExpenseTo(option.search)
                                                        }
                                                        else{
                                                            setFormData({
                                                                ...formData,
                                                                account_head : 0,
                                                                calculation : ``,
                                                                search : ``,
                                                            })
                                                        }
                                                    }
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <Form.Group className="mb-0" controlId="voucher_date">
                                            <Form.Label className="m-0">Voucher Date <span className="text-danger">*</span></Form.Label>
                                            <Flatpickr
                                                className="form-control"
                                                data-enable-time={false}
                                                options={{
                                                    maxDate : toDay,
                                                    dateFormat : 'Y-m-d',
                                                }}
                                                value={formData.voucher_date}
                                                onChange={(date, dateStr)=>{
                                                    setFormData({
                                                        ...formData,
                                                        voucher_date : dateStr
                                                    })
                                                }} 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} md={6}>
                                        <Form.Group className="mb-0" controlId="transactions_type">
                                            <Form.Label className="m-0">Transactions Type <span className="text-danger">*</span></Form.Label>
                                            <Select
                                                value={transactionsType.filter(
                                                    option => (formData.transactions_type && option.value.toString() === (formData.transactions_type).toString())
                                                )}
                                                options={transactionsType}
                                                onChange={
                                                    option => {
                                                        if(option.value){
                                                            setFormData({
                                                                ...formData,
                                                                transactions_type : option.value.toString()
                                                            })
                                                            handelShowDepositToBank(option.value)
                                                        }
                                                        else{
                                                            setFormData({
                                                                ...formData,
                                                                transactions_type : ``
                                                            })
                                                        }
                                                    }
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} md={6}>
                                        {
                                            isShowWithdrawFromBank ? (
                                                <Form.Group className="mb-1" controlId="withdraw_from_bank">
                                                    <Form.Label className="m-0">Withdraw From Bank <span className="text-danger">*</span></Form.Label>
                                                    <Select
                                                        value={banks.filter(
                                                            option => (formData.withdraw_from_bank && option.value.toString() === (formData.withdraw_from_bank).toString())
                                                        )}
                                                        options={banks}
                                                        onChange={
                                                            option => {
                                                                setFormData({
                                                                    ...formData,
                                                                    withdraw_from_bank : option ? option.value.toString() : `0`
                                                                })
                                                            }
                                                        }
                                                    />
                                                </Form.Group>
                                            )
                                            :(``)
                                        }
                                    </Col>
                                </Row>
                            </div>

                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ width : '75%' }}>Description</th>
                                        <th className='text-end' style={{ width : '25%' }}>Return Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Form.Control type="text" as="textarea"
                                                value={formData.description}
                                                onChange={e=>{
                                                    setFormData({
                                                        ...formData,
                                                        description : e.target.value
                                                    })
                                                }}
                                            />
                                        </td>
                                        <td className='text-end'>
                                            {parseFloat(total).toFixed(2)}<span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className='text-end'>Total</td>
                                        <td className='text-end'>
                                            {parseFloat(total).toFixed(2)}<span dangerouslySetInnerHTML={{__html: data.currency}}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="text-end">Cash</th>
                                        <th className="text-end">
                                            <Form.Group className="mb-1" controlId="cash">
                                                <Form.Control type="number" 
                                                    readOnly={formData.transactions_type == 'cash' || formData.transactions_type == 'both' ? false : true}
                                                    min={0} max={total} step="any"
                                                    value={formData.cash}
                                                    onChange={
                                                        e => {
                                                            if (e.target.value) {
                                                                let min = e.target.min;
                                                                let max = e.target.max;
                                                                let value = parseFloat(e.target.value);
                                                                let cash = min;
                                                                
                                                                if(value < min){
                                                                    cash = min
                                                                }
                                                                else if(value > max){
                                                                    cash = max
                                                                }
                                                                else{
                                                                    if(value){
                                                                        cash = value
                                                                    }
                                                                    else{
                                                                        cash = min
                                                                    }
                                                                }
                                                                setFormData({
                                                                    ...formData,
                                                                    cash : cash
                                                                })                                                                
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    cash : ``
                                                                })
                                                            }
                                                        }
                                                    }
                                                />
                                            </Form.Group>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="text-end">Bank</th>
                                        <th className="text-end">
                                            <Form.Group className="mb-1" controlId="bank">
                                                <Form.Control type="number" 
                                                    readOnly={formData.transactions_type == 'bank' || formData.transactions_type == 'both' ? false : true}
                                                    min={0} max={total} step="any"
                                                    value={formData.bank}
                                                    onChange={
                                                        e => {
                                                            if (e.target.value) {
                                                                let min = e.target.min;
                                                                let max = e.target.max;
                                                                let value = parseFloat(e.target.value);
                                                                let bank = min;
                                                                
                                                                if(value < min){
                                                                    bank = min
                                                                }
                                                                else if(value > max){
                                                                    bank = max
                                                                }
                                                                else{
                                                                    if(value){
                                                                        bank = value
                                                                    }
                                                                    else{
                                                                        bank = min
                                                                    }
                                                                }
                                                                setFormData({
                                                                    ...formData,
                                                                    bank : bank
                                                                })                                                                
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    bank : ``
                                                                })
                                                            }
                                                        }
                                                    }
                                                />
                                            </Form.Group>
                                        </th>
                                    </tr>
                                </tfoot>
                            </Table>
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
        </React.Fragment>
    )
}
