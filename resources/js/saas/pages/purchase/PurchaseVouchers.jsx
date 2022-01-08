import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Loading from '../../components/Loading'
import { AppUrl, ShowToast } from '../../Context'
import Swal from 'sweetalert2'
import { 
    Button, Card, Col, DropdownButton, Dropdown,
    FormControl, InputGroup, Row, Table 
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify'

export default function PurchaseVouchers(props) {
    const [appLink,setApplink] = React.useState(AppUrl(`/secure/purchase/get-purchase-vouchers?`))
    const [isrefreshingList,setRefreshingList] = React.useState(false)
    const [currency,setCurrency] = React.useState([])
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

    /* get list */
    const getList = async (url = {src:``}) => {
        setRefreshingList(true)
        await axios.get(appLink+'src='+url.src)
        .then(response => {
            let info = response.data.pagination;            
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
            setCurrency(response.data.currency)
            setRefreshingList(false)
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
                let info = response.data.pagination;
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
                setCurrency(response.data.currency)
                setRefreshingList(false)
            })
            .catch(function (error) {
                if(error == 'Error: Request failed with status code 401'){
                    location.reload()
                }
            });
        }
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
                await axios.post(AppUrl(`/secure/purchase/delete-purchase-voucher`),formData)
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
                        getList({src : query.src})
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

    React.useEffect(() => {
        getList({src : query.src})
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title>Purchase Voucher List</Card.Title>
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
                                                <th style={{ width : "15%" }}>Date</th>
                                                <th style={{ width : "25%" }}>Voucher &amp; Ref</th>
                                                <th style={{ width : "25%" }}>Supplier</th>
                                                <th className="text-end" style={{ width : "20%" }}>Total</th>
                                                <th className="text-end" style={{ width : "15%" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(data.infos).length > 0 ?
                                                (
                                                    isrefreshingList ? 
                                                    (<tr><td colSpan={5} className="text-center py-3"><Loading /></td></tr>)
                                                    :(
                                                        Object.values(data.infos).map((info,index)=>(
                                                            <tr key={index}>
                                                                <td>{info.purchase_date}</td>
                                                                <td>
                                                                    Voucher No : {info.voucher} <br />
                                                                    Ref : {info.ref}
                                                                </td>
                                                                <td>{info.supplier.name}<br />{info.supplier.phone}</td>
                                                                <td className='text-end'>
                                                                    {parseFloat(info.total).toFixed(2)} <span dangerouslySetInnerHTML={{__html: currency.sign}}/>
                                                                </td>
                                                                <td className="align-middle">
                                                                    <DropdownButton title="Action" className="btn-sm float-end">
                                                                        <Link className='dropdown-item' to={AppUrl(`/control/purchase/voucher-details/`+info.voucher)}>
                                                                            Details
                                                                        </Link>
                                                                        {/* <Dropdown.Item eventKey="1" to={}
                                                                            //onClick={() => handelEditWork(info)}
                                                                        >Details</Dropdown.Item> */}
                                                                        <Dropdown.Item eventKey="2" 
                                                                            //onClick={() => handelEditWork(info)}
                                                                        >Print</Dropdown.Item>
                                                                        <Link className='dropdown-item' to={AppUrl(`/control/purchase/return-voucher/`+info.voucher)}>
                                                                            Return
                                                                        </Link>
                                                                        {/* <Dropdown.Item eventKey="3" 
                                                                            onClick={() => handleDeleteVoucher(info.id)}
                                                                        >Delete</Dropdown.Item> */}
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
                                                            Object.values(data.paginations).map((paginate,i)=>(
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
        </React.Fragment>
    )
}
