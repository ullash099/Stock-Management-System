import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { AppUrl } from './Context'
import Footer from './components/Footer';
import LeftsideMenu from './components/LeftsideMenu';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import MyAccount from './pages/auth/MyAccount';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import TwoFactorChallenge from './pages/auth/TwoFactorChallenge';
import Roles from './pages/Settings/Role/Roles';
import NewRole from './pages/Settings/Role/NewRole';
import BasicSettings from './pages/Settings/BasicSettings';
import Measurements from './pages/Settings/Measurements';
import Warehouses from './pages/Warehouses';
import IncomeHeads from './pages/Settings/IncomeHeads';
import ExpenseHeads from './pages/Settings/ExpenseHeads';
import Users from './pages/Settings/Users';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Banks from './pages/Banks';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Categories from './pages/Product/Categories';
import Products from './pages/Product/Products';
import OpeningStock from './pages/Settings/OpeningStock';
import NewPurchaseVoucher from './pages/purchase/NewPurchaseVoucher';
import PurchaseVoucher from './pages/Settings/BasicSettingsPages/PurchaseVoucher';
import PurchaseVouchers from './pages/purchase/PurchaseVouchers';
import PurchaseReturns from './pages/purchase/PurchaseReturns';
import PurchaseVoucherDetails from './pages/purchase/PurchaseVoucherDetails';
import NewSalesVoucher from './pages/sales/NewSalesVoucher';
import SalesVouchers from './pages/sales/SalesVouchers';
import SalesVoucherDetails from './pages/sales/SalesVoucherDetails';
import NewIncomeVoucher from './pages/income/NewIncomeVoucher';
import IncomeVouchers from './pages/income/IncomeVouchers';
import IncomeVoucherDetails from './pages/income/IncomeVoucherDetails';
import NewExpenseVoucher from './pages/expense/NewExpenseVoucher';
import ExpenseVoucherDetails from './pages/expense/ExpenseVoucherDetails';
import ExpenseVouchers from './pages/expense/ExpenseVouchers';
import DeliveryInvoice from './components/dashboard/DeliveryInvoice';
import SalesDeliveryInvoice from './pages/sales/SalesDeliveryInvoice';
import SalesReturns from './pages/sales/SalesReturns';
import SalesReport from './pages/report/SalesReport';
import PurchaseStatement from './pages/report/PurchaseStatement';
import StockStatus from './pages/report/StockStatus';
import IncomeExpenseStatement from './pages/report/IncomeExpenseStatement';

export default function Template() {
    return (
        <Router>
            {
                !status ? (
                    <div className="auth-fluid">
                        <div className="auth-fluid-form-box">
                            <div className="align-items-center d-flex h-100">
                                <Switch>
                                    <Route exact path={AppUrl(`/login`)} component={Login} />
                                    <Route exact path={AppUrl(`/two-factor-challenge`)} component={TwoFactorChallenge} />
                                    <Route exact path={AppUrl(`/email/verify`)} component={VerifyEmail} />
                                    <Route exact path={AppUrl(`/forgot-password`)} component={ForgotPassword} />
                                    <Route exact path={AppUrl(`/reset-password/:slug`)} component={ResetPassword} />
                                    <Route component={NotFound} />
                                </Switch>
                            </div>
                        </div>
                        <div className="auth-fluid-right text-center">
                            <div className="auth-user-testimonial">
                                <h2 className="mb-0">Inventory Management System</h2>
                                <h2 className="my-3">for</h2>
                                <h2 className="mb-0">
                                    <i className="mdi mdi-format-quote-open"></i> 
                                    নজরুল অ্যান্ড ব্রাদার্স 
                                    <i className="mdi mdi-format-quote-close"></i>
                                </h2>
                            </div>
                        </div>
                    </div>
                ) :
                (
                    <div className="wrapper">
                        <LeftsideMenu />
                        <div className="content-page">
                            <div className="content">
                                <Topbar />
                                {/* page */}
                                <div className="py-2">
                                    <Switch>
                                        <Route exact path={AppUrl(`/`)} component={Dashboard} />
                                        <Route exact path={AppUrl(`/control/my-account`)} component={MyAccount} />
                                        
                                        <Route exact path={AppUrl(`/control/dashboard`)} component={Dashboard} />
                                        <Route exact path={AppUrl(`/control/delivery/delivery-invoice/:id`)} component={DeliveryInvoice} />

                                        {/* purchase */}
                                        <Route exact path={AppUrl(`/control/sales/new-invoice`)} component={NewSalesVoucher} />
                                        <Route exact path={AppUrl(`/control/sales/invoices`)} component={SalesVouchers} />
                                        <Route exact path={AppUrl(`/control/sales/invoice-details/:id`)} component={SalesVoucherDetails} />
                                        <Route exact path={AppUrl(`/control/sales/delivery-invoice/:id`)} component={SalesDeliveryInvoice} />
                                        <Route exact path={AppUrl(`/control/sales/return-invoice/:id`)} component={SalesReturns} />
                                        {/* income voucher */}
                                        <Route exact path={AppUrl(`/control/income/new-income-voucher`)} component={NewIncomeVoucher} />
                                        <Route exact path={AppUrl(`/control/income/income-vouchers`)} component={IncomeVouchers} />
                                        <Route exact path={AppUrl(`/control/income/income-voucher-details/:id`)} component={IncomeVoucherDetails} />
                                        {/* expense voucher */}
                                        <Route exact path={AppUrl(`/control/expense/new-expense-voucher`)} component={NewExpenseVoucher} />
                                        <Route exact path={AppUrl(`/control/expense/expense-vouchers`)} component={ExpenseVouchers} />
                                        <Route exact path={AppUrl(`/control/expense/expense-voucher-details/:id`)} component={ExpenseVoucherDetails} />
                                        {/* purchase */}
                                        <Route exact path={AppUrl(`/control/purchase/new-purchase-voucher`)} component={NewPurchaseVoucher} />
                                        <Route exact path={AppUrl(`/control/purchase/purchase-vouchers`)} component={PurchaseVouchers} />
                                        <Route exact path={AppUrl(`/control/purchase/voucher-details/:id`)} component={PurchaseVoucherDetails} />
                                        <Route exact path={AppUrl(`/control/purchase/return-voucher/:id`)} component={PurchaseReturns} />
                                        {/* products */}
                                        <Route exact path={AppUrl(`/control/product/products`)} component={Products} />
                                        <Route exact path={AppUrl(`/control/product/categories`)} component={Categories} />
                                        <Route exact path={AppUrl(`/control/customers`)} component={Customers} />
                                        <Route exact path={AppUrl(`/control/suppliers`)} component={Suppliers} />
                                        <Route exact path={AppUrl(`/control/banks`)} component={Banks} />
                                        <Route exact path={AppUrl(`/control/warehouses`)} component={Warehouses} />
                                        {/* settings */}
                                        {/* role */}
                                        <Route exact path={AppUrl(`/control/settings/roles`)} component={Roles} />
                                        <Route exact path={AppUrl(`/control/settings/role/:id?`)} component={NewRole} />

                                        <Route exact path={AppUrl(`/control/settings/basic-settings`)} component={BasicSettings} />
                                        <Route exact path={AppUrl(`/control/settings/users`)} component={Users} />
                                        <Route exact path={AppUrl(`/control/settings/opening-stock`)} component={OpeningStock} />

                                        <Route exact path={AppUrl(`/control/settings/measurements`)} component={Measurements} />
                                        <Route exact path={AppUrl(`/control/settings/income-head`)} component={IncomeHeads} />
                                        <Route exact path={AppUrl(`/control/settings/expense-head`)} component={ExpenseHeads} />

                                        {/* report */}
                                        <Route exact path={AppUrl(`/control/report/sales-statement`)} component={SalesReport} />
                                        <Route exact path={AppUrl(`/control/report/purchase-statement`)} component={PurchaseStatement} />
                                        <Route exact path={AppUrl(`/control/report/stock-status`)} component={StockStatus} />
                                        <Route exact path={AppUrl(`/control/report/income-expense-statement`)} component={IncomeExpenseStatement} />

                                        <Route component={NotFound} />
                                    </Switch>
                                </div>
                                {/* end page */}
                            </div>
                            <Footer />
                        </div>
                    </div>
                )
            }
        </Router>
    )
}
if (document.getElementById('app')) {
    ReactDOM.render(<Template />, document.getElementById('app'));
}