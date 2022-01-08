<?php

namespace App\Http\Controllers\sales;

use App\Models\Currency;
use App\Models\Customer;
use App\Models\Warehouse;
use App\Models\BasicSetting;
use Illuminate\Http\Request;
use App\Models\InvoiceMaster;
use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Repositories\CartRepository;
use App\Repositories\SaveRepository;
use App\Repositories\ValidationRepository;
use Cart;

class SalesController extends Controller
{
    private $vr;
    private $save;
    private $cr;
    public function __construct(
        ValidationRepository $validationRepository, 
        SaveRepository $saveRepository,
        CartRepository $cartRepository
    )
    {
        $this->vr = $validationRepository;
        $this->save = $saveRepository; 
        $this->cr = $cartRepository;
    }

    public function index()
    {
        $src = $_GET['src'] ?? null;
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;

        $data['currency']   = Currency::find($default_currency);
        if(!empty($src)){
            $data['pagination'] = InvoiceMaster::join('customers','customers.id','=','invoice_masters.customer_id')
            ->where(function ($q) use ($src)
            {
                $q->where('invoice_masters.invoice', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.invoice_date', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.total', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.advance', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.net_payable', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.receive', 'like', '%' . $src . '%')
                ->orWhere('customers.name', 'like', '%' . $src . '%')
                ->orWhere('customers.name_bangla', 'like', '%' . $src . '%')
                ->orWhere('customers.phone', 'like', '%' . $src . '%')
                ;
            })
            ->with('customer')
            ->orderby('invoice_masters.id','DESC')
            ->paginate(25);
            return $data;
        }
        else{
            $data['pagination'] = InvoiceMaster::with('customer')
            ->orderby('id','DESC')
            ->paginate(25);
            return $data;
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }
    
    public function pendingDelivery()
    {
        $src = $_GET['src'] ?? null;
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;

        $data['currency']   = Currency::find($default_currency);
        if(!empty($src)){
            $data['pagination'] = InvoiceMaster::join('customers','customers.id','=','invoice_masters.customer_id')
            ->where(function ($q) use ($src)
            {
                $q->where('invoice_masters.invoice', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.invoice_date', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.total', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.advance', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.net_payable', 'like', '%' . $src . '%')
                ->orWhere('invoice_masters.receive', 'like', '%' . $src . '%')
                ->orWhere('customers.name', 'like', '%' . $src . '%')
                ->orWhere('customers.name_bangla', 'like', '%' . $src . '%')
                ->orWhere('customers.phone', 'like', '%' . $src . '%')
                ;
            })
            ->where('is_delivered',false)
            ->with('customer')
            ->orderby('invoice_masters.id','DESC')
            ->paginate(25);
            return $data;
        }
        else{
            $data['pagination'] = InvoiceMaster::with('customer')
            ->where('is_delivered',false)
            ->orderby('id','DESC')
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
            'voucher'       =>  time(),
            'warehouses'    =>  Warehouse::all(),
            'customers'     =>  Customer::all(),
            'banks'         =>  Bank::all(),
            'currency'      =>  Currency::find($default_currency),
        ];
    }

    public function addToCart(Request $request)
    {
        $validator = $this->vr->isValidCart($request);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        return $this->cr->addToCart($request);
    }

    public function getToCart()
    {
        return [
            'cart'          =>  Cart::getContent(),
            'sub_total'     =>  Cart::getSubTotal(),
            'total_vat'     =>  Cart::getCondition('VAT')->parsedRawValue ?? 0,
            'total'         =>  Cart::getTotal(),
        ];
    }

    public function clearCart()
    {
        if ($this->cr->clearCart()) {
            return [
                'cart'          =>  Cart::getContent(),
                'sub_total'     =>  Cart::getSubTotal(),
                'total_vat'     =>  Cart::getCondition('VAT')->parsedRawValue ?? 0,
                'total'         =>  Cart::getTotal(),
            ];
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function removeCartProduct(Request $request)
    {
        return $this->cr->removeCartProduct($request->rowid);
    }

    public function store(Request $request)
    {
        $validator = $this->vr->isValidSales($request);
        if ($validator->fails())
        {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        return $this->save->Sales($request);
    }

    public function show(Request $request)
    {
        $data['record'] = InvoiceMaster::where('invoice', $request->invoice)
        ->with('customer','bank','user')->with('details',function($query){
            $query->with('warehouse')->with('product',function($q){
                $q->with('measurement','category');
            });
        })
        ->firstOrFail();        
        $basicSettings = BasicSetting::all();
        foreach ($basicSettings as $setting) {
            if (in_array($setting->name,['company_name','company_phone','default_currency',
            'company_address','company_email','invoice_footer_note'
            ])) {
                $data[$setting->name] = $setting->val;
            }
        }
        $default_currency = $data['default_currency'] ?? 1;
        $currency = Currency::find($default_currency);
        $data['currency'] = $currency->sign;
        return $data;
    }

    public function distroy(Request $request)
    {
        return $this->save->DeleteInvoice($request);
    }

    public function saveDeliveryInfo(Request $request)
    {
        $validator = $this->vr->isValidDeliveryInfo($request);
        if ($validator->fails())
        {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        $details = $this->save->Delivery($request);
        if ($details) {
            return $this->save->chckDoneDelivery($request->invoice);
        }
        return $details;
    }

    public function saveReturnInfo(Request $request)
    {
        $validator = $this->vr->isValidReturnInfo($request);
        if ($validator->fails())
        {
            return response()->json(['errors' => $validator->errors()->all()]);
        }

        return $this->save->Return($request);
    }

    public function print($invoice)
    {
        $data['record'] = InvoiceMaster::where('invoice', $invoice)
                        ->with('customer','bank','user')->with('details',function($query){
                            $query->with('warehouse')->with('product',function($q){
                                $q->with('measurement','category');
                            });
                        })
                        ->firstOrFail();
                        
        $basicSettings = BasicSetting::all();
        foreach ($basicSettings as $setting) {
            if (in_array($setting->name,[
                'company_name','company_phone','company_address','company_email',
                'default_currency',
                'invoice_print_layout','invoice_font_size','invoice_print_language',
                'invoice_footer_note'
            ])) {
                if ($setting->name == 'invoice_font_size') {
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

        $layout = $data['invoice_print_layout'];

        return view('print.sales.a4')->with($data);
        /* if ($layout == 'pos') {
            return view('print.sales.pos')->with($data);
        } else {
            return view('print.sales.a4')->with($data);
        } */
    }
}
