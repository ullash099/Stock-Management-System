import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import BtnSaving from '../../components/BtnSaving'
import { AppUrl, ShowToast } from '../../Context'
import "flatpickr/dist/themes/material_green.css"
import Flatpickr from "react-flatpickr"
import { 
    Button, Card, Col, Form, Modal, Row, Table 
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify'

export default function NewIncomeVoucher(props) {
    const toDay = new Date().toISOString().slice(0, 10);
    const [total,setTotal] = React.useState(0)
    const [outstanding,setOutstanding] = React.useState(0)
    const [countRow,setCountRow] = React.useState(0)
    const [isAddingInfo,setAddingInfo] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [isAddNewModalOpen,setAddNewModalOpen] = React.useState(false)

    const [isShowDepositInBank,setShowDepositInBank] = React.useState(false)

    const transactionsType = [
        { value: 'cash', label: 'Cash' },
        { value: 'bank', label: 'Bank' },
        { value: 'both', label: 'Both' },
    ]
    const [accountHeads,setAccountHeads] = React.useState([])
    const [incomeFroms,setIncomeFroms] = React.useState([])
    
    const [banks,setBanks] = React.useState([])
    const [customers,setCustomers] = React.useState([])
    const [suppliers,setSuppliers] = React.useState([])
    
    const [details,setDetails] = React.useState([])
    const [currency,setCurrency] = React.useState([])
    const [tempDetails,setTempDetails] = React.useState({
        description : ``,
        amount : 0,
    })
    const [formData,setFormData] = React.useState({
        account_head : 0,
        transactions_type : 0,
        voucher_date : toDay,
        income_from : 0,
        deposit_in_bank : 0,
        calculation : ``,
        search : ``,
        cash : 0,
        bank : 0,
    });

    const getDefaultData = async () => {
        await axios.get(AppUrl(`/secure/income/get-income-vouchers-default-data`))
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

    const handelSetIncomeFrom = (search) => {
        if(search == 'bank'){
            setIncomeFroms(banks)
        }
        else if(search == 'customer'){
            setIncomeFroms(customers)
        }
        else if(search == 'supplier'){
            setIncomeFroms(suppliers)
        }
        else{
            setIncomeFroms([])
        }
    }
    
    const handelShowDepositToBank = (value) => {
        if(value != 'cash'){
            setShowDepositInBank(true)
        }
        else{
            setShowDepositInBank(false)
        }
    }

    const handelOutStanding = (amount) => setOutstanding(amount)

    /* details work info */
    const handleAddNewModalShow = () => setAddNewModalOpen(true)

    const handleAddNewModalClose = () => {
        setAddNewModalOpen(false)
        handelResetTempDetails()
    }

    const handelResetTempDetails = () => {
        setTempDetails({
            ...tempDetails,
            description : ``,
            amount : 0,
        })
    }

    const handelAddTempDetailsInfo = () => {
        if(tempDetails.description && tempDetails.amount > 0) 
        {
            setAddingInfo(true)
            
            let row = countRow+1;

            let detailsInfo = [...details]
            detailsInfo.push(tempDetails)
            setTotal(total+(tempDetails.amount))
            setDetails(detailsInfo)
            setTimeout(() => {
                handelResetTempDetails()
                setAddingInfo(false)
            }, 1000);

            setCountRow(row)
            
            if(row == 20){
                handleAddNewModalClose()
            }
        } else {
            ShowToast({
                type : 'error',
                msg  : `Please add details or amount`
            })
        }
    }

    const handelResetVoucher = () => {
        setFormData({
            ...formData,
            account_head : 0,
            transactions_type : 0,
            voucher_date : toDay,
            income_from : 0,
            deposit_in_bank : 0,
            calculation : ``,
            search : ``,
            cash : 0,
            bank : 0,
        })
        handelResetTempDetails()
        setDetails([])
        setCountRow(0)
        setTotal(0)
        handelOutStanding(0)
        setShowDepositInBank(false)
    }

    /* saving info */
    const handelSavingInfo = async () => {
        if(details.length > 0){
            setSavingInfo(true);
            const data = new FormData()

            data.append('account_head', formData.account_head)
            data.append('search', formData.search)
            data.append('calculation', formData.calculation)
            data.append('transactions_type', formData.transactions_type)
            data.append('voucher_date', formData.voucher_date)
            data.append('income_from', formData.income_from)
            data.append('deposit_in_bank', formData.deposit_in_bank)
            data.append('total', total)
            data.append('cash', formData.cash)
            data.append('bank', formData.bank)

            details.map((detail,i)=> {
                data.append(`description[`+i+`]`, detail.description)
                data.append(`amount[`+i+`]`, detail.amount)
            })
            
            await axios.post(AppUrl(`/secure/income/save-income-voucher`),data)
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
                    handelResetVoucher()
                    getDefaultData()
                    window.open(AppUrl(`/income/print/`+info.voucher), "sales-invoice", "fullscreen=yes");
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
        getDefaultData()
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col sm={9}>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title className='d-inline'>New Income Voucher</Card.Title>
                            {
                                countRow <= 19 ? (
                                    <Button variant="success" className="float-end" 
                                        onClick={handleAddNewModalShow.bind(this)}
                                    >
                                        <i className="uil uil-plus-circle fs-4"></i> Add Row
                                    </Button>
                                ) : (``)
                            }
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col sm={12} md={6}>
                                    <Form.Group className="mb-1" controlId="account_head">
                                        <Form.Label className="m-0">Account Head <span className="text-danger">*</span></Form.Label>
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
                                                        handelSetIncomeFrom(option.search)
                                                    }
                                                    else{
                                                        setFormData({
                                                            ...formData,
                                                            account_head :0,
                                                            calculation : ``,
                                                            search : ``,
                                                        })
                                                    }
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={3}>
                                    <Form.Group className="mb-1" controlId="transactions_type">
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
                                <Col sm={12} md={3}>
                                    <Form.Group className="mb-2" controlId="voucher_date">
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
                                <Col>
                                    <Form.Group className="mb-1" controlId="income_from">
                                        <Form.Label className="m-0">Income From</Form.Label>
                                        <Select
                                            value={incomeFroms.filter(
                                                option => (formData.income_from && option.value.toString() === (formData.income_from).toString())
                                            )}
                                            options={incomeFroms}
                                            onChange={
                                                option => {
                                                    setFormData({
                                                        ...formData,
                                                        income_from : option ? option.value.toString() : `0`
                                                    })
                                                    handelOutStanding(option ? option.outstanding : `0`)
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    {
                                        isShowDepositInBank ? (
                                            <Form.Group className="mb-1" controlId="deposit_in_bank">
                                                <Form.Label className="m-0">Deposit To Bank <span className="text-danger">*</span></Form.Label>
                                                <Select
                                                    value={banks.filter(
                                                        option => (formData.deposit_in_bank && option.value.toString() === (formData.deposit_in_bank).toString())
                                                    )}
                                                    options={banks}
                                                    onChange={
                                                        option => {
                                                            setFormData({
                                                                ...formData,
                                                                deposit_in_bank : option ? option.value.toString() : `0`
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
                            
                            <Row>
                                <Col>
                                    <Table striped bordered className='mb-0'>
                                        <thead>
                                            <tr>
                                                <th style={{ width : "5%" }}>#</th>
                                                <th style={{ width : "75%" }}>Description</th>
                                                <th className="text-end" style={{ width : "20%" }}>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(details).length > 0 ? 
                                                    Object.values(details).map((detail,index)=>(
                                                        <tr key={index}>
                                                            <td>{index+1}</td>
                                                            <td>
                                                                <div dangerouslySetInnerHTML={{__html: detail.description}}/>
                                                            </td>
                                                            <td className="text-end">
                                                                {parseFloat(detail.amount).toFixed(2)}
                                                                <span dangerouslySetInnerHTML={{__html: currency.sign}}/>
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
                                                    {parseFloat(total).toFixed(2)}
                                                    <span dangerouslySetInnerHTML={{__html: currency.sign}}/>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="text-end" colSpan={2}>Cash</th>
                                                <th className="text-end">
                                                    <Form.Group className="mb-1" controlId="cash">
                                                        <Form.Control type="number" 
                                                            readOnly={formData.transactions_type == 'cash' || formData.transactions_type == 'both' ? false : true}
                                                            min={0} max={999999999} step="any"
                                                            value={formData.cash}
                                                            onChange={
                                                                e => {
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
                                                                }
                                                            }
                                                        />
                                                    </Form.Group>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="text-end" colSpan={2}>Bank</th>
                                                <th className="text-end">
                                                    <Form.Group className="mb-1" controlId="bank">
                                                        <Form.Control type="number" 
                                                            readOnly={formData.transactions_type == 'bank' || formData.transactions_type == 'both' ? false : true}
                                                            min={0} max={999999999} step="any"
                                                            value={formData.bank}
                                                            onChange={
                                                                e => {
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
                                                                }
                                                            }
                                                        />
                                                    </Form.Group>
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </Col>
                            </Row>

                        </Card.Body>
                        <Card.Footer>
                            <Button className="float-start" variant="warning" 
                                onClick={handelResetVoucher.bind(this)}
                            >
                                Reset
                            </Button>

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
                <Col sm={3}>
                    <Card>
                        <Card.Body>
                            Outstanding : {parseFloat(outstanding).toFixed(2)}<span dangerouslySetInnerHTML={{__html: currency.sign}}/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ToastContainer />

            <Modal
                size="lg"
                show={isAddNewModalOpen}
                onHide={handleAddNewModalClose.bind(this)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Voucher Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-1" controlId="description">
                                <Form.Label className="m-0">description <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" as="textarea"
                                    value={tempDetails.description}
                                    onChange={
                                        e => {
                                            setTempDetails({
                                                ...tempDetails,
                                                description : e.target.value
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-1" controlId="amount">
                                <Form.Label className="m-0">Amount <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" 
                                    min={0} max={999999999} step="any"
                                    value={tempDetails.amount}
                                    onChange={
                                        e => {
                                            if(e.target.value){
                                                let min = e.target.min;
                                                let max = e.target.max;
                                                let value = parseFloat(e.target.value);
                                                let amount = min;
                                                
                                                if(value < min){
                                                    amount = min
                                                }
                                                else if(value > max){
                                                    amount = max
                                                }
                                                else{
                                                    if(value){
                                                        amount = value
                                                    }
                                                    else{
                                                        amount = min
                                                    }
                                                }
                                                setTempDetails({
                                                    ...tempDetails,
                                                    amount : amount
                                                })
                                            }
                                            else{
                                                setTempDetails({
                                                    ...tempDetails,
                                                    amount : ``
                                                })
                                            }
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>                        
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {
                        !isAddingInfo ? 
                        (
                            <Button className="float-end" variant="primary" 
                                onClick={handelAddTempDetailsInfo.bind(this)}
                            >
                                Add
                            </Button>
                        )
                        :(<BtnSaving variant="primary" text="Adding..." />)
                    }
                </Modal.Footer>
            </Modal>

        </React.Fragment>
    )
}
