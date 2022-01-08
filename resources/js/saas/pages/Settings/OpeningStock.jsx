import React from 'react'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import { AppUrl, ShowToast } from '../../Context'
import BtnSaving from '../../components/BtnSaving'
import { 
    Button, Card, Col, Form, FormControl, InputGroup, Modal, Row, Table 
} from 'react-bootstrap';
import Loading from '../../components/Loading'

export default function OpeningStock(props) {
    const [appLink,setApplink] = React.useState(AppUrl(`/secure/settings/get-opening-stocks?`))
    const [isrefreshingList,setRefreshingList] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [isAddNewModalOpen,setAddNewModalOpen] = React.useState(false)
    const [categories,setCategories] = React.useState([])
    const [warehouses,setWarehouses] = React.useState([])
    const [products,setProducts] = React.useState([])

    const [query,setQuery] = React.useState({
        src : ``,
    })

    const [data,setData] = React.useState({
        infos : {},
        paginations : {},
        prev_page_url : null,
        last_page_url : null,
        from : 0,
        to : 0,
        total : 0
    })

    const [formData,setFormData] = React.useState({
        warehouse : `0`,
        category : `0`,
        product : `0`,
        qty : 0
    })

    /* get list */
    const getList = async (url = {src:``}) => {
        setRefreshingList(true)
        await axios.get(appLink+'src='+url.src)
        .then(response => {
            let info = response.data;
            
            setData({
                ...data,
                infos : info.data,
                paginations : info.links,
                prev_page_url : info.prev_page_url,
                last_page_url : info.last_page_url,
                from : info.from,
                to : info.to,
                total : info.total
            })
            setRefreshingList(false)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const getDefaultData = async () => {
        await axios.get(AppUrl(`/secure/settings/get-opening-stock-default-data`))
        .then(response => {
            let info = response.data;

            let categories = [];
            if(Object.keys(info.categories).length > 0){
                (info.categories).map((category)=>{
                    categories.push({ value: category.id, label: category.name })
                });
            }
            let warehouses = [];
            if(Object.keys(info.warehouses).length > 0){
                (info.warehouses).map((warehouse)=>{
                    warehouses.push({ value: warehouse.id, label: warehouse.name })
                });
            }
            setCategories(categories)
            setWarehouses(warehouses)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const getProductsByCategory =async (warehouse,category) => {
        setProducts([])
        const srcData = new FormData()
        srcData.append('category', category)
        srcData.append('warehouse', warehouse)
        await axios.post(AppUrl(`/secure/settings/get-opening-stock-products-by-category`),srcData)
        .then(response => {
            let info = response.data;            
            let products = [];
            if(Object.keys(info.products).length > 0){
                (info.products).map((product)=>{
                    products.push({ value: product.id, label: product.name })
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

    /* reset work */
    const handelResetForm = () => {
        setFormData({
            ...formData,
            warehouse : `0`,
            category : `0`,
            product : `0`,
            qty : 0
        })
    }

    /* saving info */
    const handleAddNewModalShow = () => setAddNewModalOpen(true);
    const handleAddNewModalClose = () => {
        setAddNewModalOpen(false)
        handelResetForm()
    };

    const handelSavingInfo = async () => {
        setSavingInfo(true);
        const data = new FormData()
        data.append('warehouse', formData.warehouse.toString())
        data.append('category', formData.category.toString())
        data.append('product', formData.product.toString())
        data.append('qty', formData.qty.toString())
        
        await axios.post(AppUrl(`/secure/settings/save-opening-stock`),data)
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
                setFormData({
                    ...formData,
                    category : `0`,
                    product : `0`,
                    qty : 0
                })
                getList({src : query.src})
            }
            setSavingInfo(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    /* search work */
    const handelSrcQuery = (e) => {
        let src = e.target.value;
        setQuery({
            ...query,
            src : src
        })
        getList({src : src})
    }

    const handelSearch = () => {
        getList({src : query.src})
    }

    const handelPaginations = async (url) => {
        if(url){
            window.scrollTo(0, 0)
            setRefreshingList(true)
            setApplink(url+'&');
            let actionUrl = url+'&src='+query.src;
            await axios.get(actionUrl)
            .then(response => {
                let info = response.data;
                setData({
                    ...data,
                    infos : info.data,
                    paginations : info.links,
                    prev_page_url : info.prev_page_url,
                    last_page_url : info.last_page_url,
                    from : info.from,
                    to : info.to,
                    total : info.total
                })
                setRefreshingList(false)
            })
            .catch(function (error) {
                if(error == 'Error: Request failed with status code 401'){
                    location.reload()
                }
            });
        }
    }

    React.useEffect(() => {
        getDefaultData().then(()=>getList({src : query.src}))
    }, [props]);

    return (
        <React.Fragment>
            <Card>
                <Card.Header className="bg-secondary text-white">
                    <Card.Title className='d-inline'>Opening Stock List</Card.Title>
                    <Button variant="success" className="float-end" 
                        onClick={handleAddNewModalShow.bind(this)}
                    >
                        <i className="uil uil-plus-circle fs-4"></i> Add New
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-2">

                        <Col md={4} sm={12}></Col>
                        <Col md={4} sm={12}>
                            <div className="text-center">
                                Showing {data.from ? data.from : 0} to {data.to ? data.to : 0} of {data.total}
                            </div>
                        </Col>
                        <Col md={4} sm={12}></Col>
                            
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <div className="app-search dropdown d-none d-lg-block">
                                <InputGroup>
                                    <FormControl placeholder="Search..." 
                                        onChange={handelSrcQuery.bind(this)} 
                                    />
                                    <span className="mdi mdi-magnify search-icon"></span>
                                    <Button variant="primary" className="input-group-text"
                                        onClick={handelSearch.bind(this)} 
                                    >
                                        Search
                                    </Button>
                                </InputGroup>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <Table striped bordered className='mb-0'>
                                <thead>
                                    <tr>
                                        <th style={{ width : "30%" }}>Warehouse</th>
                                        <th style={{ width : "30%" }}>Category</th>
                                        <th style={{ width : "30%" }}>Product</th>
                                        <th className="text-end" style={{ width : "10%" }}>Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(data.infos).length > 0 ?
                                        (
                                            isrefreshingList ? 
                                            (<tr><td colSpan={4} className="text-center py-3"><Loading /></td></tr>)
                                            :(
                                                Object.values(data.infos).map((info,index)=>(
                                                    <tr key={index}>
                                                        <td>{info.warehouse.name}</td>
                                                        <td>{info.category.name}</td>
                                                        <td>{info.product.name}</td>
                                                        <td className='text-end'>{info.qty} /{info.product.measurement.name}</td>
                                                    </tr>
                                                ))
                                            )
                                        )
                                        :(
                                            isrefreshingList ? 
                                            (<tr><td colSpan={4} className="text-center py-3"><Loading /></td></tr>)
                                            :(<tr><td colSpan={4} className="text-center py-3"><h3>No Data Found</h3></td></tr>)
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                </Card.Body>
                <Card.Footer>
                    {
                        <Row>
                            <Col sm={12}>
                                <div className="paging_simple_numbers float-end">
                                    <div className="pagination pagination-rounded">
                                        <ul className="pagination pagination-rounded">
                                            {
                                                Object.keys(data.paginations).length > 0 ? (
                                                    (data.paginations).map((paginate,i)=>(
                                                        <li key={i} className={
                                                            (paginate.label == "&laquo; Previous") ?
                                                                (data.prev_page_url) ? `paginate_button page-item previous` : `paginate_button page-item previous disabled`
                                                            :(paginate.label == "Next &raquo;") ?
                                                                (data.url) ? `paginate_button page-item next` : `paginate_button page-item next disabled`
                                                            :   (paginate.active) ? `paginate_button page-item active` : `paginate_button page-item`
                                                        }>
                                                            {
                                                                paginate.label == "&laquo; Previous" ? (
                                                                    <Link to="#" className="page-link"
                                                                        onClick={(e)=>{
                                                                            e.preventDefault();
                                                                            handelPaginations(paginate.url)
                                                                        }}
                                                                    >
                                                                        <i className="mdi mdi-chevron-left"></i>
                                                                    </Link>
                                                                )
                                                                : paginate.label == "Next &raquo;" ? (
                                                                    <Link to="#" className="page-link"
                                                                        onClick={(e)=>{
                                                                            e.preventDefault();
                                                                            handelPaginations(paginate.url)
                                                                        }}
                                                                    >
                                                                        <i className="mdi mdi-chevron-right"></i>
                                                                    </Link>
                                                                ) 
                                                                : paginate.label == "..." ? (
                                                                    <Link to="#" className="page-link"
                                                                        onClick={(e)=>(e.preventDefault())}
                                                                    >
                                                                        {paginate.label}
                                                                    </Link>
                                                                )
                                                                :(
                                                                    !paginate.active ? (
                                                                        <Link to="#" className="page-link"
                                                                            onClick={(e)=>{
                                                                                e.preventDefault();
                                                                                handelPaginations(paginate.url)
                                                                            }}
                                                                        >
                                                                            {paginate.label}
                                                                        </Link>
                                                                    ) : (
                                                                        <Link to="#" className="page-link"
                                                                            onClick={(e)=>(e.preventDefault())}
                                                                        >
                                                                            {paginate.label}
                                                                        </Link>
                                                                    )
                                                                )
                                                            }
                                                        </li>
                                                    ))
                                                ):(``)
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    }
                </Card.Footer>
            </Card>

            <ToastContainer />

            <Modal
                size="xl"
                show={isAddNewModalOpen}
                onHide={handleAddNewModalClose.bind(this)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Opening Stock Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group className="mb-1" controlId="warehouse">
                                <Form.Label className="m-0">Warehouse <span className="text-danger">*</span></Form.Label>
                                <Select
                                    value={warehouses.filter(
                                        option => (formData.warehouse && option.value.toString() === (formData.warehouse).toString())
                                    )}
                                    isClearable
                                    options={warehouses}
                                    onChange={
                                        option => {
                                            let warehouse = option ? option.value.toString() : `0`
                                            setFormData({
                                                ...formData,
                                                warehouse : warehouse
                                            })
                                            getProductsByCategory(warehouse,formData.category)
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-1" controlId="category">
                                <Form.Label className="m-0">Category <span className="text-danger">*</span></Form.Label>
                                <Select
                                    value={categories.filter(
                                        option => (formData.category && option.value.toString() === (formData.category).toString())
                                    )}
                                    isClearable
                                    options={categories}
                                    onChange={
                                        option => {
                                            let category = option ? option.value.toString() : `0`
                                            setFormData({
                                                ...formData,
                                                category :category
                                            })
                                            getProductsByCategory(formData.warehouse,category)
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-1" controlId="product">
                                <Form.Label className="m-0">Product <span className="text-danger">*</span></Form.Label>
                                <Select
                                    value={products.filter(
                                        option => (formData.product && option.value.toString() === (formData.product).toString())
                                    )}
                                    isClearable
                                    options={products}
                                    onChange={
                                        option => {
                                            setFormData({
                                                ...formData,
                                                product : option ? option.value.toString() : `0`
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
                                    value={formData.qty}
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
                                            setFormData({
                                                ...formData,
                                                qty : qty
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
