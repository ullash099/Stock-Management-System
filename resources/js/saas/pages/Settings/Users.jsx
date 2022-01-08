import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BtnSaving from '../../components/BtnSaving'
import Loading from '../../components/Loading'
import { AppUrl, ShowToast } from '../../Context'
import Swal from 'sweetalert2'
import { 
    Button, Card, Col, DropdownButton, Dropdown, Form, FormControl, InputGroup, Modal, Row, Table, Badge 
} from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'

export default function Users(props) {
    const [appLink,setApplink] = React.useState(AppUrl(`/secure/settings/get-users?`))
    const [isrefreshingList,setRefreshingList] = React.useState(false)
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [roles,setRoles] = React.useState([])
    const [checkBox,setCheckBox] = React.useState([]);
    const [blockItems,setBlockItems] = React.useState([]);
    const [isNewUserModalOpen,setNewUserModalOpen] = React.useState(false)

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
    });

    const [formData,setFormData] = React.useState({
        name : ``,
        email : ``,
        role : 0,
        password : ``,
        password_confirmation : ``
    });

    /* get list */
    const getList = async (url = {src:``}) => {
        setRefreshingList(true)
        await axios.get(appLink+'&src='+url.src)
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

    /* roles */
    const getRoles = async () => {
        await axios.get(AppUrl(`/secure/settings/get-roles`))
        .then(response => {
            let info = response.data;
            let listOfRole = [];
            if(Object.keys(info).length > 0){
                (info).map((role)=>{
                    listOfRole.push({ value: role.id, label: role.name })
                });
            }
            setRoles(listOfRole)            
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
            name : ``,
            email : ``,
            role : 0,
            password : ``,
            password_confirmation : ``
        })
    }

    /* saving info */
    const handelSavingInfo = async () => {
        setSavingInfo(true);

        const data = new FormData()
        data.append('name', formData.name)
        data.append('email', formData.email)
        data.append('role', formData.role.toString())
        data.append('password', formData.password)
        data.append('password_confirmation', formData.password_confirmation)
        
        await axios.post(AppUrl(`/secure/settings/save-user`),data)
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
                handleNewUserModalClose()
                ShowToast({
                    type : 'success',
                    msg  : info.success
                })
                handelResetForm()
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

    /* new user work */
    const handleNewUserModalShow = () => setNewUserModalOpen(true);
    const handleNewUserModalClose = () => setNewUserModalOpen(false);

    /* Block unblock work start */
    const handelCheckAll = (position,e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        const selectedItems = [];
        if(value == 'all'){
            if(checked){
                setCheckBox(new Array(Object.values(data.infos).length).fill(true));
                setBlockItems(Object.values(data.infos).map((info)=>{
                    if([1,2,3].indexOf(info.id) < 0){
                        return info.id;
                    }
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
                    await axios.post(AppUrl(`/secure/settings/unblock-user`),data)
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
                        getList({src : query.src})
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
                    await axios.post(AppUrl(`/secure/settings/block-users`),data)
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
                        getList({src : query.src})
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

    const handelManuallyVerifyEmail = async (id) => {
        if(id){
            Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, verify it!'
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const data = new FormData()
                    data.append('id', id)
                    await axios.post(AppUrl(`/secure/settings/manually-verify-email`),data)
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
                        getList({src : query.src})
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
        getList({src : query.src});
        getRoles()
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title className='d-inline'>Users List</Card.Title>
                            <Button variant="success" className="float-end" onClick={handleNewUserModalShow.bind(this)}>
                                <i className="uil uil-user-plus fs-4"></i> New User
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
                                                <th style={{ width : "60%" }}>Name</th>
                                                <th className="text-center" style={{ width : "18%" }}>Status</th>
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
                                                                    <span style={{ cursor : "pointer" }} onClick={handelCheckAll.bind(this,index)}>
                                                                        {info.name}<br/>
                                                                        Email : {info.email}<br/>
                                                                        Role : {info.role.name}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    {
                                                                        info.block == 1 ? (<Badge bg="danger p-1 mb-1 d-block">Blocked</Badge>) : (<Badge bg="success p-1 mb-1 d-block">Active</Badge>)
                                                                    }
                                                                    {
                                                                        info.email_verified_at ? (<Badge bg="success p-1 d-block">Email verified</Badge>) : (<Badge bg="danger p-1 d-block">Email not verified</Badge>)
                                                                    }
                                                                </td>
                                                                <td className="align-middle">
                                                                    {
                                                                        info.email_verified_at && info.block == 1 ? 
                                                                        (
                                                                            <DropdownButton title="Action" className="btn-sm float-end">
                                                                                {
                                                                                    info.block == 1 ? 
                                                                                    (<Dropdown.Item eventKey="1" onClick={()=>handelUnblock(info.id)}>Unblock</Dropdown.Item>)
                                                                                    :(
                                                                                        <React.Fragment>
                                                                                            {/* <Dropdown.Item eventKey="1" onClick={() => handelDetail(info)}>Show</Dropdown.Item> */}
                                                                                            {
                                                                                                !info.email_verified_at ? (
                                                                                                    <React.Fragment>
                                                                                                        <hr className="dropdown-divider" />
                                                                                                        <Dropdown.Item eventKey="2" onClick={() => handelManuallyVerifyEmail(info.id)}>verify email</Dropdown.Item>
                                                                                                    </React.Fragment>
                                                                                                ):(``)
                                                                                            }
                                                                                        </React.Fragment>
                                                                                    )
                                                                                }
                                                                            </DropdownButton>
                                                                        ):(``)
                                                                    }
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

            <Modal
                size="lg"
                show={isNewUserModalOpen}
                onHide={handleNewUserModalClose.bind(this)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="m-0">Create New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group className="mb-2" controlId="name">
                                <Form.Label className="m-0">Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
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
                            <Form.Group className="mb-2" controlId="email">
                                <Form.Label className="m-0">Email <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    type="email" 
                                    value={formData.email}
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                email : e.target.value
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-2" controlId="search">
                                <Form.Label className="m-0">Role <span className="text-danger">*</span></Form.Label>
                                <Select
                                    value={roles.filter(
                                        option => (formData.role && option.value.toString() === (formData.role).toString())
                                    )}
                                    isClearable
                                    options={roles}
                                    onChange={
                                        option => {
                                            setFormData({
                                                ...formData,
                                                role : option ? option.value.toString() : 0
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="password">
                                <Form.Label className="m-0">Password <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    type="password" 
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                password : e.target.value
                                            })
                                        }
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="password_confirmation">
                                <Form.Label className="m-0">Confirm Password <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    type="password" 
                                    onChange={
                                        e => {
                                            setFormData({
                                                ...formData,
                                                password_confirmation : e.target.value
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
