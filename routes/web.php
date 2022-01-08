<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('login','AuthenticatedSessionController@create')->name('login');
Route::post('login','AuthenticatedSessionController@store')->name('login.save');
Route::post('two-factor-challenge','AuthenticatedSessionController@TwoFactorAuthenticatedStore')->name('two-factor-challenge');
Route::get('reset-password/{token}','profile\UserProfileSettingsController@CreateNewPassword')->name('password.reset');

#website
Route::get('/not-found','AdminController@index');

Route::group(['middleware'=>['auth:sanctum', 'verified']],function (){
    Route::get('/','AdminController@index');
    Route::get('/migration','AdminController@migration');
    Route::get('control/{menu?}/{submenu?}/{id?}','AdminController@index');

    #print work
    Route::get('sales/print/{invoice}', 'sales\SalesController@print');
    Route::get('expense/print/{invoice}', 'expense\ExpenseController@print');
    Route::get('income/print/{invoice}', 'income\IncomeController@print');
    
    #report
    Route::post('secure/report/generate-sales-report', 'report\GenerateSalesReportController@index');
    Route::get('report/print-sales-report', 'report\GenerateSalesReportController@print');
    
    Route::post('secure/report/generate-purchase-report', 'report\GeneratePurchaseReportController@index');
    Route::get('report/print-purchase-report', 'report\GeneratePurchaseReportController@print');
    
    Route::get('secure/report/stock-status', 'report\GenerateStockStatusController@index');
    Route::get('report/print-stock-status', 'report\GenerateStockStatusController@print');

    Route::post('secure/report/generate-income-report', 'report\GenerateIncomeExpenseReportController@index');
    Route::get('report/print-income-report', 'report\GenerateIncomeExpenseReportController@print');


    Route::get('secure/my-info','profile\UserProfileController@userInfo');
    Route::get('secure/my-other-device-session-info','profile\UserProfileController@MySessions');
    Route::post('secure/user/profile-information', 'profile\UserProfileSettingsController@updateProfileInfo');
    Route::post('secure/user/update-password', 'profile\UserProfileSettingsController@updatePassword');
    Route::post('secure/user/other-browser-sessions', 'profile\OtherBrowserSessionsController@destroy');
    Route::post('secure/user/two-factor-authentication', 'profile\TwoFactorAuthenticationController@store');
    Route::post('secure/user/delete-two-factor-authentication', 'profile\TwoFactorAuthenticationController@destroy');
    Route::post('secure/user/two-factor-recovery-codes', 'profile\TwoFactorAuthenticationController@regenerate');

    #settings
    #role settings
    Route::get('secure/settinsg/role/{id?}','settings\RoleSettingsController@create');
    
    #general settings
    Route::get('secure/settings/get-basic-settings','settings\BasicSettingsController@index');
    Route::post('secure/settings/save-profile-company-info', 'settings\BasicSettingsController@saveCompanyProfile');
    Route::post('secure/settings/save-currency-info', 'settings\BasicSettingsController@saveCurrencyInfo');
    Route::post('secure/settings/save-invoice-layout-info', 'settings\BasicSettingsController@saveInvoiceLayout');
    Route::post('secure/settings/save-income-voucher-layout-info', 'settings\BasicSettingsController@saveIncomeVoucher');
    Route::post('secure/settings/save-expense-voucher-layout-info', 'settings\BasicSettingsController@saveExpenseVoucher');
    Route::post('secure/settings/save-purchase-voucher-layout-info', 'settings\BasicSettingsController@savePurchaseVoucher');
    Route::post('secure/settings/save-report-layout-info', 'settings\BasicSettingsController@saveReportLayout');
    #measurements
    Route::get('secure/settings/get-measurements','settings\MeasurementSettingsController@index');
    Route::post('secure/settings/save-measurement','settings\MeasurementSettingsController@store');
    Route::post('secure/settings/block-measurements','settings\MeasurementSettingsController@block');
    Route::post('secure/settings/unblock-measurement','settings\MeasurementSettingsController@unblock');
    Route::get('secure/settings/export-measurements', 'settings\MeasurementSettingsController@export');
    Route::post('secure/settings/import-measurements', 'settings\MeasurementSettingsController@import');
    #warehouse
    Route::get('secure/get-warehouses','settings\WarehouseSettingsController@index');
    Route::post('secure/save-warehouse','settings\WarehouseSettingsController@store');
    Route::post('secure/block-warehouses','settings\WarehouseSettingsController@block');
    Route::post('secure/unblock-warehouse','settings\WarehouseSettingsController@unblock');
    Route::get('secure/export-warehouses', 'settings\WarehouseSettingsController@export');
    Route::post('secure/import-warehouses', 'settings\WarehouseSettingsController@import');
    #income-head
    Route::get('secure/settings/get-income-heads','settings\IncomeSettingsController@index');
    Route::post('secure/settings/save-income-head','settings\IncomeSettingsController@store');
    Route::post('secure/settings/block-income-heads','settings\IncomeSettingsController@block');
    Route::post('secure/settings/unblock-income-head','settings\IncomeSettingsController@unblock');
    Route::get('secure/settings/export-income-heads', 'settings\IncomeSettingsController@export');
    Route::post('secure/settings/import-income-heads', 'settings\IncomeSettingsController@import');
    #Expense-head
    Route::get('secure/settings/get-expense-heads','settings\ExpenseSettingsController@index');
    Route::post('secure/settings/save-expense-head','settings\ExpenseSettingsController@store');
    Route::post('secure/settings/block-expense-heads','settings\ExpenseSettingsController@block');
    Route::post('secure/settings/unblock-expense-head','settings\ExpenseSettingsController@unblock');
    Route::get('secure/settings/export-expense-heads', 'settings\ExpenseSettingsController@export');
    Route::post('secure/settings/import-expense-heads', 'settings\ExpenseSettingsController@import');
    #user
    Route::get('secure/settings/get-users','settings\UsersSettingsController@index');
    Route::get('secure/settings/get-roles','settings\UsersSettingsController@roles');
    Route::post('secure/settings/manually-verify-email','settings\UsersSettingsController@manuallyVerifyEmail');
    Route::post('secure/settings/save-user','settings\UsersSettingsController@store');
    Route::post('secure/settings/block-users','settings\UsersSettingsController@block');
    Route::post('secure/settings/unblock-user','settings\UsersSettingsController@unblock');
    Route::get('secure/settings/export-users', 'settings\UsersSettingsController@export');
    Route::post('secure/settings/import-users', 'settings\UsersSettingsController@import');
    #banks
    Route::get('secure/get-banks','BankController@index');
    Route::post('secure/save-bank','BankController@store');
    Route::post('secure/block-banks','BankController@block');
    Route::post('secure/unblock-bank','BankController@unblock');
    Route::get('secure/export-banks', 'BankController@export');
    Route::post('secure/import-banks', 'BankController@import');
    #Supplier
    Route::get('secure/get-suppliers','SupplierController@index');
    Route::post('secure/save-supplier','SupplierController@store');
    Route::post('secure/block-suppliers','SupplierController@block');
    Route::post('secure/unblock-supplier','SupplierController@unblock');
    Route::get('secure/export-suppliers', 'SupplierController@export');
    Route::post('secure/import-suppliers', 'SupplierController@import');
    #customers
    Route::get('secure/get-customers','CustomerController@index');
    Route::post('secure/save-customer','CustomerController@store');
    Route::post('secure/block-customers','CustomerController@block');
    Route::post('secure/unblock-customer','CustomerController@unblock');
    Route::get('secure/export-customers', 'CustomerController@export');
    Route::post('secure/import-customers', 'CustomerController@import');
    #product
    #category
    Route::get('secure/product/get-categories','product\CategoryController@index');
    Route::post('secure/product/save-category','product\CategoryController@store');
    Route::post('secure/product/block-categories','product\CategoryController@block');
    Route::post('secure/product/unblock-category','product\CategoryController@unblock');
    Route::get('secure/product/export-categories', 'product\CategoryController@export');
    Route::post('secure/product/import-categories', 'product\CategoryController@import');
    #products
    Route::get('secure/product/get-products','product\ProductController@index');
    Route::post('secure/product/get-products-by-category','product\ProductController@getByCategory');
    Route::post('secure/product/get-products-by-warehouse','product\ProductController@getByWarehouse');
    Route::post('secure/product/get-products-create-info','product\ProductController@create');
    Route::post('secure/product/save-product','product\ProductController@store');
    Route::post('secure/product/block-products','product\ProductController@block');
    Route::post('secure/product/unblock-product','product\ProductController@unblock');
    Route::get('secure/product/export-products', 'product\ProductController@export');
    Route::post('secure/product/import-products', 'product\ProductController@import');
    #opening-stock
    Route::get('secure/settings/get-opening-stocks','settings\OpeningStockSettingsController@index');
    Route::get('secure/settings/get-opening-stock-default-data','settings\OpeningStockSettingsController@getDefaultData');
    Route::post('secure/settings/get-opening-stock-products-by-category','settings\OpeningStockSettingsController@getByCategory');
    Route::post('secure/settings/save-opening-stock','settings\OpeningStockSettingsController@store');
    #purchase
    Route::get('secure/purchase/get-purchase-vouchers','purchase\PurchaseController@index');
    Route::get('secure/purchase/get-purchase-vouchers-default-data','purchase\PurchaseController@getDefaultData');
    Route::post('secure/purchase/save-purchase-voucher','purchase\PurchaseController@store');
    Route::post('secure/purchase/save-purchase-return','purchase\PurchaseController@saveReturnInfo');
    Route::post('secure/purchase/get-purchase-voucher-details','purchase\PurchaseController@show');
    Route::post('secure/purchase/delete-purchase-voucher','purchase\PurchaseController@distroy');
    #sales
    Route::get('secure/sales/get-sales-invoices','sales\SalesController@index');
    Route::get('secure/sales/get-pending-delivery-invoices','sales\SalesController@pendingDelivery');
    Route::get('secure/sales/get-sales-invoices-default-data','sales\SalesController@getDefaultData');
    Route::post('secure/sales/add-to-cart','sales\SalesController@addToCart');
    Route::get('secure/sales/get-cart-info','sales\SalesController@getToCart');
    Route::get('secure/sales/clear-cart','sales\SalesController@clearCart');
    Route::post('secure/sales/remove-cart-product','sales\SalesController@removeCartProduct');
    Route::post('secure/sales/save-invoice','sales\SalesController@store');
    Route::post('secure/sales/get-invoice-details','sales\SalesController@show');
    Route::post('secure/sales/delete-invoice','sales\SalesController@distroy');    
    Route::post('secure/sales/save-delivery-invoice','sales\SalesController@saveDeliveryInfo');
    Route::post('secure/sales/save-sales-return','sales\SalesController@saveReturnInfo');
    #income
    Route::get('secure/income/get-income-vouchers','income\IncomeController@index');
    Route::get('secure/income/get-income-vouchers-default-data','income\IncomeController@getDefaultData');
    Route::post('secure/income/save-income-voucher','income\IncomeController@store');
    Route::post('secure/income/get-income-voucher-details','income\IncomeController@show');
    Route::post('secure/income/delete-income-voucher','income\IncomeController@distroy');
    #expense
    Route::get('secure/expense/get-expense-vouchers','expense\ExpenseController@index');
    Route::get('secure/expense/get-expense-vouchers-default-data','expense\ExpenseController@getDefaultData');
    Route::post('secure/expense/save-expense-voucher','expense\ExpenseController@store');
    Route::post('secure/expense/get-expense-voucher-details','expense\ExpenseController@show');
    Route::post('secure/expense/delete-expense-voucher','expense\ExpenseController@distroy');

});