import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BtnSaving from '../components/BtnSaving'
import Loading from '../components/Loading'
import { AppUrl, ShowToast } from '../Context'
import Swal from 'sweetalert2'
import { 
    Button, Card, Col, DropdownButton, Dropdown, Form, FormControl, InputGroup, Modal, Row, Table 
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify'

export default function Warehouses(props) {
    const listOptions = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'deactivated', label: 'deactivated' },
    ]

    const [appLink,setApplink] = React.useState(AppUrl(`/secure/get-warehouses?`))
    const [isEditingInfo,setEditingInfo] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [selectedFile, setSelectedFile] = React.useState();
    const [isrefreshingList,setRefreshingList] = React.useState(false)
    const [checkBox,setCheckBox] = React.useState([]);
    const [blockItems,setBlockItems] = React.useState([]);
    const [isImportModalOpen,setImportModalOpen] = React.useState(false)
    const [isImportingSessionsStart,setImportingSessionsStart] = React.useState(false)
    const [isDetailModalOpen,setDetailModalOpen] = React.useState(false)
    
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
        address : ``,
    });

    const [detils,setDetils] = React.useState({
        name : ``,
        name_bangla : ``,
        address : ``
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
                    await axios.post(AppUrl(`/secure/unblock-warehouse`),data)
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
                    await axios.post(AppUrl(`/secure/block-warehouses`),data)
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

    /* reset work */
    const handelResetForm = () => {
        setFormData({
            ...formData,
            id : ``,
            name : ``,
            name_bangla : ``,
            address : ``,
        })
        setEditingInfo(false)
    }

    /* saving info */
    const handelSavingInfo = async () => {
        setSavingInfo(true);

        const data = new FormData()
        data.append('id', formData.id)
        data.append('name', formData.name)
        data.append('name_bangla', formData.name_bangla)
        data.append('address', formData.address)
        
        await axios.post(AppUrl(`/secure/save-warehouse`),data)
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
                handelResetForm()
                if(isEditingInfo){
                    setEditingInfo(false)
                }
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
            address : obj.address ? obj.address : ``,
        })
        setEditingInfo(true)
    }

    /* detailss work */
    const handleDetailModalShow = () => setDetailModalOpen(true);
    const handleDetailModalClose = () => setDetailModalOpen(false);

    const handelDetail = (obj) => {
        handleDetailModalShow();
        setDetils({
            ...detils,
            name : obj.name,
            name_bangla :  obj.name_bangla ?  obj.name_bangla : ``,
            address : obj.address ?  obj.address : ``
        })
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

    /* select file work */
    const handelSelectFile = (e) => {
        const file = e.target.files[0];
        if (!file){
            setSelectedFile(null);
            e.target.value = null;
        }
        else{
            setSelectedFile(file);
        }
    }

    /* import work */
    const handleImportModalShow = () => setImportModalOpen(true);
    const handleImportModalClose = () => setImportModalOpen(false);

    const handleImport = async () => {
        setImportingSessionsStart(true)
        const data = new FormData()
        if(selectedFile){
            data.append('file', selectedFile)
        }
        await axios.post(AppUrl(`/secure/import-warehouses`),data)
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
                setSelectedFile(null)
                getList({sortBy : query.sortBy, src : query.src})
            }
            setImportingSessionsStart(false);
            handleImportModalClose()
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    React.useEffect(() => {
        getList({sortBy : query.sortBy, src : query.src})
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col md={4} sm={12}>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title>Warehouse Information</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-2" controlId="name">
                                <Form.Label className="m-0">Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    name="name"
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
                            
                            <Form.Group className="mb-2" controlId="name_bangla">
                                <Form.Label className="m-0">Name (Bangla)</Form.Label>
                                <Form.Control 
                                    name="name_bangla"
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

                            <Form.Group className="mb-2" controlId="address">
                                <Form.Label className="m-0">Address</Form.Label>
                                <Form.Control type="text" 
                                    name="address" style={{ height: "100px", resize: "none" }}
                                    as="textarea"
                                    value={formData.address} 
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                address : e.target.value ? e.target.value : ``
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            {
                                isEditingInfo ? (
                                    <Button className="float-start" variant="warning" 
                                        onClick={handelResetForm.bind(this)}
                                    >
                                        Reset
                                    </Button>
                                ) : (``)
                            }
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
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={8} sm={12}>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title>Warehouse List</Card.Title>
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
                                    <Link to={AppUrl(`/secure/export-warehouses`)} target="_blank" className="btn btn-success float-end">
                                        <i className="dripicons-cloud-download"></i> Export
                                    </Link>
                                </Col>
                                    
                            </Row>

                            <Row className="mb-2">
                                <Col md={3} sm={12}>
                                    <Select
                                        defaultValue={listOptions.filter(
                                            option => option.value.toString() === 'all'
                                        )}
                                        options={listOptions}
                                        onChange={item => handelSortByQuery(item ? item.value : 'all')}
                                    />
                                </Col>
                                <Col md={9} sm={12}>
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
                                                <th style={{ width : "78%" }}>Name</th>
                                                <th className="text-end" style={{ width : "20%" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(data.infos).length > 0 ?
                                                (
                                                    isrefreshingList ? 
                                                    (<tr><td colSpan={4} className="text-center py-3"><Loading /></td></tr>)
                                                    :(
                                                        (data.infos).map((info,index)=>(
                                                            <tr key={index}>
                                                                <td>
                                                                    {
                                                                        info.deleted_at ? (``) :(
                                                                            <Form.Group>
                                                                                <Form.Check 
                                                                                    type="checkbox" 
                                                                                    checked={checkBox[index]} 
                                                                                    value={info.id} 
                                                                                    onChange={handelCheckAll.bind(this,index)} 
                                                                                />
                                                                            </Form.Group>
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        !info.deleted_at ? (<span style={{ cursor : "pointer" }} onClick={handelCheckAll.bind(this,index)}>{info.name}<br/>{info.name_bangla}</span>)
                                                                        : (<del>{info.name}<br/>{info.name_bangla}</del>)
                                                                    }
                                                                </td>
                                                                <td className="align-middle">
                                                                    <DropdownButton title="Action" className="btn-sm float-end">
                                                                        {
                                                                            info.deleted_at ? 
                                                                            (<Dropdown.Item eventKey="1" onClick={()=>handelUnblock(info.id)}>Unblock</Dropdown.Item>)
                                                                            :(
                                                                                <React.Fragment>
                                                                                    <Dropdown.Item eventKey="1" onClick={() => handelDetail(info)}>Show</Dropdown.Item>
                                                                                    <hr className="dropdown-divider" />
                                                                                    <Dropdown.Item eventKey="2" onClick={() => handelEditWork(info)}>Edit</Dropdown.Item>
                                                                                </React.Fragment>
                                                                            )
                                                                        }
                                                                    </DropdownButton>
                                                                </td>
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
                </Col>
            </Row>

            <ToastContainer />

            <Modal show={isImportModalOpen} onHide={handleImportModalClose.bind(this)} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Import CSV File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>
                        Make sure your csv file is well formed. 
                        file must have this fields <br/>(Id, Name, Name (Bangla), Address, Deleted by, Deleted at )
                    </strong>

                    <Form.Group controlId="import">
                        <Form.Label>Import <br />(supported extensions .csv )</Form.Label>
                        <Form.Control accept=".csv" type="file" 
                            onChange={handelSelectFile.bind(this)}
                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleImportModalClose.bind(this)}>
                        Nevermind
                    </Button>
                    {
                        !isImportingSessionsStart ? 
                        (<Button variant="primary" onClick={handleImport.bind(this)} className="float-end">Import</Button>)
                        :(<BtnSaving variant="primary" text="Importing..." />)
                    }
                </Modal.Footer>
            </Modal>

            <Modal
                //size="lg"
                show={isDetailModalOpen}
                onHide={handleDetailModalClose.bind(this)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Detils</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <h3 className="mb-0">
                                {detils.name} 
                                {
                                    detils.name_bangla ? (
                                        `(`+detils.name_bangla+`)`
                                    ): (``)
                                }
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            Address : <br />
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: detils.address
                                }}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

        </React.Fragment>
    )
}
