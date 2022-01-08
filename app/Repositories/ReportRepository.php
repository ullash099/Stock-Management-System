<?php
namespace App\Repositories;

use App\Models\Stock;
use App\Models\Currency;
use App\Models\BasicSetting;
use Illuminate\Http\Request;
use App\Models\InvoiceDetail;
use App\Models\InvoiceMaster;
use App\Models\PurchaseDetail;
use App\Models\PurchaseMaster;
use App\Models\VoucherMaster;
use Illuminate\Support\Facades\DB;

class ReportRepository
{
    public function SalesReport($startData,$endData)
    {
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;

        $data['details'] = InvoiceMaster::with('customer')->with('details',function($q){
            $q->with('product',function($qu){
                $qu->with('measurement');
            });
        })
        ->whereBetween('invoice_date',[$startData,$endData])
        ->orderBy('invoice_date')->get();

        $data['currency']   = Currency::find($default_currency);

        return $data;
    }

    public function PurchaseReport($startData,$endData)
    {
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;

        $data['details'] = PurchaseMaster::with('supplier')->with('details',function($q){
            $q->with('product',function($qu){
                $qu->with('measurement');
            });
        })
        ->whereBetween('purchase_date',[$startData,$endData])
        ->orderBy('purchase_date')->get();
        $data['currency']   = Currency::find($default_currency);

        return $data;
    }

    public function StockStatus()
    {
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;

        $data['details'] = Stock::with('warehouse')->with('product',function($q){
            $q->with('measurement');
        })->orderBy('warehouse_id')->get();

        $data['currency']   = Currency::find($default_currency);

        return $data;
    }

    public function IncomeExpenseReport($startData,$endData)
    {
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;

        $data['balance_bf_dr'] = VoucherMaster::select(
            DB::raw('COALESCE(SUM(cash_amount+bank_amount),0) as total')
        )
        ->where([
            ['voucher_type','=','s'],
            ['voucher_type','=','dr']
        ])
        ->whereDate('voucher_date','<=',$startData)
        ->first();
        #->get();

        $data['balance_bf_cr'] = VoucherMaster::select(
            DB::raw('COALESCE(SUM(cash_amount+bank_amount),0) as total')
        )
        ->where('voucher_type','cr')
        ->whereDate('voucher_date','<=',$startData)
        ->first();


        $data['details'] = VoucherMaster::
        join('account_heads','account_heads.id','=','voucher_masters.account_head_id')
        ->select(
            'voucher_masters.voucher_date as voucher_date',
            'voucher_masters.voucher_type as voucher_type',
            'account_heads.name as account_head',
            DB::raw('COALESCE(SUM(voucher_masters.cash_amount+voucher_masters.bank_amount),0) as total')
        )
        ->whereBetween('voucher_masters.voucher_date',[$startData,$endData])
        ->groupBy(['voucher_date', 'account_head','voucher_type'])
        ->orderBy('voucher_masters.voucher_date')->get();

        $data['currency']   = Currency::find($default_currency);

        return $data;
    }
}