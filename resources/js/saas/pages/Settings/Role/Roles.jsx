import React from 'react'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import { AppUrl } from '../../../Context'
import { Button, Card, Col, Form, FormControl, InputGroup, Row, Table } from 'react-bootstrap'

export default function Roles(props) {
    const listOptions = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'deactivated', label: 'deactivated' },
    ]

    React.useEffect(() => {
    }, [props]);

    return (
        <Row>
            <Col>
                <Card>

                    <Card.Header>
                        <Card.Title>Admintrative role list</Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <Row className="mb-2">

                            <Col md={4} sm={12}>
                                <Link to={AppUrl(`/control/role`)} className="btn btn-success">
                                    <i className="uil uil-plus-circle"></i> Add New
                                </Link>
                            </Col>
                            <Col md={4} sm={12}>
                                <div className="text-center">
                                    {/* Showing {data.from ? data.from : 0} to {data.to ? data.to : 0} of {data.total} */}
                                </div>
                            </Col>
                            <Col md={4} sm={12}>
                                <Button variant="danger"  className="float-end"
                                    //onClick={handelBlockSelectedItems.bind(this)}
                                >
                                    <i className="uil uil-trash-alt"></i> Block Selected
                                </Button>
                            </Col>
                                
                        </Row>

                        <Row className="mb-2">
                            <Col md={2} sm={12}>
                                <Select
                                    defaultValue={listOptions.filter(
                                        option => option.value.toString() === 'all'
                                    )}
                                    options={listOptions}
                                    //onChange={item => handelSortByQuery(item ? item.value : 'all')}
                                />
                            </Col>
                            <Col md={10} sm={12}>
                                <div className="app-search dropdown d-none d-lg-block">
                                    <InputGroup>
                                        <FormControl placeholder="Search..." 
                                            //onChange={handelSrcQuery.bind(this)} 
                                        />
                                        <span className="mdi mdi-magnify search-icon"></span>
                                        <Button variant="primary" 
                                            //onClick={handelSearch.bind(this)} 
                                            className="input-group-text"
                                        >Search</Button>
                                    </InputGroup>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col>
                                <Table striped bordered className="mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width : "2%" }}>
                                                <Form.Group>
                                                    <Form.Check 
                                                        type="checkbox" 
                                                        /* checked={
                                                            Object.keys(data.infos).length > 0 && Object.keys(data.infos).length ==  Object.keys(blockItems).length ? true : false
                                                        } */ 
                                                        label="All" 
                                                        value="all" 
                                                        //onChange={handelCheckAll.bind(this,0)} 
                                                    />
                                                </Form.Group>
                                            </th>
                                            <th style={{ width : "20%" }}>Tag</th>
                                            <th style={{ width : "58%" }}>Assigned Users</th>
                                            <th className="text-end" style={{ width : "20%" }}>Action</th>
                                        </tr>
                                    </thead>
                                </Table>
                            </Col>
                        </Row>

                    </Card.Body>

                    <Card.Footer></Card.Footer>

                </Card>
            </Col>
        </Row>
    )
}
