<?php

namespace App\Http\Controllers\purchase;

use App\Models\Product;
use App\Models\Currency;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\BasicSetting;
use Illuminate\Http\Request;
use App\Models\PurchaseMaster;
use App\Http\Controllers\Controller;
use App\Repositories\SaveRepository;
use App\Repositories\ValidationRepository;

class PurchaseController extends Controller
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
            $data['pagination'] = PurchaseMaster::join('suppliers','suppliers.id','=','purchase_masters.supplier_id')
            ->where(function ($q) use ($src)
            {
                $q->where('purchase_masters.voucher', 'like', '%' . $src . '%')
                ->orWhere('purchase_masters.ref', 'like', '%' . $src . '%')
                ->orWhere('purchase_masters.total', 'like', '%' . $src . '%')
                ->orWhere('purchase_masters.purchase_date', 'like', '%' . $src . '%')
                ->orWhere('suppliers.name', 'like', '%' . $src . '%')
                ->orWhere('suppliers.name_bangla', 'like', '%' . $src . '%')
                ->orWhere('suppliers.phone', 'like', '%' . $src . '%')
                ;
            })
            ->with('supplier')
            ->orderby('purchase_masters.id','DESC')
            ->paginate(25);
            return $data;
        }
        else{
            $data['pagination'] = PurchaseMaster::with('supplier')
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
            'suppliers'     =>  Supplier::all(),
            'products'      =>  Product::with('measurement')->get(),
            'currency'      =>  Currency::find($default_currency),
        ];
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidPurchase($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->Purchase($request);
    }

    public function show(Request $request)
    {
        $data['record'] = PurchaseMaster::where('voucher', $request->voucher)
        ->with('supplier')->with('details',function($query){
            $query->with('warehouse')->with('product',function($q){
                $q->with('measurement');
            });
        })
        ->firstOrFail();
        
        $basicSettings = BasicSetting::all();
        foreach ($basicSettings as $setting) {
            if (in_array($setting->name,['company_name','company_phone',
                'default_currency',
                'company_address','company_email','purchase_voucher_footer_note'
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
        return $this->save->BlockPurchaseVoucher($request);
    }

    public function saveReturnInfo(Request $request)
    {
        $isValid = $this->vr->isValidPurchaseReturn($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->PurchaseReturn($request);
    }
}
