import axios from 'axios'
import React from 'react'
import { Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import Flatpickr from "react-flatpickr"
import Loading from '../../components/Loading'
import { AppUrl } from '../../Context'

export default function PurchaseStatement(props) {
    const toDay = new Date().toISOString().slice(0, 10);
    const [isLoadingData,setLoadingData] = React.useState(false)
    
    const [srcData,setSrcData] = React.useState({
        startData : toDay,
        endData : toDay,
    })

    const [report,setReport] = React.useState({
        isReportGenerated : false,
        details : {},
        currency : {},
        total : 0
    })

    const handelGenerateReport = async () => {
        setLoadingData(true);
        const formData = new FormData()
        formData.append('startData', srcData.startData)
        formData.append('endData', srcData.endData)

        await axios.post(AppUrl(`/secure/report/generate-purchase-report`),formData)
        .then(function (response) {
            let info = response.data;

            let total = 0

            if(Object.keys(info.details).length > 0){
                Object.values(info.details).map((detail)=>{
                    if (Object.keys(detail.details).length > 0) {
                        Object.values(detail.details).map((d)=>{
                            total+=d.subtotal
                        })
                    }
                })
            }

            setReport({
                ...report,
                isReportGenerated : true,
                details : info.details,
                currency : info.currency,
                total : total
            })

            setLoadingData(false)
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handelPrint = async () => {
        window.open(AppUrl(`/report/print-purchase-report?startData=`+srcData.startData+`&endData=`+srcData.endData), "sales-invoice", "fullscreen=yes");
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>Purchase Statement</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text>From</InputGroup.Text>
                                    <Flatpickr
                                        className="form-control"
                                        data-enable-time={false}
                                        options={{
                                            maxDate : toDay,
                                            dateFormat : 'Y-m-d',
                                        }}
                                        value={srcData.startData}
                                        onChange={(date, dateStr)=>{
                                            setSrcData({
                                                ...srcData,
                                                startData : dateStr
                                            })
                                        }} 
                                    />
                                    <InputGroup.Text>To</InputGroup.Text>
                                    <Flatpickr
                                        className="form-control"
                                        data-enable-time={false}
                                        options={{
                                            maxDate : toDay,
                                            dateFormat : 'Y-m-d',
                                        }}
                                        value={srcData.endData}
                                        onChange={(date, dateStr)=>{
                                            setSrcData({
                                                ...srcData,
                                                endData : dateStr
                                            })
                                        }}
                                    />
                                    <Button variant="primary" className="input-group-text"
                                        onClick={handelGenerateReport.bind(this)} 
                                    >
                                        Generate Report
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            {isLoadingData ? (<div className='text-center'><Loading /></div>) :(``)}
                            <div className='mt-5'>
                            {
                                report.isReportGenerated ? (
                                    <React.Fragment>
                                        <Row>
                                            <Col>
                                                <Button variant="success" className="float-end ms-2" 
                                                    onClick={handelPrint.bind(this)}
                                                >
                                                    <i className="uil uil-print fs-4"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row><Col><small>Report is showing from {srcData.startData} to {srcData.endData}. Report generate on {toDay}.</small></Col></Row>
                                        
                                        <Row>
                                            <Col>
                                                <Table striped bordered className='mb-0'>
                                                    <thead>
                                                        <tr>
                                                            <th style={{width : '10%'}}>Date</th>
                                                            <th style={{width : '50%'}}>Description</th>
                                                            <th className='text-end'>Quantity</th>
                                                            <th className='text-end'>Total Purchase</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(report.details).length > 0 ?
                                                            (
                                                                Object.values(report.details).map((detail,index)=>(
                                                                    <React.Fragment key={index}>
                                                                    <tr>
                                                                        <td>{detail.purchase_date}</td>
                                                                        <td colSpan={3}>
                                                                            Voucher : {detail.voucher}
                                                                            {
                                                                                detail.supplier ? 
                                                                                <React.Fragment>
                                                                                    <p className='m-0 p-0'>supplier : {detail.supplier.name}</p>
                                                                                    <p className='m-0 p-0'>Phone : {detail.supplier.phone}</p>
                                                                                    {
                                                                                        detail.supplier.supplier_address ?
                                                                                        (<span dangerouslySetInnerHTML={{__html: detail.supplier.supplier_address}}/>) : (``)
                                                                                    }
                                                                                </React.Fragment>
                                                                                : (``)
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    {
                                                                        Object.keys(detail.details).length > 0 ? (
                                                                            Object.values(detail.details).map((d,i)=>(
                                                                                <tr key={i}>
                                                                                    <td></td>
                                                                                    <td>
                                                                                        <p className='m-0 p-0'>
                                                                                            {d.product ? d.product.name : (``)}
                                                                                        </p>
                                                                                    </td>
                                                                                    <td className='text-end'>
                                                                                        {parseFloat(d.qty-d.rtn_qty).toFixed(3)} {d.product.measurement ? ' /'+d.product.measurement.name: ``}
                                                                                    </td>
                                                                                    <td className='text-end'>
                                                                                        <span dangerouslySetInnerHTML={{__html: report.currency.sign}}/> {parseFloat(d.subtotal).toFixed(2)}
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ): (``)
                                                                    }
                                                                    </React.Fragment>
                                                                ))
                                                            )
                                                            :(
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <h2 className='text-center text-danger'>No Data Found</h2>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan={3} className='text-end'>Total</td>
                                                            <td className='text-end'>
                                                                <span dangerouslySetInnerHTML={{__html: report.currency.sign}}/> 
                                                                {parseFloat(report.total).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                ) : (``)
                            }
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}
