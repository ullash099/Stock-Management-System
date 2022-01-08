import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BtnSaving from '../../components/BtnSaving'
import Loading from '../../components/Loading'
import { AppUrl, ShowToast } from '../../Context'
import Swal from 'sweetalert2'
import { 
    Button, Card, Col, DropdownButton, Dropdown, Form, FormControl, 
    InputGroup, Modal, Row, Table 
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify'

export default function Products(props) {
    const [appLink,setApplink] = React.useState(AppUrl(`/secure/product/get-products?`))
    const [isAddNewModalOpen,setAddNewModalOpen] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [isEditingInfo,setEditingInfo] = React.useState(false)
    const [checkBox,setCheckBox] = React.useState([])
    const [isrefreshingList,setRefreshingList] = React.useState(false)
    const [blockItems,setBlockItems] = React.useState([])

    const [categories,setCategories] = React.useState([])
    const [measurements,setMeasurements] = React.useState([])
    const [currency,setCurrency] = React.useState([])

    const listOptions = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'deactivated', label: 'deactivated' }
    ]

    const [query,setQuery] = React.useState({
        sortBy : 'all',
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
    });

    const [formData,setFormData] = React.useState({
        id : ``,
        name : ``,
        name_bangla : ``,
        category : `0`,
        measurement : `0`,
        purchase_price : 0,
        sales_price : 0,
        vat : 0,
        reorder_qty : 0,
    });

    /* get categories & measurements */
    const getCreateInfo = async () => {
        await axios.post(AppUrl(`/secure/product/get-products-create-info`))
        .then(response => {
            let info = response.data;

            let categories = [];
            if(Object.keys(info.categories).length > 0){
                (info.categories).map((category)=>{
                    categories.push({ value: category.id, label: category.name })
                });
            }
            let measurements = [];
            if(Object.keys(info.measurements).length > 0){
                (info.measurements).map((measurement)=>{
                    measurements.push({ value: measurement.id, label: measurement.name })
                });
            }
            setCategories(categories)
            setMeasurements(measurements)
            setCurrency(info.currency)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    /* get list */
    const getList = async (url = {sortBy:``,src:``}) => {
        setRefreshingList(true)
        await axios.get(appLink+'sort_by='+url.sortBy+'&src='+url.src)
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
            setCheckBox(new Array((info.data).length).fill(false));
            setRefreshingList(false)
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
            id : ``,
            name : ``,
            name_bangla : ``,
            category : '0',
            measurement : '0',
            purchase_price : 0,
            sales_price : 0,
            vat : 0,
            reorder_qty : 0,
        })
        setEditingInfo(false)
    }

    /* saving info */
    const handleAddNewModalShow = () => setAddNewModalOpen(true);
    const handleAddNewModalClose = () => setAddNewModalOpen(false);

    const handelSavingInfo = async () => {
        setSavingInfo(true);
        const data = new FormData()
        data.append('id', formData.id)
        data.append('name', formData.name)
        data.append('name_bangla', formData.name_bangla)
        data.append('category', formData.category)
        data.append('measurement', formData.measurement)
        data.append('purchase_price', formData.purchase_price.toString())
        data.append('sales_price', formData.sales_price.toString())
        data.append('vat', formData.vat.toString())
        data.append('reorder_qty', formData.reorder_qty.toString())
        
        await axios.post(AppUrl(`/secure/product/save-product`),data)
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
                if(isEditingInfo){
                    setEditingInfo(false)
                }
                handelResetForm()
                handleAddNewModalClose()
                getList({sortBy : query.sortBy, src : query.src})
            }
            setSavingInfo(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    /* edit work */
    const handelEditWork = (obj) => {
        setFormData({
            ...formData,
            id : obj.id,
            name : obj.name,
            name_bangla : obj.name_bangla ? obj.name_bangla : ``,
            category : obj.category_id,
            measurement : obj.measurement_id,
            purchase_price : obj.purchase_price,
            sales_price : obj.sales_price,
            vat : obj.vat,
            reorder_qty : obj.reorder_qty,
        })
        setEditingInfo(true)
        handleAddNewModalShow()
    }

    /* Block unblock work start */
    const handelCheckAll = (position,e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        const selectedItems = [];
        if(value == 'all'){
            if(checked){
                setCheckBox(new Array(Object.values(data.infos).length).fill(true));
                setBlockItems(Object.values(data.infos).map((info)=>{
                    return info.id;
                }))
            }
            else{
                setCheckBox(new Array(Object.values(data.infos).length).fill(false));
                setBlockItems(selectedItems);
            }
        }
        else{
            const updatedCheckedState = checkBox.map((item, index) =>
                index === position ? !item : item
            );
            
            setCheckBox(updatedCheckedState);
            Object.values(data.infos).map((info,index)=>{
                let status = updatedCheckedState[index];
                if(status){
                    selectedItems.push(info.id);
                }
            })
            setBlockItems(selectedItems);
        }
    }

    const handelUnblock = async (id) => {
        if(id){
            Swal.fire({
                title: 'Are you sure?',
                text: "Don't worry, you can block this information again!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Unblock it!'
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const data = new FormData()
                    data.append('id', id)
                    await axios.post(AppUrl(`/secure/product/unblock-product`),data)
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
                        }
                        getList({sortBy : query.sortBy, src : query.src})
                    })
                    .catch(function (error) {
                        if(error == 'Error: Request failed with status code 401'){
                            location.reload()
                        }
                    });
                }
            })
        }
        else{
            ShowToast({
                type : 'error',
                msg  : `unexpected error`
            })
        }
    }

    const handelBlockSelectedItems = async () => {
        if(blockItems.length > 0){
            Swal.fire({
                title: 'Are you sure?',
                text: "Don't worry, you can unblock information later!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Block it!'
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const data = new FormData()
                    data.append('items', blockItems.toString())
                    await axios.post(AppUrl(`/secure/product/block-products`),data)
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
                        }
                        getList({sortBy : query.sortBy, src : query.src})
                    })
                    .catch(function (error) {
                        if(error == 'Error: Request failed with status code 401'){
                            location.reload()
                        }
                    });
                }
            })
        }
        else{
            ShowToast({
                type : 'error',
                msg  : `Please select item (s)`
            })
        }
    }

    /* search work */
    const handelSortByQuery = (e) => {
        setQuery({
            ...query,
            sortBy : e
        })
        getList({sortBy : e, src : query.src})
    }

    const handelSrcQuery = (e) => {
        let src = e.target.value;
        setQuery({
            ...query,
            src : src
        })
        getList({sortBy : query.sortBy, src : src})
    }

    const handelSearch = () => {
        getList({sortBy : query.sortBy, src : query.src})
    }

    const handelPaginations = async (url) => {
        if(url){
            window.scrollTo(0, 0)
            setRefreshingList(true)
            setApplink(url+'&');
            let actionUrl = url+'&sort_by='+query.sortBy+'&src='+query.src;
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
                setCheckBox(new Array((info.data).length).fill(false));
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
        getCreateInfo().then(()=>getList({sortBy : query.sortBy, src : query.src}))
    }, [props]);
    
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title className='d-inline'>Products List</Card.Title>
                            <Button variant="success" className="float-end" onClick={handleAddNewModalShow.bind(this)}>
                                <i className="uil uil-plus-circle fs-4"></i> Add New
                            </Button>
                        </Card.Header>
                        <Card.Body>

                            <Row className="mb-2">

                                <Col md={4} sm={12}>
                                    <Button variant="danger" onClick={handelBlockSelectedItems.bind(this)}>
                                        <i className="uil uil-trash-alt"></i> Block Selected
                                    </Button>
                                </Col>
                                <Col md={4} sm={12}>
                                    <div className="text-center">
                                        Showing {data.from ? data.from : 0} to {data.to ? data.to : 0} of {data.total}
                                    </div>
                                </Col>
                                <Col md={4} sm={12}>
                                    {/* <Button variant="success" 
                                        onClick={handleImportModalShow.bind(this)}
                                    >
                                        <i className="dripicons-cloud-upload"></i> Import
                                    </Button> */}
                                    <Link to={AppUrl(`/secure/product/export-products`)} target="_blank" className="btn btn-success float-end">
                                        <i className="dripicons-cloud-download"></i> Export
                                    </Link>
                                </Col>
                                    
                            </Row>

                            <Row className="mb-2">
                                <Col md={2} sm={12}>
                                    <Select
                                        defaultValue={listOptions.filter(
                                            option => option.value.toString() === 'all'
                                        )}
                                        options={listOptions}
                                        onChange={item => handelSortByQuery(item ? item.value : 'all')}
                                    />
                                </Col>
                                <Col md={10} sm={12}>
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
                                                <th className="text-center" style={{ width : "2%" }}>
                                                    <Form.Group>
                                                        <Form.Check 
                                                            type="checkbox" 
                                                            checked={
                                                                Object.keys(data.infos).length > 0 && Object.keys(data.infos).length ==  Object.keys(blockItems).length ? true : false
                                                            } 
                                                            label="All" value="all" 
                                                            onChange={handelCheckAll.bind(this,0)} 
                                                        />
                                                    </Form.Group>
                                                </th>
                                                <th style={{ width : "50%" }}>Name</th>
                                                <th className="text-center" style={{ width : "15%" }}>Purchase Price</th>
                                                <th className="text-center" style={{ width : "8%" }}>Vat</th>
                                                <th className="text-center" style={{ width : "15%" }}>Reorder Qty</th>
                                                <th className="text-end" style={{ width : "10%" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(data.infos).length > 0 ?
                                                (
                                                    isrefreshingList ? 
                                                    (<tr><td colSpan={6} className="text-center py-3"><Loading /></td></tr>)
                                                    :(
                                                        Object.values(data.infos).map((info,index)=>(
                                                            <tr key={index}>
                                                                <td>
                                                                    <Form.Group>
                                                                        <Form.Check 
                                                                            type="checkbox" 
                                                                            checked={checkBox[index]} 
                                                                            value={info.id} 
                                                                            onChange={handelCheckAll.bind(this,index)} 
                                                                        />
                                                                    </Form.Group>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        !info.deleted_at ? (
                                                                        <span style={{ cursor : "pointer" }} onClick={handelCheckAll.bind(this,index)}>
                                                                            {info.name} {info.name_bangla ? `(`+info.name_bangla+`)` : ``}<br />{info.category.name}
                                                                        </span>):
                                                                        (<del>{info.name} {info.name_bangla ? `(`+info.name_bangla+`)` : ``}<br />{info.category.name}</del>)
                                                                    }
                                                                </td>
                                                                <td className='text-center'>
                                                                    {!info.deleted_at ? 
                                                                        (
                                                                            <React.Fragment>
                                                                                <span dangerouslySetInnerHTML={{__html: currency.sign}}/>
                                                                                <span>{info.purchase_price} /{info.measurement.name}</span>
                                                                            </React.Fragment>
                                                                        ):
                                                                        (
                                                                            <del>
                                                                                <span dangerouslySetInnerHTML={{__html: currency.sign}}/>
                                                                                <span>{info.purchase_price} /{info.measurement.name}</span>
                                                                            </del>
                                                                        )
                                                                    }
                                                                </td>
                                                                <td className='text-center'>{!info.deleted_at ? (<span>{info.vat}%</span>):(<del>{info.vat}%</del>)}</td>
                                                                <td className='text-center'>{!info.deleted_at ? (<span>{info.reorder_qty} /{info.measurement.name}</span>):(<del>{info.reorder_qty} /{info.measurement.name}</del>)}</td>
                                                                <td className="align-middle">
                                                                    <DropdownButton title="Action" className="btn-sm float-end">
                                                                        {
                                                                            info.deleted_at ? 
                                                                            (<Dropdown.Item eventKey="1" onClick={()=>handelUnblock(info.id)}>Unblock</Dropdown.Item>):
                                                                            (<Dropdown.Item eventKey="1" onClick={() => handelEditWork(info)}>Edit</Dropdown.Item>)
                                                                        }
                                                                    </DropdownButton>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )
                                                )
                                                :(
                                                    isrefreshingList ? 
                                                    (<tr><td colSpan={6} className="text-center py-3"><Loading /></td></tr>)
                                                    :(<tr><td colSpan={6} className="text-center py-3"><h3>No Data Found</h3></td></tr>)
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
                    <Modal.Title className="m-0">Product Information</Modal.Title>
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
                                    required={true} 
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

                        </Col>
                        <Col>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="category">
                                        <Form.Label className="m-0">Category <span className="text-danger">*</span></Form.Label>
                                        <Select
                                            required={true} 
                                            value={categories.filter(
                                                option => (formData.category && option.value.toString() === (formData.category).toString())
                                            )}
                                            isClearable
                                            options={categories}
                                            onChange={
                                                option => {
                                                    setFormData({
                                                        ...formData,
                                                        category : option ? option.value.toString() : `0`
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="measurement">
                                        <Form.Label className="m-0">Measurement <span className="text-danger">*</span></Form.Label>
                                        <Select
                                            required={true} 
                                            value={measurements.filter(
                                                option => (formData.measurement && option.value.toString() === (formData.measurement).toString())
                                            )}
                                            isClearable
                                            options={measurements}
                                            onChange={
                                                option => {
                                                    setFormData({
                                                        ...formData,
                                                        measurement : option ? option.value.toString() : `0`
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
                                            value={formData.purchase_price}
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
                                                    setFormData({
                                                        ...formData,
                                                        purchase_price : purchase_price
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
                                            value={formData.sales_price}
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
                                                    setFormData({
                                                        ...formData,
                                                        sales_price : sales_price
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col>
                                    <Form.Group className="mb-1" controlId="vat">
                                        <Form.Label className="m-0">Vat <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="number" 
                                            min={0} max={999999999} step="any"
                                            value={formData.vat}
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
                                                    setFormData({
                                                        ...formData,
                                                        vat : vat
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-1" controlId="reorder_qty">
                                        <Form.Label className="m-0">Reorder Qty <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="number" 
                                            min={0} max={999999999} step="any"
                                            value={formData.reorder_qty}
                                            onChange={
                                                e => {
                                                    let min = e.target.min;
                                                    let max = e.target.max;
                                                    let value = parseFloat(e.target.value);
                                                    let reorder_qty = min;
                                                    
                                                    if(value < min){
                                                        reorder_qty = min
                                                    }
                                                    else if(value > max){
                                                        reorder_qty = max
                                                    }
                                                    else{
                                                        if(value){
                                                            reorder_qty = value
                                                        }
                                                        else{
                                                            reorder_qty = min
                                                        }
                                                    }
                                                    setFormData({
                                                        ...formData,
                                                        reorder_qty : reorder_qty
                                                    })
                                                }
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

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
                                {
                                    isEditingInfo ? `Update` : `Save`
                                }
                            </Button>
                        )
                        :(<BtnSaving variant="primary" text={ isEditingInfo ? `Updating...` : `Saving...`} />)
                    }
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}
