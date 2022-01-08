import React from 'react'
import { Link } from 'react-router-dom'
import { AppUrl } from '../Context'

export default function LeftsideMenu(props) {
    const [menu,setMenu] = React.useState('dashboard')
    const [subMenu,setSubMenu] = React.useState('-')

    React.useEffect(() => {
        let paths = (window.location.pathname).substring(1).split("/")
        let manu = paths[1] ? paths[1] : '';
        let submenu = paths[2] ? paths[2] : '';

        setMenu(manu)
        setSubMenu(submenu)
    }, [props]);

    return (
        <div className="leftside-menu menuitem-active">
            {/* LOGO */}
            <Link to={AppUrl(`/control/dashboard`)} className="logo text-center logo-light">
                <span className="logo-lg text-white fs-3">
                    নজরুল অ্যান্ড ব্রাদার্স 
                    {/* <img src={AppUrl(`/saas/images/logo.png`)} alt="" height="16" /> */}
                </span>
            </Link>

            <div className="h-100" id="leftside-menu-container" data-simplebar="init">
                <div className="simplebar-wrapper" style={{ margin : "0px"}}>
                    <div className="simplebar-height-auto-observer-wrapper">
                        <div className="simplebar-height-auto-observer"></div>
                    </div>
                    <div className="simplebar-mask">
                        <div className="simplebar-offset" style={{ right : "0px", bottom : "0px" }}>
                            <div className="simplebar-content-wrapper" style={{ height : "100%", overflow : "hidden scroll" }}>
                                <div className="simplebar-content" style={{ padding : "0px"}}>
                    
                                    <ul className="side-nav mb-4">
                                        <li onClick={() => {setMenu('dashboard'),setSubMenu('-')}}
                                            className={menu == `dashboard` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link 
                                                className={menu == `dashboard` ? `side-nav-link active` : `side-nav-link`}
                                                to={AppUrl(`/control/dashboard`)} 
                                            >
                                                <i className="uil uil-home-alt"></i>
                                                <span> Dashboard </span>
                                            </Link>
                                        </li>

                                        <li onClick={() => setMenu('sales')}
                                            className={menu == `sales` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link to="#sidebarSales" 
                                                data-bs-toggle="collapse" 
                                                aria-expanded={menu == `sales` ? true : false }
                                                aria-controls="sidebarSales" 
                                                className={menu == `sales` ? `side-nav-link active` : `side-nav-link collapsed`}
                                            >
                                                <i className="uil uil-shop"></i>
                                                <span>Sales</span>
                                                <span className="menu-arrow"></span>
                                            </Link>
                                            <div 
                                                className={menu == `sales` ? `collapse show` : `collapse` }
                                                id="sidebarSales"
                                            >
                                                <ul className="side-nav-second-level">
                                                    <li 
                                                        onClick={() => setSubMenu('new-invoice')}
                                                        className={subMenu == `new-invoice` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/sales/new-invoice`)}
                                                            className={subMenu == `new-invoice` ? `active` : `` }
                                                        >New Invoice</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('invoices')}
                                                        className={subMenu == `invoices` || subMenu == `invoice-details` ||  subMenu == 'return-invoice' ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/sales/invoices`)}
                                                            className={subMenu == `invoices` || subMenu == `invoice-details` ||  subMenu == 'return-invoice' ? `active` : `` }
                                                        >Invoices</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        
                                        <li onClick={() => setMenu('income')}
                                            className={menu == `income` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link to="#sidebarIncome" 
                                                data-bs-toggle="collapse" 
                                                aria-expanded={menu == `income` ? true : false }
                                                aria-controls="sidebarIncome" 
                                                className={menu == `income` ? `side-nav-link active` : `side-nav-link collapsed`}
                                            >
                                                <i className="uil uil-invoice"></i>
                                                <span>Income</span>
                                                <span className="menu-arrow"></span>
                                            </Link>
                                            <div 
                                                className={menu == `income` ? `collapse show` : `collapse` }
                                                id="sidebarIncome"
                                            >
                                                <ul className="side-nav-second-level">
                                                    <li 
                                                        onClick={() => setSubMenu('new-income-voucher')}
                                                        className={subMenu == `new-income-voucher` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/income/new-income-voucher`)}
                                                            className={subMenu == `new-income-voucher` ? `active` : `` }
                                                        >New Voucher</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('income-vouchers')}
                                                        className={subMenu == `income-vouchers` || subMenu == `income-voucher-details` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/income/income-vouchers`)}
                                                            className={subMenu == `income-vouchers` || subMenu == `income-voucher-details` ? `active` : `` }
                                                        >Vouchers</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        
                                        <li onClick={() => setMenu('expense')}
                                            className={menu == `expense` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link to="#sidebarExpense" 
                                                data-bs-toggle="collapse" 
                                                aria-expanded={menu == `expense` ? true : false }
                                                aria-controls="sidebarExpense" 
                                                className={menu == `expense` ? `side-nav-link active` : `side-nav-link collapsed`}
                                            >
                                                <i className="uil uil-bill"></i>
                                                <span>Expense</span>
                                                <span className="menu-arrow"></span>
                                            </Link>
                                            <div 
                                                className={menu == `expense` ? `collapse show` : `collapse` }
                                                id="sidebarExpense"
                                            >
                                                <ul className="side-nav-second-level">
                                                    <li 
                                                        onClick={() => setSubMenu('new-expense-voucher')}
                                                        className={subMenu == `new-expense-voucher` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/expense/new-expense-voucher`)}
                                                            className={subMenu == `new-expense-voucher` ? `active` : `` }
                                                        >New Voucher</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('expense-vouchers')}
                                                        className={subMenu == `expense-vouchers` || subMenu == `expense-voucher-details` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/expense/expense-vouchers`)}
                                                            className={subMenu == `expense-vouchers` || subMenu == `expense-voucher-details` ? `active` : `` }
                                                        >Vouchers</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        
                                        <li onClick={() => setMenu('purchase')}
                                            className={menu == `purchase` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link to="#sidebarPurchase" 
                                                data-bs-toggle="collapse" 
                                                aria-expanded={menu == `purchase` ? true : false }
                                                aria-controls="sidebarPurchase" 
                                                className={menu == `purchase` ? `side-nav-link active` : `side-nav-link collapsed`}
                                            >
                                                <i className="uil uil-cart"></i>
                                                <span>Purchase</span>
                                                <span className="menu-arrow"></span>
                                            </Link>
                                            <div 
                                                className={menu == `purchase` ? `collapse show` : `collapse` }
                                                id="sidebarPurchase"
                                            >
                                                <ul className="side-nav-second-level">
                                                    <li 
                                                        onClick={() => setSubMenu('new-purchase-voucher')}
                                                        className={subMenu == `new-purchase-voucher` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/purchase/new-purchase-voucher`)}
                                                            className={subMenu == `new-purchase-voucher` ? `active` : `` }
                                                        >New Purchase Voucher</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('purchase-vouchers')}
                                                        className={subMenu == `purchase-vouchers` || subMenu == `voucher-details` ||  subMenu == 'return-voucher' ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/purchase/purchase-vouchers`)}
                                                            className={subMenu == `purchase-vouchers` || subMenu == `voucher-details` ||  subMenu == 'return-voucher' ? `active` : `` }
                                                        >Purchase Vouchers</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        
                                        <li onClick={() => {setMenu('customers'),setSubMenu('-')}}
                                            className={menu == `customers` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link 
                                                className={menu == `customers` ? `side-nav-link active` : `side-nav-link`}
                                                to={AppUrl(`/control/customers`)} 
                                            >
                                                <i className="uil uil-user-square"></i>
                                                <span> Customers </span>
                                            </Link>
                                        </li>
                                        
                                        <li onClick={() => {setMenu('suppliers'),setSubMenu('-')}}
                                            className={menu == `suppliers` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link 
                                                className={menu == `suppliers` ? `side-nav-link active` : `side-nav-link`}
                                                to={AppUrl(`/control/suppliers`)}
                                            >
                                                <i className="uil uil-users-alt"></i>
                                                <span> Suppliers </span>
                                            </Link>
                                        </li>

                                        <li onClick={() => setMenu('product')}
                                            className={menu == `product` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link to="#sidebarProduct" 
                                                data-bs-toggle="collapse" 
                                                aria-expanded={menu == `product` ? true : false }
                                                aria-controls="sidebarProduct" 
                                                className={menu == `product` ? `side-nav-link active` : `side-nav-link collapsed`}
                                            >
                                                <i className="uil uil-gold"></i>
                                                <span>Product</span>
                                                <span className="menu-arrow"></span>
                                            </Link>
                                            <div 
                                                className={menu == `product` ? `collapse show` : `collapse` }
                                                id="sidebarProduct"
                                            >
                                                <ul className="side-nav-second-level">
                                                    <li 
                                                        onClick={() => setSubMenu('products')}
                                                        className={subMenu == `products` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/product/products`)}
                                                            className={subMenu == `products` ? `active` : `` }
                                                        >Products</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('categories')}
                                                        className={subMenu == `categories` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/product/categories`)}
                                                            className={subMenu == `categories` ? `active` : `` }
                                                        >Categories</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>

                                        <li onClick={() => {setMenu('banks'),setSubMenu('-')}}
                                            className={menu == `banks` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link 
                                                className={menu == `banks` ? `side-nav-link active` : `side-nav-link`}
                                                to={AppUrl(`/control/banks`)}
                                            >
                                                <i className="uil uil-moneybag-alt"></i>
                                                <span> Banks </span>
                                            </Link>
                                        </li>

                                        <li onClick={() => setMenu('report')}
                                            className={menu == `report` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link to="#sidebarReport" 
                                                data-bs-toggle="collapse" 
                                                aria-expanded={menu == `report` ? true : false }
                                                aria-controls="sidebarReport" 
                                                className={menu == `report` ? `side-nav-link active` : `side-nav-link collapsed`}
                                            >
                                                <i className="uil uil-file-info-alt"></i>
                                                <span>Report</span>
                                                <span className="menu-arrow"></span>
                                            </Link>
                                            <div 
                                                className={menu == `report` ? `collapse show` : `collapse` }
                                                id="sidebarReport"
                                            >
                                                <ul className="side-nav-second-level">
                                                    <li 
                                                        onClick={() => setSubMenu('stock-status')}
                                                        className={subMenu == `stock-status` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/report/stock-status`)}
                                                            className={subMenu == `stock-status` ? `active` : `` }
                                                        >Stock Status</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('sales-statement')}
                                                        className={subMenu == `sales-statement` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/report/sales-statement`)}
                                                            className={subMenu == `sales-statement` ? `active` : `` }
                                                        >Sales Statement</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('purchase-statement')}
                                                        className={subMenu == `purchase-statement` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/report/purchase-statement`)}
                                                            className={subMenu == `purchase-statement` ? `active` : `` }
                                                        >Purchase Statement</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('income-expense-statement')}
                                                        className={subMenu == `income-expense-statement` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/report/income-expense-statement`)}
                                                            className={subMenu == `income-expense-statement` ? `active` : `` }
                                                        >Income Expense Statement</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        
                                        <li onClick={() => {setMenu('warehouses'),setSubMenu('-')}}
                                            className={menu == `warehouses` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link 
                                                className={menu == `warehouses` ? `side-nav-link active` : `side-nav-link`}
                                                to={AppUrl(`/control/warehouses`)}
                                            >
                                                <i className="uil uil-server"></i>
                                                <span> Godowns </span>
                                            </Link>
                                        </li>
                                        
                                        <li onClick={() => setMenu('settings')}
                                            className={menu == `settings` ? `side-nav-item menuitem-active` : `side-nav-item`}
                                        >
                                            <Link to="#sidebarSettings" 
                                                data-bs-toggle="collapse" 
                                                aria-expanded={menu == `settings` ? true : false }
                                                aria-controls="sidebarSettings" 
                                                className={menu == `settings` ? `side-nav-link active` : `side-nav-link collapsed`}
                                            >
                                                <i className="uil uil-cog"></i>
                                                <span>Settings</span>
                                                <span className="menu-arrow"></span>
                                            </Link>
                                            <div 
                                                className={menu == `settings` ? `collapse show` : `collapse` }
                                                id="sidebarSettings"
                                            >
                                                <ul className="side-nav-second-level">
                                                    {/* <li
                                                        onClick={() => setSubMenu('roles')}
                                                        className={subMenu == `roles` ? `menuitem-active` : `` }
                                                    >
                                                        <Link
                                                            to="/control/settings/roles"
                                                            className={subMenu == `basic-settings` ? `active` : `` }
                                                        >Roles</Link>
                                                    </li> */}
                                                    <li 
                                                        onClick={() => setSubMenu('basic-settings')}
                                                        className={subMenu == `basic-settings` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/settings/basic-settings`)}
                                                            className={subMenu == `basic-settings` ? `active` : `` }
                                                        >Basic Settings</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('users')}
                                                        className={subMenu == `users` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/settings/users`)}
                                                            className={subMenu == `users` ? `active` : `` }
                                                        >Users</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('opening-stock')}
                                                        className={subMenu == `opening-stock` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/settings/opening-stock`)}
                                                            className={subMenu == `opening-stock` ? `active` : `` }
                                                        >Opening Stock</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('income-head')}
                                                        className={subMenu == `income-head` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/settings/income-head`)}
                                                            className={subMenu == `income-head` ? `active` : `` }
                                                        >Income Heads</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('expense-head')}
                                                        className={subMenu == `expense-head` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/settings/expense-head`)}
                                                            className={subMenu == `expense-head` ? `active` : `` }
                                                        >Expense Heads</Link>
                                                    </li>
                                                    <li 
                                                        onClick={() => setSubMenu('measurements')}
                                                        className={subMenu == `measurements` ? `menuitem-active` : `` }>
                                                        <Link 
                                                            to={AppUrl(`/control/settings/measurements`)} 
                                                            className={subMenu == `measurements` ? `active` : `` }
                                                        >Measurements</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
