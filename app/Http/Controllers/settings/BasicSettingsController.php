<?php

namespace App\Http\Controllers\settings;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\BasicSetting;
use App\Models\Currency;
use App\Repositories\SaveRepository;
use App\Repositories\ValidationRepository;

class BasicSettingsController extends Controller
{
    private $vr;
    private $save;
    public function __construct(ValidationRepository $validationRepository, SaveRepository $saveRepository)
    {
        $this->vr = $validationRepository;
        $this->save = $saveRepository; 
    }

    public function index()
    {
        $settings = [];
        foreach(BasicSetting::all() as $bs){
            $settings[$bs->name] = $bs->val;
        }

        $data = [
            'settings'      =>  $settings,
            'currencies'    =>  Currency::all(),
        ];
        return $data;
    }

    public function saveCompanyProfile(Request $request)
    {
        $isValid = $this->vr->isValidCompanyProfile($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->BasicSettings([
            'company_name'      =>  $request->company_name,
            'company_phone'     =>  $request->company_phone,
            'company_email'     =>  $request->company_email,
            'company_address'   =>  $request->company_address
        ]);
    }
    
    public function saveCurrencyInfo(Request $request)
    {
        $isValid = $this->vr->isValidCurrencyInfo($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->BasicSettings([
            'default_currency'  =>  $request->default_currency,
            'bin_no'            =>  $request->bin_no,
            'mushak_no'         =>  $request->mushak_no,
            'vat'               =>  $request->vat
        ]);
    }
    
    public function saveInvoiceLayout(Request $request)
    {
        $isValid = $this->vr->isValidInvoiceLayout($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->BasicSettings([
            'invoice_print_layout'  =>  $request->invoice_print_layout,
            'invoice_font_size'     =>  $request->invoice_font_size,
            'invoice_footer_note'   =>  $request->invoice_footer_note,
        ]);
    }
    
    public function saveIncomeVoucher(Request $request)
    {
        $isValid = $this->vr->isValidIncomeVoucherLayout($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->BasicSettings([
            'income_voucher_print_layout'  =>  $request->income_voucher_print_layout,
            'income_voucher_font_size'     =>  $request->income_voucher_font_size,
            'income_voucher_footer_note'   =>  $request->income_voucher_footer_note,
        ]);
    }
    
    public function saveExpenseVoucher(Request $request)
    {
        $isValid = $this->vr->isValidExpenseVoucherLayout($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->BasicSettings([
            'expense_voucher_print_layout'  =>  $request->expense_voucher_print_layout,
            'expense_voucher_font_size'     =>  $request->expense_voucher_font_size,
            'expense_voucher_footer_note'   =>  $request->expense_voucher_footer_note,
        ]);
    }
    
    public function savePurchaseVoucher(Request $request)
    {
        $isValid = $this->vr->isValidPurchaseVoucher($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->BasicSettings([
            'purchase_voucher_print_layout'  =>  $request->purchase_voucher_print_layout,
            'purchase_voucher_font_size'     =>  $request->purchase_voucher_font_size,
            'purchase_voucher_footer_note'   =>  $request->purchase_voucher_footer_note,
        ]);
    }
    
    public function saveReportLayout(Request $request)
    {
        $isValid = $this->vr->isValidReportLayout($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->BasicSettings([
            'report_print_layout'  =>  $request->report_print_layout,
            'report_font_size'     =>  $request->report_font_size,
            'report_footer_note'   =>  $request->report_footer_note,
        ]);
    }
}
