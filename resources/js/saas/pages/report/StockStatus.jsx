import axios from 'axios'
import React from 'react'
import { Button, Card, Col, Row, Table } from 'react-bootstrap'
import { AppUrl } from '../../Context'

export default function StockStatus(props) {
    const toDay = new Date().toISOString().slice(0, 10);
    const [isLoadingData,setLoadingData] = React.useState(false)

    const [report,setReport] = React.useState({
        details : {},
        currency : {},
        total : 0
    })

    const getStockStatus = async () => {
        await axios.get(AppUrl('/secure/report/stock-status'))
        .then(response => {            
            let info = response.data;            
            setReport({
                ...report,
                details : info.details,
                currency : info.currency,
                total : 0
            })
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelPrint = async () => {
        window.open(AppUrl(`/report/print-stock-status`), "sales-invoice", "fullscreen=yes");
    }

    React.useEffect(() => {
        getStockStatus()
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>Stock Status</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Button variant="success" className="float-end ms-2" 
                                        onClick={handelPrint.bind(this)}
                                    >
                                        <i className="uil uil-print fs-4"></i>
                                    </Button>
                                </Col>
                            </Row>
                            <Row><Col><small>Report generate on {toDay}.</small></Col></Row>
                            <Row>
                                <Col>

                                    <Table striped bordered className='mb-0'>
                                        <thead>
                                            <tr>
                                                <th style={{width : '40%'}}>Warehouse</th>
                                                <th style={{width : '40%'}}>Product</th>
                                                <th className='text-end'>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(report.details).length > 0 ?
                                                (
                                                    Object.values(report.details).map((detail,index)=>(
                                                        <tr key={index}>
                                                            <td>{detail.warehouse ? detail.warehouse.name : (``)}</td>
                                                            <td>{detail.product ? detail.product.name : (``)}</td>
                                                            <td className='text-end'>{detail.qty}{detail.product.measurement ? ' /'+detail.product.measurement.name: ``}</td>
                                                        </tr>
                                                    ))
                                                )
                                                :(
                                                    <tr>
                                                        <td colSpan={3}>
                                                            <h2 className='text-center text-danger'>No Data Found</h2>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}
