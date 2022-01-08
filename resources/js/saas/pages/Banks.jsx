import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BtnSaving from '../components/BtnSaving'
import Loading from '../components/Loading'
import { ShowToast, AppUrl } from '../Context'
import Swal from 'sweetalert2'
import { 
    Button, Card, Col, DropdownButton, Dropdown, Form, FormControl, InputGroup, Modal, Row, Table 
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify'

export default function Banks(props) {
    const [appLink,setApplink] = React.useState(AppUrl(`/secure/get-banks?`))
    const [isAddNewModalOpen,setAddNewModalOpen] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [isEditingInfo,setEditingInfo] = React.useState(false)
    const [checkBox,setCheckBox] = React.useState([]);
    const [isrefreshingList,setRefreshingList] = React.useState(false)
    const [blockItems,setBlockItems] = React.useState([]);
    const listOptions = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'deactivated', label: 'deactivated' }
    ]
    const bankTypes = [
        { value: 'bank', label: 'Bank' },
        { value: 'mobile_bank', label: 'Mobile Bank' },
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
        bank_type : ``,
        name : ``,
        account_holder : ``,
        account_no : ``,
        opening_balance : 0,
        bank_address : ``
    });

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
            bank_type : ``,
            name : ``,
            account_holder : ``,
            account_no : ``,
            opening_balance : 0,
            bank_address : ``
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
        data.append('bank_type', formData.bank_type)
        data.append('name', formData.name)
        data.append('account_holder', formData.account_holder)
        data.append('account_no', formData.account_no)
        data.append('opening_balance', formData.opening_balance.toString())
        data.append('bank_address', formData.bank_address)
        
        await axios.post(AppUrl(`/secure/save-bank`),data)
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
            bank_type : obj.bank_type,
            name : obj.name,
            account_holder : obj.account_holder,
            account_no : obj.account_no,
            opening_balance : obj.opening_balance,
            bank_address : obj.bank_address ? obj.bank_address : ``
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
                    await axios.post(AppUrl(`/secure/unblock-bank`),data)
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
                    await axios.post(AppUrl(`/secure/block-banks`),data)
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
        getList({sortBy : query.sortBy, src : query.src})
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title className='d-inline'>Banks List</Card.Title>
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
                                    <Link to={AppUrl(`/secure/export-banks`)} target="_blank" className="btn btn-success float-end">
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
                                                <th style={{ width : "30%" }}>Bank Name</th>
                                                <th style={{ width : "30%" }}>Bank Information</th>
                                                <th className="text-end" style={{ width : "18%" }}>Balance</th>
                                                <th className="text-end" style={{ width : "20%" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(data.infos).length > 0 ?
                                                (
                                                    isrefreshingList ? 
                                                    (<tr><td colSpan={5} className="text-center py-3"><Loading /></td></tr>)
                                                    :(
                                                        (data.infos).map((info,index)=>(
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
                                                                            {info.name}
                                                                        </span>):
                                                                        (<del>{info.name}</del>)
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        !info.deleted_at ? (
                                                                        <span style={{ cursor : "pointer" }} onClick={handelCheckAll.bind(this,index)}>
                                                                            A/C : {info.account_holder} <br />
                                                                            A/C No. : {info.account_no} <br />
                                                                            Address : <br />
                                                                            <div
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: info.bank_address
                                                                                }}
                                                                            />
                                                                        </span>):
                                                                        (<del>
                                                                            A/C : {info.account_holder} <br />
                                                                            A/C No. : {info.account_no} <br />
                                                                            Address : <br />
                                                                            <div
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: info.bank_address
                                                                                }}
                                                                            />
                                                                        </del>)
                                                                    }
                                                                </td>
                                                                <td className='text-end'>{info.outstanding}</td>
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
                                                    (<tr><td colSpan={5} className="text-center py-3"><Loading /></td></tr>)
                                                    :(<tr><td colSpan={5} className="text-center py-3"><h3>No Data Found</h3></td></tr>)
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
                    <Modal.Title className="m-0">Bank Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>

                            <Form.Group className="mb-1" controlId="bank_type">
                                <Form.Label className="m-0">Bank Type <span className="text-danger">*</span></Form.Label>
                                <Select
                                    required={true} 
                                    value={bankTypes.filter(
                                        option => (formData.bank_type && option.value.toString() === (formData.bank_type).toString())
                                    )}
                                    isClearable
                                    options={bankTypes}
                                    onChange={
                                        option => {
                                            setFormData({
                                                ...formData,
                                                bank_type : option ? option.value.toString() : ``
                                            })
                                        }
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-1" controlId="name">
                                <Form.Label className="m-0">Bank Name <span className="text-danger">*</span></Form.Label>
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

                            <Form.Group className="mb-1" controlId="account_holder">
                                <Form.Label className="m-0">Account Holder <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    required={true} 
                                    type="text" 
                                    value={formData.account_holder}
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                account_holder : e.target.value
                                            })
                                        }
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-1" controlId="account_no">
                                <Form.Label className="m-0">Account No. <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    required={true} 
                                    type="number" 
                                    value={formData.account_no}
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                account_no : e.target.value
                                            })
                                        }
                                    }
                                />
                            </Form.Group>

                        </Col>
                        <Col>
                            <Form.Group className="mb-1" controlId="opening_balance">
                                <Form.Label className="m-0">Opening Balance <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" 
                                    readOnly={!isEditingInfo ? false : true} step="any"
                                    value={formData.opening_balance}
                                    onChange={
                                        e => {
                                            if (e.target.value) {
                                                setFormData({
                                                    ...formData,
                                                    opening_balance : parseFloat(e.target.value)
                                                })
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    opening_balance : ``
                                                })
                                            }
                                        }
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="bank_address">
                                <Form.Label className="m-0">Bank Address</Form.Label>
                                <Form.Control type="text" style={{ height: "10.5rem", resize: "none" }}
                                    as="textarea"
                                    value={formData.bank_address} 
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                bank_address : e.target.value
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