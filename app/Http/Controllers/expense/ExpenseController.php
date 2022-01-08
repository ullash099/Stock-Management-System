<?php

namespace App\Http\Controllers\expense;

use App\Models\Bank;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\AccountHead;
use App\Models\BasicSetting;
use Illuminate\Http\Request;
use App\Models\VoucherMaster;
use App\Http\Controllers\Controller;
use App\Repositories\SaveRepository;
use App\Repositories\ValidationRepository;

class ExpenseController extends Controller
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
        $src = $_GET['src'] ?? null;
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;

        $data['currency']   = Currency::find($default_currency);
        if(!empty($src)){
            $data['pagination'] = VoucherMaster::join('customers','customers.id','=','voucher_masters.customer_id')
            ->join('suppliers','suppliers.id','=','voucher_masters.supplier_id')
            ->join('banks','banks.id','=','voucher_masters.bank_id')
            ->where('voucher_type','cr')
            ->where(function ($q) use ($src)
            {
                $q->where('voucher_masters.voucher', 'like', '%' . $src . '%')
                ->orWhere('voucher_masters.total', 'like', '%' . $src . '%')
                ->orWhere('purchase_masters.purchase_date', 'like', '%' . $src . '%')

                ->orWhere('customers.name', 'like', '%' . $src . '%')
                ->orWhere('customers.name_bangla', 'like', '%' . $src . '%')
                ->orWhere('customers.phone', 'like', '%' . $src . '%')

                ->orWhere('banks.name', 'like', '%' . $src . '%')
                ->orWhere('banks.name_bangla', 'like', '%' . $src . '%')
                ->orWhere('banks.phone', 'like', '%' . $src . '%')

                ->orWhere('suppliers.name', 'like', '%' . $src . '%')
                ->orWhere('suppliers.name_bangla', 'like', '%' . $src . '%')
                ->orWhere('suppliers.phone', 'like', '%' . $src . '%')
                ;
            })
            ->with('supplier','customer','bank','withdraw_from_bank','deposit_in_bank','account_head')
            ->orderby('voucher_masters.id','DESC')
            ->paginate(25);
            return $data;
        }
        else{
            $data['pagination'] = VoucherMaster::with('supplier','customer','bank','withdraw_from_bank','deposit_in_bank','account_head')
            ->where('voucher_type','cr')->orderby('id','DESC')
            ->paginate(25);
            return $data;
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function getDefaultData()
    {
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;
        return [
            'account_heads' =>  AccountHead::where('head_type','expenses')
            ->whereNotIn('id', [1])->get(),
            'currency'      =>  Currency::find($default_currency),
            'banks'         =>  Bank::all(),
            'customers'     =>  Customer::all(),
            'suppliers'     =>  Supplier::all(),
        ];
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidExpenseVoucher($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->ExpenseVoucher($request);
    }

    public function show(Request $request)
    {
        $data['record'] = VoucherMaster::where('voucher', $request->voucher)
        ->with('supplier','customer','bank','deposit_in_bank',
        'account_head','details','user')
        ->firstOrFail();
        
        $basicSettings = BasicSetting::all();
        foreach ($basicSettings as $setting) {
            if (in_array($setting->name,['company_name','company_phone','default_currency',
            'company_address','company_email','expense_voucher_footer_note'
            ])) {
                $data[$setting->name] = $setting->val;
            }
        }
        $default_currency = $data['default_currency'] ?? 1;
        $currency = Currency::find($default_currency);
        $data['currency'] = $currency->sign;
        return $data;
    }

    public function print($voucher)
    {
        $data['record'] = VoucherMaster::where('voucher', $voucher)
        ->with('supplier','customer','bank','withdraw_from_bank',
        'account_head','details','user')
        ->firstOrFail();
        
        $basicSettings = BasicSetting::all();
        foreach ($basicSettings as $setting) {
            if (in_array($setting->name,[
                'company_name','company_phone','company_address','company_email',
                'default_currency',
                'expense_voucher_print_layout','expense_voucher_font_size',
                'expense_voucher_language','expense_voucher_footer_note'
            ])) {
                if ($setting->name == 'expense_voucher_font_size') {
                    $data['fontSize'] = $setting->val;
                }
                else{
                    $data[$setting->name] = $setting->val;
                } 
            }
        }
        $default_currency = $data['default_currency'] ?? 1;
        $currency = Currency::find($default_currency);
        $data['currency'] = $currency->sign;
        
        $layout = $data['expense_voucher_print_layout'];

        return view('print.expense.a4')->with($data);
        /* if ($layout == 'pos') {
            return view('print.sales.pos')->with($data);
        } else {
            return view('print.sales.a4')->with($data);
        } */
    }
}
