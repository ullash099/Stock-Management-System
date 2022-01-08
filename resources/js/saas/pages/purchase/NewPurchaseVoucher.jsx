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

export default function NewPurchaseVoucher(props) {
    const toDay = new Date().toISOString().slice(0, 10);
    const [total,setTotal] = React.useState(0)
    const [countRow,setCountRow] = React.useState(0)
    const [isAddingInfo,setAddingInfo] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [isAddNewModalOpen,setAddNewModalOpen] = React.useState(false)
    const [suppliers,setSuppliers] = React.useState([])
    const [warehouses,setWarehouses] = React.useState([])
    const [products,setProducts] = React.useState([])
    const [details,setDetails] = React.useState([])
    const [currency,setCurrency] = React.useState([])
    const [tempDetails,setTempDetails] = React.useState({
        product_id : 0,
        product_name : ``,
        warehouse_id : 0,
        warehouse_name : ``,
        qty : 0,
        purchase_price : 0,
        sales_price : 0,
        vat : 0,
        measurement : ``
    })
    const [formData,setFormData] = React.useState({
        voucher : ``,
        purchase_date : toDay,
        supplier : ``,
        ref : ``,
        total : 0,
        product : [],
        warehouse : [],
        purchase_price : [],
        qty : [],
        sales_price : [],
        vat : [],
    });

    const getDefaultData = async () => {
        await axios.get(AppUrl(`/secure/purchase/get-purchase-vouchers-default-data`))
        .then(response => {
            let info = response.data;

            let suppliers = [];
            if(Object.keys(info.suppliers).length > 0){
                (info.suppliers).map((supplier)=>{
                    suppliers.push({ value: supplier.id, label: supplier.name })
                });
            }
            let products = [];
            if(Object.keys(info.products).length > 0){
                (info.products).map((product)=>{
                    products.push({ 
                        value: product.id, 
                        label: product.name, 
                        purchase_price : product.purchase_price,
                        sales_price : product.sales_price,
                        vat : product.vat,
                        measurement : product.measurement.name,
                    })
                });
            }
            let warehouses = [];
            if(Object.keys(info.warehouses).length > 0){
                (info.warehouses).map((warehouse)=>{
                    warehouses.push({ 
                        value: warehouse.id, 
                        label: warehouse.name
                    })
                });
            }
            setSuppliers(suppliers)
            setProducts(products)
            setWarehouses(warehouses)
            setCurrency(info.currency)
            setFormData({
                ...formData,
                voucher : info.voucher
            })
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    /* details work info */
    const handleAddNewModalShow = () => {
        if (formData.supplier) {            
            setAddNewModalOpen(true)
        }
        else{
            ShowToast({
                type : 'error',
                msg  : `Please select Supplier`
            })
        }
    }

    const handleAddNewModalClose = () => {
        setAddNewModalOpen(false)
        handelResetTempDetails()
    }

    const handelResetTempDetails = () => {
        setTempDetails({
            ...tempDetails,
            product_id : 0,
            product_name : ``,
            warehouse_id : 0,
            warehouse_name : ``,
            qty : 0,
            purchase_price : 0,
            sales_price : 0,
            vat : 0
        })
    }

    const handelAddTempDetailsInfo = () => {
        if 
        (
            tempDetails.product_id && 
            tempDetails.warehouse_id && 
            tempDetails.qty >= 1 && 
            tempDetails.purchase_price >= 1 && 
            tempDetails.sales_price >= 1 
        ) 
        {
            setAddingInfo(true)
            
            let row = countRow+1;

            let detailsInfo = [...details]
            detailsInfo.push(tempDetails)
            setTotal(total+(tempDetails.purchase_price*tempDetails.qty))
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
                msg  : `Please select Product, Warehouse, Purchase Price, Qty, Sales Price`
            })
        }
    }

    const handelResetVoucher = () => {
        handelResetTempDetails()
        setDetails([])
        setCountRow(0)
        setTotal(0)

        setFormData({
            ...formData,
            voucher : ``,
            purchase_date : toDay,
            supplier : ``,
            ref : ``,
        })
        getDefaultData()
    }

    /* saving info */
    const handelSavingInfo = async () => {
        if(details.length > 0){
            setSavingInfo(true);
            const data = new FormData()

            data.append('voucher', formData.voucher)
            data.append('purchase_date', formData.purchase_date)
            data.append('supplier', formData.supplier)
            data.append('ref', formData.ref)
            data.append('total', total)

            details.map((detail,i)=> {
                data.append(`product[`+i+`]`, detail.product_id)
                data.append(`warehouse[`+i+`]`, detail.warehouse_id)
                data.append(`purchase_price[`+i+`]`, detail.purchase_price)
                data.append(`qty[`+i+`]`, detail.qty)
                data.append(`subtotal[`+i+`]`, detail.purchase_price*detail.qty)
                data.append(`sales_price[`+i+`]`, detail.sales_price)
                data.append(`vat[`+i+`]`, detail.vat)
            })
            
            await axios.post(AppUrl(`/secure/purchase/save-purchase-voucher`),data)
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
                msg  : `Purchase details is missing`
            })
        }
    }

    React.useEffect(() => {
        getDefaultData()
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title className='d-inline'>New Purchase Information</Card.Title>
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
                                <Col>
                                    <Form.Group className="mb-2" controlId="voucher">
                                        <Form.Label className="m-0">Voucher</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            readOnly={true}
                                            value={formData.voucher}
                                            onChange={
                                                e => {
                                                    setFormData({
                                                        ...formData,
                                                        voucher : e.target.value
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-2" controlId="voucher_date">
                                        <Form.Label className="m-0">Voucher Date</Form.Label>
                                        <Flatpickr
                                            className="form-control"
                                            data-enable-time={false}
                                            options={{
                                                maxDate : toDay,
                                                dateFormat : 'Y-m-d',
                                            }}
                                            value={formData.purchase_date}
                                            onChange={(date, dateStr)=>{
                                                setFormData({
                                                    ...formData,
                                                    purchase_date : dateStr
                                                })
                                            }} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="supplier">
                                        <Form.Label className="m-0">Supplier <span className="text-danger">*</span></Form.Label>
                                        <Select
                                            value={suppliers.filter(
                                                option => (formData.supplier && option.value.toString() === (formData.supplier).toString())
                                            )}
                                            isClearable
                                            options={suppliers}
                                            onChange={
                                                option => {
                                                    setFormData({
                                                        ...formData,
                                                        supplier : option ? option.value.toString() : `0`
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-2" controlId="ref">
                                        <Form.Label className="m-0">Ref</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={formData.ref}
                                            onChange={
                                                e => {
                                                    setFormData({
                                                        ...formData,
                                                        ref : e.target.value
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col>
                                    <Table striped bordered className='mb-0'>
                                        <thead>
                                            <tr>
                                                <th style={{ width : "5%" }}>#</th>
                                                <th style={{ width : "40%" }}>Purchase Information</th>
                                                <th className="text-center" style={{ width : "15%" }}>Qty</th>
                                                <th className="text-center" style={{ width : "20%" }}>Price</th>
                                                <th className="text-end" style={{ width : "20%" }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(details).length > 0 ? 
                                                    Object.values(details).map((detail,index)=>(
                                                        <tr key={index}>
                                                            <td>{index+1}</td>
                                                            <td>
                                                                {detail.product_name} <br />
                                                                Godowns : {detail.warehouse_name}<br />
                                                                Sales Price : {parseFloat(detail.sales_price).toFixed(2)} <span dangerouslySetInnerHTML={{__html: currency.sign}}/>,
                                                                VAT : {parseFloat(detail.vat).toFixed(2)}%,
                                                            </td>
                                                            <td className="text-center">
                                                                {parseFloat(detail.qty).toFixed(2)} {detail.measurement} 
                                                            </td>
                                                            <td className="text-center">
                                                                {parseFloat(detail.purchase_price).toFixed(2)}
                                                                <span dangerouslySetInnerHTML={{__html: currency.sign}}/>
                                                            </td>
                                                            <td className="text-end">
                                                                {parseFloat(detail.purchase_price*detail.qty).toFixed(2)}
                                                                <span dangerouslySetInnerHTML={{__html: currency.sign}}/>
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
                                                    {parseFloat(total).toFixed(2)}
                                                    <span dangerouslySetInnerHTML={{__html: currency.sign}}/>
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
                    <Modal.Title className="m-0">Purchase Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group className="mb-1" controlId="product">
                                <Form.Label className="m-0">Product <span className="text-danger">*</span></Form.Label>
                                <Select
                                    value={products.filter(
                                        option => (tempDetails.product_id && option.value.toString() === (tempDetails.product_id).toString())
                                    )}
                                    isClearable
                                    options={products}
                                    onChange={
                                        option => {
                                            if(option){
                                                setTempDetails({
                                                    ...tempDetails,
                                                    product_id : option.value,
                                                    product_name : option.label,
                                                    purchase_price : option.purchase_price,
                                                    sales_price : option.sales_price,
                                                    vat : option.vat,
                                                    measurement : option.measurement,
                                                })
                                            }
                                            else{
                                                handelResetTempDetails()
                                            }
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-1" controlId="warehouse">
                                <Form.Label className="m-0">Warehouse <span className="text-danger">*</span></Form.Label>
                                <Select
                                    value={warehouses.filter(
                                        option => (tempDetails.warehouse_id && option.value.toString() === (tempDetails.warehouse_id).toString())
                                    )}
                                    isClearable
                                    options={warehouses}
                                    onChange={
                                        option => {
                                            setTempDetails({
                                                ...tempDetails,
                                                warehouse_id : option ? option.value : 0,
                                                warehouse_name : option ? option.label : 0,
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-1" controlId="purchase_price">
                                <Form.Label className="m-0">Purchase Price <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" 
                                    min={0} max={999999999} step="any"
                                    value={tempDetails.purchase_price}
                                    onChange={
                                        e => {
                                            let min = e.target.min;
                                            let max = e.target.max;
                                            let value = parseFloat(e.target.value);
                                            let purchase_price = min;
                                            
                                            if(value < min){
                                                purchase_price = min
                                            }
                                            else if(value > max){
                                                purchase_price = max
                                            }
                                            else{
                                                if(value){
                                                    purchase_price = value
                                                }
                                                else{
                                                    purchase_price = min
                                                }
                                            }
                                            setTempDetails({
                                                ...tempDetails,
                                                purchase_price : purchase_price
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-1" controlId="qty">
                                <Form.Label className="m-0">Qty <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" 
                                    min={0} max={999999999} step="any"
                                    value={tempDetails.qty}
                                    onChange={
                                        e => {
                                            let min = e.target.min;
                                            let max = e.target.max;
                                            let value = parseFloat(e.target.value);
                                            let qty = min;
                                            
                                            if(value < min){
                                                qty = min
                                            }
                                            else if(value > max){
                                                qty = max
                                            }
                                            else{
                                                if(value){
                                                    qty = value
                                                }
                                                else{
                                                    qty = min
                                                }
                                            }
                                            setTempDetails({
                                                ...tempDetails,
                                                qty : qty
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-1" controlId="sales_price">
                                <Form.Label className="m-0">Sales Price <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" 
                                    min={0} max={999999999} step="any"
                                    value={tempDetails.sales_price}
                                    onChange={
                                        e => {
                                            let min = e.target.min;
                                            let max = e.target.max;
                                            let value = parseFloat(e.target.value);
                                            let sales_price = min;
                                            
                                            if(value < min){
                                                sales_price = min
                                            }
                                            else if(value > max){
                                                sales_price = max
                                            }
                                            else{
                                                if(value){
                                                    sales_price = value
                                                }
                                                else{
                                                    sales_price = min
                                                }
                                            }
                                            setTempDetails({
                                                ...tempDetails,
                                                sales_price : sales_price
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-1" controlId="vat">
                                <Form.Label className="m-0">Vat <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" 
                                    min={0} max={999999999} step="any"
                                    value={tempDetails.vat}
                                    onChange={
                                        e => {
                                            let min = e.target.min;
                                            let max = e.target.max;
                                            let value = parseFloat(e.target.value);
                                            let vat = min;
                                            
                                            if(value < min){
                                                vat = min
                                            }
                                            else if(value > max){
                                                vat = max
                                            }
                                            else{
                                                if(value){
                                                    vat = value
                                                }
                                                else{
                                                    vat = min
                                                }
                                            }
                                            setTempDetails({
                                                ...tempDetails,
                                                vat : vat
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
