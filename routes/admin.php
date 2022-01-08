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
//control/secure
Route::group(['middleware'=>['auth:sanctum', 'verified']],function (){
    Route::get('control/{slag?}/{id?}','AdminController@index');

    Route::get('/my-info','profile\UserProfileController@userInfo');
    Route::get('/my-other-device-session-info','profile\UserProfileController@MySessions');
    Route::post('user/profile-information', 'profile\UserProfileSettingsController@updateProfileInfo');
    Route::post('user/update-password', 'profile\UserProfileSettingsController@updatePassword');
    Route::post('user/other-browser-sessions', 'profile\OtherBrowserSessionsController@destroy');
    Route::post('user/two-factor-authentication', 'profile\TwoFactorAuthenticationController@store');
    Route::post('user/delete-two-factor-authentication', 'profile\TwoFactorAuthenticationController@destroy');
    Route::post('user/two-factor-recovery-codes', 'profile\TwoFactorAuthenticationController@regenerate');
    Route::post('user/save-primary-printer', 'profile\UserProfileSettingsController@SavePrimaryPrinter');
    
    #Product Category
    Route::get('secure/product-category-list', 'admin\CategoryController@index');
    Route::post('secure/save-product-category', 'admin\CategoryController@store');
    Route::post('secure/block-category', 'admin\CategoryController@block');
    Route::post('secure/unblock-category', 'admin\CategoryController@unblock');
    Route::get('secure/export-categories', 'admin\CategoryController@export');
    Route::post('secure/import-categories', 'admin\CategoryController@import');

    #Product brands
    Route::get('secure/product-brands', 'admin\BrandController@index');
    Route::post('secure/save-product-brand', 'admin\BrandController@store');
    Route::post('secure/block-brands', 'admin\BrandController@block');
    Route::post('secure/unblock-brand', 'admin\BrandController@unblock');
    Route::get('secure/export-brands', 'admin\BrandController@export');
    Route::post('secure/import-brands', 'admin\BrandController@import');
    
    #Product Attributes
    Route::get('secure/product-attributes', 'admin\AttributeController@index');
    Route::post('secure/save-product-attribute', 'admin\AttributeController@store');
    Route::post('secure/block-attributes', 'admin\AttributeController@block');
    Route::post('secure/unblock-attribute', 'admin\AttributeController@unblock');
    Route::get('secure/export-attributes', 'admin\AttributeController@export');
    Route::post('secure/import-attributes', 'admin\AttributeController@import');

    #Product tag
    Route::get('secure/product-tags', 'admin\TagController@index');
    Route::post('secure/save-product-tag', 'admin\TagController@store');
    Route::post('secure/block-tag', 'admin\TagController@block');
    Route::post('secure/unblock-tag', 'admin\TagController@unblock');
    Route::get('secure/export-tags', 'admin\TagController@export');
    Route::post('secure/import-tags', 'admin\TagController@import');
    
    #Product 
    Route::get('secure/products', 'admin\ProductController@index');
    Route::get('secure/product-create/{id?}', 'admin\ProductController@create');
    Route::post('secure/save-product-general-info', 'admin\ProductController@storeGeneralInfo');
    Route::post('secure/block-products', 'admin\ProductController@block');
    Route::post('secure/unblock-product', 'admin\ProductController@unblock');
    Route::get('secure/export-products', 'admin\ProductController@export');
    Route::post('secure/import-products', 'admin\ProductController@import');
    
});