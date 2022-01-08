import React from 'react'
import axios from 'axios'
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import CompanyProfile from './BasicSettingsPages/CompanyProfile';
import CurrencyVat from './BasicSettingsPages/CurrencyVat';
import ExpenseVoucher from './BasicSettingsPages/ExpenseVoucher';
import IncomeVoucher from './BasicSettingsPages/IncomeVoucher';
import InvoiceLayout from './BasicSettingsPages/InvoiceLayout';
import PurchaseVoucher from './BasicSettingsPages/PurchaseVoucher';
import ReportLayout from './BasicSettingsPages/ReportLayout';
import { AppUrl } from '../../Context';

export default function BasicSettings(props) {
    const [currencies,setCurrencies] = React.useState([]);
    const [basicSettings,setBasicSettings] = React.useState({
        company_name : ``,
        company_phone : ``,
        company_email : ``,
        company_address : ``
    });

    const getStartUpData = async () => {
        await axios.get(AppUrl(`/secure/settings/get-basic-settings`))
        .then(response=>{
            let info = response.data;
            setCurrencies(info.currencies);
            setBasicSettings(info.settings);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }
    React.useEffect(() => {
        getStartUpData()
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-secondary text-white">
                            <Card.Title>Basic Settings</Card.Title>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Tab.Container defaultActiveKey="CompanyProfile">
                                <Row>
                                    <Col md="3" className="pe-0">
                                        <Nav variant="pills" className="flex-column mb-0">
                                            <Nav.Item>
                                                <Nav.Link eventKey="CompanyProfile" className="border-bottom">
                                                    <i className="uil uil-lightbulb-alt"></i> Company Profile
                                                </Nav.Link>
                                                <Nav.Link eventKey="CurrencyVat" className="border-bottom">
                                                    <i className="uil uil-moneybag-alt"></i> Currency & VAT
                                                </Nav.Link>
                                                <Nav.Link eventKey="InvoiceLayout" className="border-bottom">
                                                    <i className="uil uil-invoice"></i> Invoice Layout
                                                </Nav.Link>
                                                <Nav.Link eventKey="IncomeVoucher" className="border-bottom">
                                                    <i className="uil uil-invoice"></i> Income Voucher Layout
                                                </Nav.Link>
                                                <Nav.Link eventKey="ExpenseVoucher" className="border-bottom">
                                                    <i className="uil uil-invoice"></i> Expense Voucher Layout
                                                </Nav.Link>
                                                <Nav.Link eventKey="PurchaseVoucher" className="border-bottom">
                                                    <i className="uil uil-invoice"></i> Purchase Voucher Layout
                                                </Nav.Link>
                                                <Nav.Link eventKey="ReportLayout" className="border-bottom">
                                                    <i className="uil uil-invoice"></i> Report Layout
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                    <Col md="9" className="ps-0">
                                        <Tab.Content className="px-3 py-2 border-start" style={{ minHeight : "16.9rem" }}>
                                            <Tab.Pane eventKey="CompanyProfile">
                                                <CompanyProfile settings={basicSettings} onSaveData={getStartUpData.bind(this)} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="CurrencyVat">
                                                <CurrencyVat currencies={currencies} settings={basicSettings} onSaveData={getStartUpData.bind(this)} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="InvoiceLayout">
                                                <InvoiceLayout settings={basicSettings} onSaveData={getStartUpData.bind(this)} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="IncomeVoucher">
                                                <IncomeVoucher settings={basicSettings} onSaveData={getStartUpData.bind(this)} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="ExpenseVoucher">
                                                <ExpenseVoucher settings={basicSettings} onSaveData={getStartUpData.bind(this)} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="PurchaseVoucher">
                                                <PurchaseVoucher settings={basicSettings} onSaveData={getStartUpData.bind(this)} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="ReportLayout">
                                                <ReportLayout settings={basicSettings} onSaveData={getStartUpData.bind(this)} />
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ToastContainer />
        </React.Fragment>
    )
}
