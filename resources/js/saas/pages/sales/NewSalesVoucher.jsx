import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import BtnSaving from '../../components/BtnSaving'
import { AppUrl, ShowToast } from '../../Context'
import "flatpickr/dist/themes/material_green.css"
import Flatpickr from "react-flatpickr"
import { 
    Button, Card, Col, Form, InputGroup, ListGroup, Modal, Row, Table 
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify'
import Loading from '../../components/Loading'
import { isNull } from 'lodash'

export default function NewSalesVoucher(props) {
    const ref = React.useRef();
    const toDay = new Date().toISOString().slice(0, 10)
    const [isAddNewModalOpen,setAddNewModalOpen] = React.useState(false)
    const [isAddingInfo,setAddingInfo] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [isSavingInvoice,setSavingInvoice] = React.useState(false)
    const [isRefreshingCart,setRefreshingCart] = React.useState(false)
    const [currency,setCurrency] = React.useState([])
    const [warehouses,setWarehouses] = React.useState([])
    const [customers,setCustomers] = React.useState([])
    const [banks,setBanks] = React.useState([])
    const [products,setProducts] = React.useState([])

    const [cartInfo,setCartInfo] = React.useState({})

    const [cartData,setCartData] = React.useState({
        warehouse : 0,
        product : 0,
        price : 0,
        qty : 0
    });

    const [formData,setFormData] = React.useState({
        id : ``,
        name : ``,
        name_bangla : ``,
        phone : ``,
        phone_alt : ``,
        email : ``,
        customer_address : ``,
        opening_balance : '0',
        discount : '0',
    });

    const [invoiceData,setInvoiceData] = React.useState({
        customer: ``,
        sub_total: 0,
        vat: 0,
        total: 0,
        advance: 0,
        discount: 0,
        net_payable: 0,
        cash: 0,
        bank: ``,
        bank_ref: ``,
        bank_amount: 0,
        receive: 0,
        return_due: 0,
    })

    const handelGetDefaultData = async () => {
        await axios.get(AppUrl(`/secure/sales/get-sales-invoices-default-data`))
        .then(response => {
            let info = response.data;

            let customers = [];
            if(Object.keys(info.customers).length > 0){
                (info.customers).map((customer)=>{
                    customers.push({ value: customer.id, label: customer.name+' ('+customer.phone+')', outstanding : customer.outstanding })
                });
            }
            let warehouses = [];
            if(Object.keys(info.warehouses).length > 0){
                (info.warehouses).map((warehouse)=>{
                    warehouses.push({value: warehouse.id,label: warehouse.name})
                });
            }
            let banks = [];
            if(Object.keys(info.banks).length > 0){
                (info.banks).map((bank)=>{
                    banks.push({value: bank.id,label: bank.name+' ('+bank.account_no+')'})
                });
            }
            setCustomers(customers)
            setWarehouses(warehouses)
            setBanks(banks)
            setCurrency(info.currency)
            /* setFormData({
                ...formData,
                voucher : info.voucher
            }) */
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelGetProducts = async (warehouse) => {
        const data = new FormData()
        data.append('warehouse', warehouse)
        await axios.post(AppUrl(`/secure/product/get-products-by-warehouse`),data)
        .then(response => {
            let infos = response.data.products;

            let products = [];
            if(Object.keys(infos).length > 0){
                (infos).map((info)=>{
                    products.push({ value: info.product.id, label: info.product.name+' ('+info.qty+' /'+info.product.measurement.name+')', price : info.product.sales_price })
                });
            }
            setProducts(products)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelResetCartData = () => {
        setCartData({
            ...cartData,
            warehouse : 0,
            product : 0,
            price : 0,
            qty : 0,
        })
    }

    const handelCartInfo = (info) => {
        setCartInfo(info.cart);
        setRefreshingCart(false)
        setInvoiceData({
            ...invoiceData,
            sub_total : info.sub_total,
            vat : info.total_vat,
            total : info.total,
            net_payable : info.total,
            return_due : -info.total,
        })
    }

    const handelGetCartInfo = async () => {
        setRefreshingCart(true)
        await axios.get(AppUrl(`/secure/sales/get-cart-info`))
        .then(response => {
            let info = response.data;
            handelCartInfo(info)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelClearCart = async () => {
        setRefreshingCart(true)
        await axios.get(AppUrl(`/secure/sales/clear-cart`))
        .then(response => {
            let info = response.data;
            handelCartInfo(info)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelClearCartItem = async (rowId) => {        
        setRefreshingCart(true)
        const data = new FormData()
        data.append('rowid', rowId)
        await axios.post(AppUrl(`/secure/sales/remove-cart-product`),data)
        .then(response => {
            let info = response.data;
            handelCartInfo(info)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelAddToCart = async () => {
        if(cartData.price > 0 || cartData.qty > 0){
            setAddingInfo(true)
            const data = new FormData()
            data.append('warehouse', cartData.warehouse)
            data.append('product', cartData.product)
            data.append('price', cartData.price)
            data.append('qty', cartData.qty)

            await axios.post(AppUrl(`/secure/sales/add-to-cart`),data)
            .then(response => {
                let info = response.data;
                handelCartInfo(info)
                handelResetCartData()
                setAddingInfo(false)
                ref.current.focus()
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
                msg  : `add some Qty`
            })
        }
    }

    /* customer add */
    /* saving info */
    const handleAddNewModalShow = () => setAddNewModalOpen(true);
    const handleAddNewModalClose = () => setAddNewModalOpen(false);

    const handelResetForm = () => {
        setFormData({
            ...formData,
            id : ``,
            name : ``,
            name_bangla : ``,
            phone : ``,
            phone_alt : ``,
            email : ``,
            customer_address : ``,
            opening_balance : '0',
            discount : '0',
        })
    }

    const handelSavingInfo = async () => {
        setSavingInfo(true);
        const data = new FormData()
        data.append('id', formData.id)
        data.append('name', formData.name)
        data.append('name_bangla', formData.name_bangla)
        data.append('phone', formData.phone)
        data.append('phone_alt', formData.phone_alt)
        data.append('email', formData.email)
        data.append('customer_address', formData.customer_address)
        data.append('opening_balance', formData.opening_balance)
        data.append('discount', formData.discount)
        
        await axios.post(AppUrl(`/secure/save-customer`),data)
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
                handelGetDefaultData().then(()=>(
                    handleAddNewModalClose()
                )).then(()=>(
                    handelResetForm()
                ))
            }
            setSavingInfo(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    /* Saving Invoice */
    const handelResetInvoice = () => {
        setInvoiceData({
            ...invoiceData,
            customer: ``,
            sub_total: 0,
            vat: 0,
            total: 0,
            advance: 0,
            discount: 0,
            net_payable: 0,
            cash: 0,
            bank: ``,
            bank_ref: ``,
            bank_amount: 0,
            receive: 0,
            return_due: 0,
        })
    }

    const handelSavingInvoice = async () => {
        if(invoiceData.customer == `` && invoiceData.receive < invoiceData.net_payable){
            ShowToast({
                type : 'error',
                msg  : `Due can't reveive without customer information`
            })
            return false;
        }
        if(invoiceData.receive < 0 || isNull(invoiceData.receive)){
            ShowToast({
                type : 'error',
                msg  : `Receive mustbe 0 or greater than 0`
            })
            return false;
        }

        if (cartInfo.length <= 0) {
            ShowToast({
                type : 'error',
                msg  : `please add some product`
            })
            return false;
        }
        
        setSavingInvoice(true);
        const data = new FormData()
        data.append('customer', invoiceData.customer.toString())
        data.append('sub_total', invoiceData.sub_total.toString())
        data.append('vat', invoiceData.vat.toString())
        data.append('total', invoiceData.total.toString())
        data.append('advance', invoiceData.advance.toString())
        data.append('discount', invoiceData.discount.toString())
        data.append('net_payable', invoiceData.net_payable.toString())
        data.append('cash', invoiceData.cash.toString())
        data.append('bank_amount', invoiceData.bank_amount.toString())
        data.append('bank', invoiceData.bank.toString())
        data.append('bank_ref', invoiceData.bank_ref.toString())
        data.append('receive', invoiceData.receive.toString())
        data.append('return_due', invoiceData.return_due.toString())

        await axios.post(AppUrl(`/secure/sales/save-invoice`),data)
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
                window.open(AppUrl(`/sales/print/`+info.invoice.invoice), "sales-invoice", "fullscreen=yes");
                handelGetDefaultData().then(()=>{handelCartInfo(info.cart),handelResetInvoice()})
            }
            setSavingInvoice(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    React.useEffect(() => {
        handelGetDefaultData().then(()=>handelGetCartInfo())
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card className='mb-1'>
                        <Card.Body className='p-1'>
                            <Row>
                                <Col sm={3}>
                                    <Form.Group className="mb-1" controlId="warehouse">
                                        <Form.Label className="m-0">Warehouse <span className="text-danger">*</span></Form.Label>
                                        <Select ref={ref}
                                            value={warehouses.filter(
                                                option => (cartData.warehouse && option.value.toString() === (cartData.warehouse).toString())
                                            )}
                                            autoFocus
                                            options={warehouses}
                                            onChange={
                                                option => {
                                                    setCartData({
                                                        ...cartData,
                                                        warehouse : option.value,
                                                    })
                                                    handelGetProducts(option.value)
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={4}>
                                    <Form.Group className="mb-1" controlId="product">
                                        <Form.Label className="m-0">Product <span className="text-danger">*</span></Form.Label>
                                        <Select
                                            value={products.filter(
                                                option => (cartData.product && option.value.toString() === (cartData.product).toString())
                                            )}
                                            isClearable
                                            options={products}
                                            onChange={
                                                option => {
                                                    setCartData({
                                                        ...cartData,
                                                        product : option ? option.value.toString() : `0`,
                                                        price : option ? option.price.toString() : `0`
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={2}>
                                    <Form.Group className="mb-1" controlId="price">
                                        <Form.Label className="m-0">Price <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="number" 
                                            max={999999999} step="any"
                                            value={cartData.price}
                                            onKeyPress={
                                                e => {
                                                    if(e.which === 13){
                                                        handelAddToCart()
                                                    }
                                                }
                                            }
                                            onChange={
                                                e => {
                                                    let max = e.target.max;
                                                    let value = parseFloat(e.target.value);
                                                    let price = ``;
                                                    
                                                    if(value > max){
                                                        price = max
                                                    }
                                                    else{
                                                        if(value){
                                                            price = value
                                                        }
                                                    }
                                                    setCartData({
                                                        ...cartData,
                                                        price : price
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={3}>
                                    <Form.Group className="mb-1" controlId="qty">
                                        <Form.Label className="m-0">Qty <span className="text-danger">*</span></Form.Label>
                                        <InputGroup>
                                            <Form.Control type="number"
                                                max={999999999} step="any"
                                                value={cartData.qty}
                                                onKeyPress={
                                                    e => {
                                                        if(e.which === 13){
                                                            handelAddToCart()
                                                        }
                                                    }
                                                }
                                                onChange={
                                                    e => {
                                                        let max = e.target.max;
                                                        let value = parseFloat(e.target.value);
                                                        let qty = ``;
                                                        
                                                        if(value > max){
                                                            qty = max
                                                        }
                                                        else{
                                                            if(value){
                                                                qty = value
                                                            }
                                                        }
                                                        setCartData({
                                                            ...cartData,
                                                            qty : qty
                                                        })
                                                    }
                                                }
                                            />
                                            {
                                                !isAddingInfo ? (
                                                    <Button variant="primary" className="input-group-text"
                                                        onClick={handelAddToCart.bind(this)} 
                                                    >
                                                        Add
                                                    </Button>
                                                ):(<BtnSaving variant="primary" text="Adding..." />)
                                            }
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col sm={12} md={6}>
                    {
                        Object.keys(cartInfo).length > 0 ? (
                            <ListGroup>
                                <ListGroup.Item>
                                    <Button variant='danger' className='float-end'
                                        onClick={handelClearCart.bind(this)}
                                    >
                                        <i className="uil uil-trash-alt"></i>
                                    </Button>
                                </ListGroup.Item>
                                {
                                    !isRefreshingCart ?
                                    (Object.values(cartInfo).map((cart,index)=>(
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col sm={8}>
                                                    <p className='m-0'>{cart.name} ({cart.quantity} /{cart.attributes.measurement} x {cart.price}<span dangerouslySetInnerHTML={{__html: currency.sign}}/>) {cart.quantity*cart.price}<span dangerouslySetInnerHTML={{__html: currency.sign}}/></p>
                                                    <p className='m-0'>{cart.attributes.warehouse_name}</p>
                                                </Col>
                                                <Col sm={4}>
                                                    <Button variant='danger' className='p-0 float-end'
                                                        onClick={()=>handelClearCartItem(cart.id)}
                                                    >
                                                        <i className="uil uil-trash-alt"></i>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )))
                                    :(<ListGroup.Item className="text-center"><Loading /></ListGroup.Item>)
                                }
                            </ListGroup>
                        ) :
                        (<Card><Card.Body></Card.Body></Card>)
                    }
                </Col>
                <Col sm={12} md={6}>
                    <Card>
                        <Card.Body>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="customer">
                                        <Form.Label className="m-0">
                                            <span>Customer </span>
                                            <Button variant="primary" className="p-0 ml-2"
                                                onClick={handleAddNewModalShow.bind(this)} 
                                            >
                                                <i className="uil uil-plus"></i>
                                            </Button>
                                        </Form.Label>
                                        
                                        <Select styles={{ width : "70%" }}
                                            value={customers.filter(
                                                option => (invoiceData.customer && option.value.toString() === (invoiceData.customer).toString())
                                            )}
                                            isClearable
                                            options={customers}
                                            onChange={
                                                option => {
                                                    if(option){
                                                        if(option.outstanding < 0){
                                                            let advance = parseFloat(option.outstanding*-1)
                                                            let discount = parseFloat(invoiceData.discount)

                                                            let advance_amount = (parseFloat(invoiceData.sub_total) < advance) ? invoiceData.sub_total : advance;
                                                            
                                                            let net_payable = (parseFloat(invoiceData.sub_total)-(advance_amount+discount))+invoiceData.vat;
                                                            let reveive = parseFloat(invoiceData.cash)+parseFloat(invoiceData.bank_amount)
                                                            let return_due = reveive-net_payable
    
                                                            setInvoiceData({
                                                                ...invoiceData,
                                                                customer : option.value,
                                                                advance : advance_amount,
                                                                net_payable : net_payable,
                                                                return_due : return_due
                                                            })
                                                        }
                                                        else{
                                                            setInvoiceData({
                                                                ...invoiceData,
                                                                customer : option.value,
                                                            })
                                                        }
                                                    }
                                                    else{
                                                        setInvoiceData({
                                                            ...invoiceData,
                                                            customer : ``,
                                                            advance : 0,
                                                            net_payable : parseFloat(invoiceData.sub_total),
                                                            return_due : parseFloat(invoiceData.sub_total)
                                                        })
                                                    }
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="sub_total">
                                        <Form.Label className="m-0">Sub Total</Form.Label>
                                        <Form.Control type="number" readOnly
                                            min={0} 
                                            max={999999999} step="any"
                                            value={invoiceData.sub_total}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="vat">
                                        <Form.Label className="m-0">VAT</Form.Label>
                                        <Form.Control type="number" readOnly
                                            min={0} 
                                            max={999999999} step="any"
                                            value={invoiceData.vat}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="total">
                                        <Form.Label className="m-0">Total</Form.Label>
                                        <Form.Control type="number" readOnly
                                            min={0} 
                                            max={999999999} step="any"
                                            value={invoiceData.total}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="advance">
                                        <Form.Label className="m-0">Advance</Form.Label>
                                        <Form.Control type="number" readOnly
                                            min={0} 
                                            max={999999999} step="any"
                                            value={invoiceData.advance}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="discount">
                                        <Form.Label className="m-0">Discount</Form.Label>
                                        <Form.Control type="number"
                                            max={999999999} step="any"
                                            value={invoiceData.discount}
                                            onChange={e=>{
                                                if(e.target.value){
                                                    let discount = parseFloat(e.target.value)
                                                    let advance = parseFloat(invoiceData.advance)

                                                    let net_payable = parseFloat(invoiceData.total)- (advance+discount)
                                                    let reveive = parseFloat(invoiceData.cash)+parseFloat(invoiceData.bank_amount)
                                                    let return_due = reveive-net_payable

                                                    setInvoiceData({
                                                        ...invoiceData,
                                                        discount : discount,
                                                        net_payable : net_payable,
                                                        return_due : return_due,
                                                    })
                                                }
                                                else{
                                                    setInvoiceData({
                                                        ...invoiceData,
                                                        discount : ``
                                                    })
                                                    ShowToast({
                                                        type : 'error',
                                                        msg  : `Discount mustbe 0 or greater than 0`
                                                    }) 
                                                }
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="net_payable">
                                        <Form.Label className="m-0">Net Payable</Form.Label>
                                        <Form.Control type="number" readOnly
                                            min={0} 
                                            max={999999999} step="any"
                                            value={invoiceData.net_payable}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="cash">
                                        <Form.Label className="m-0">Cash</Form.Label>
                                        <Form.Control type="number"
                                            step="any"
                                            value={invoiceData.cash}
                                            onChange={e=>{
                                                let cash = e.target.value;
                                                let receive = cash ? parseFloat(invoiceData.bank_amount)+parseFloat(cash) : 0;
                                                setInvoiceData({
                                                    ...invoiceData,
                                                    cash : cash ? parseFloat(cash) : ``,
                                                    receive : receive,
                                                    return_due : receive-parseFloat(invoiceData.net_payable)
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="bank_amount">
                                        <Form.Label className="m-0">Bank Amount</Form.Label>
                                        <Form.Control type="number" 
                                            step="any" 
                                            value={invoiceData.bank_amount}
                                            onChange={e=>{

                                                let bank_amount = e.target.value;
                                                let receive = bank_amount ? parseFloat(invoiceData.cash)+parseFloat(bank_amount) : 0;

                                                setInvoiceData({
                                                    ...invoiceData,
                                                    bank_amount : bank_amount ? parseFloat(bank_amount) : ``,
                                                    receive : receive,
                                                    return_due : receive-parseFloat(invoiceData.net_payable)
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="bank">
                                        <Form.Label className="m-0">Bank</Form.Label>
                                        
                                        <Select styles={{ width : "70%" }}
                                            value={banks.filter(
                                                option => (invoiceData.bank && option.value.toString() === (invoiceData.bank).toString())
                                            )}
                                            options={banks}
                                            onChange={
                                                option => {
                                                    setInvoiceData({
                                                        ...invoiceData,
                                                        bank : option ? option.value : ``,
                                                    })
                                                }
                                            }
                                        />

                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="bank_ref">
                                        <Form.Label className="m-0">Bank Ref.</Form.Label>
                                        <Form.Control type="text"
                                            value={invoiceData.bank_ref}
                                            onChange={e=>{
                                                setInvoiceData({
                                                    ...invoiceData,
                                                    bank_ref : e.target.value
                                                });
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="receive">
                                        <Form.Label className="m-0">Receive</Form.Label>
                                        <Form.Control type="number" readOnly
                                            min={0} 
                                            max={999999999} step="any"
                                            value={invoiceData.receive}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="return_due">
                                        <Form.Label className="m-0">
                                            {invoiceData.return_due <= 0 ?  `Due`: `Return`}
                                            {/* (-)Return / (+)Due */}
                                        </Form.Label>
                                        <Form.Control type="number" readOnly
                                            min={0} 
                                            max={999999999} step="any"
                                            value={invoiceData.return_due}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                        </Card.Body>
                        <Card.Footer>
                            {
                                !isSavingInvoice ? 
                                (
                                    <Button className="float-end" variant="primary" 
                                        onClick={handelSavingInvoice.bind(this)}
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
            
            <ToastContainer />

            <Modal
                size="xl"
                show={isAddNewModalOpen}
                onHide={handleAddNewModalClose.bind(this)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Customer Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>                        

                            <Form.Group className="mb-1" controlId="name">
                                <Form.Label className="m-0">Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    required={true} 
                                    type="text" 
                                    value={formData.name}
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                name : e.target.value
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-1" controlId="name_bangla">
                                <Form.Label className="m-0">Name (Bangla)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formData.name_bangla}
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                name_bangla : e.target.value ? e.target.value : ``
                                            })
                                        }
                                    }
                                />
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="phone">
                                        <Form.Label className="m-0">Phone <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            required={true} 
                                            type="text" 
                                            value={formData.phone}
                                            onChange={
                                                e => {
                                                    setFormData({
                                                        ...formData,
                                                        phone : e.target.value
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="phone_alt">
                                        <Form.Label className="m-0">Phone (Alternative)</Form.Label>
                                        <Form.Control
                                            type="number" 
                                            value={formData.phone_alt}
                                            onChange={
                                                e => {
                                                    setFormData({
                                                        ...formData,
                                                        phone_alt : e.target.value ? e.target.value : ``
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>      
                                </Col>
                            </Row>                            

                            <Form.Group className="mb-1" controlId="email">
                                <Form.Label className="m-0">Email</Form.Label>
                                <Form.Control
                                    type="email" 
                                    value={formData.email}
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                email : e.target.value ? e.target.value : ``
                                            })
                                        }
                                    }
                                />
                            </Form.Group>

                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="opening_balance">
                                        <Form.Label className="m-0">Opening Balance <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="number" 
                                            readOnly={true}
                                            min={-999999999} max={999999999} step="any"
                                            value={formData.opening_balance}
                                            onChange={
                                                e => {
                                                    let min = e.target.min;
                                                    let max = e.target.max;
                                                    let value = parseFloat(e.target.value);
                                                    let opening_balance = min;
                                                    
                                                    if(value < min){
                                                        opening_balance = min
                                                    }
                                                    else if(value > max){
                                                        opening_balance = max
                                                    }
                                                    else{
                                                        if(value){
                                                            opening_balance = value
                                                        }
                                                        else{
                                                            opening_balance = min
                                                        }
                                                    }
                                                    setFormData({
                                                        ...formData,
                                                        opening_balance : opening_balance
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>                                
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="discount">
                                        <Form.Label className="m-0">Discount <span className="text-danger">*</span></Form.Label>
                                        <InputGroup>
                                            <Form.Control type="number" 
                                                min={0} max={100} step="any"
                                                value={formData.discount}
                                                onChange={
                                                    e => {
                                                        let min = e.target.min;
                                                        let max = e.target.max;
                                                        let value = parseFloat(e.target.value);
                                                        let discount = min;
                                                        
                                                        if(value < min){
                                                            discount = min
                                                        }
                                                        else if(value > max){
                                                            discount = max
                                                        }
                                                        else{
                                                            if(value){
                                                                discount = value
                                                            }
                                                            else{
                                                                discount = min
                                                            }
                                                        }
                                                        setFormData({
                                                            ...formData,
                                                            discount : discount
                                                        })
                                                    }
                                                }
                                            />
                                            <InputGroup.Text>%</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-2" controlId="customer_address">
                                <Form.Label className="m-0">Customer Address</Form.Label>
                                <Form.Control type="text" style={{ height: "10.5rem", resize: "none" }}
                                    as="textarea"
                                    value={formData.customer_address} 
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                customer_address : e.target.value ? e.target.value : ``
                                            })
                                        }
                                    }
                                />
                            </Form.Group>

                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
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
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}
