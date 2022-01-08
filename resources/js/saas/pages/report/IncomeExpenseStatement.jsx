import axios from 'axios'
import React from 'react'
import { Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import Flatpickr from "react-flatpickr"
import Loading from '../../components/Loading'
import { AppUrl } from '../../Context'

export default function IncomeExpenseStatement(props) {
    const toDay = new Date().toISOString().slice(0, 10);
    const [isLoadingData,setLoadingData] = React.useState(false)
    //const [balance,setBalance] = React.useState(0)

    let balance = 0
    
    const [srcData,setSrcData] = React.useState({
        startData : toDay,
        endData : toDay,
    })

    const [report,setReport] = React.useState({
        isReportGenerated : false,
        details : {},
        currency : {},
        balance_bf_dr : 0,
        balance_bf_cr : 0
    })

    const handelGenerateReport = async () => {
        setLoadingData(true);
        const formData = new FormData()
        formData.append('startData', srcData.startData)
        formData.append('endData', srcData.endData)

        await axios.post(AppUrl(`/secure/report/generate-income-report`),formData)
        .then(function (response) {
            let info = response.data;

            setReport({
                ...report,
                isReportGenerated : true,
                details : info.details,
                currency : info.currency,
                balance_bf_dr : info.balance_bf_dr.total,
                balance_bf_cr : info.balance_bf_cr.total
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
        window.open(AppUrl(`/report/print-income-report?startData=`+srcData.startData+`&endData=`+srcData.endData), "sales-invoice", "fullscreen=yes");
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>Income Expense Statement</Card.Title>
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
                                                            <th style={{width : '15%'}}>Date</th>
                                                            <th style={{width : '40%'}}>Account Head</th>
                                                            <th className='text-end' style={{width : '15%'}}>Income</th>
                                                            <th className='text-end' style={{width : '15%'}}>Expenses </th>
                                                            <th className='text-end' style={{width : '15%'}}>Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={4}>Balance B/F</td>
                                                            <td className='text-end'>
                                                                <span dangerouslySetInnerHTML={{__html: report.currency.sign}}/>{parseFloat(report.balance_bf_dr-report.balance_bf_cr).toFixed(2)}
                                                                {
                                                                    balance = report.balance_bf_dr-report.balance_bf_cr
                                                                }
                                                            </td>
                                                        </tr>
                                                        {
                                                            Object.keys(report.details).length > 0 ?
                                                            (
                                                                Object.values(report.details).map((detail,index)=>{
                                                                    if(detail.voucher_type != 'cr'){
                                                                        balance += detail.total;
                                                                    }
                                                                    else{
                                                                        balance -= detail.total;
                                                                    }
                                                                    return <tr key={index}>
                                                                            <td>{detail.voucher_date}</td>
                                                                            <td>{detail.account_head}</td>
                                                                            <td className='text-end'>                                                                                
                                                                                {
                                                                                    detail.voucher_type != 'cr' ? 
                                                                                        <React.Fragment>
                                                                                            <span dangerouslySetInnerHTML={{__html: report.currency.sign}}/> {parseFloat(detail.total).toFixed(2)}
                                                                                        </React.Fragment>
                                                                                    : (``)
                                                                                }
                                                                            </td>
                                                                            <td className='text-end'>
                                                                                {
                                                                                    detail.voucher_type == 'cr' ? 
                                                                                        <React.Fragment>
                                                                                            <span dangerouslySetInnerHTML={{__html: report.currency.sign}}/> {parseFloat(detail.total).toFixed(2)}
                                                                                        </React.Fragment>
                                                                                    : (``)
                                                                                }
                                                                            </td>
                                                                            <td className='text-end'>
                                                                                <span dangerouslySetInnerHTML={{__html: report.currency.sign}}/> {parseFloat(balance).toFixed(2)}
                                                                            </td>
                                                                        </tr>
                                                                })
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
