<?php

namespace App\Http\Controllers\product;

use Exception;
use App\Models\Product;
use App\Models\Category;
use App\Models\Currency;
use App\Models\Measurement;
use App\Models\BasicSetting;
use Illuminate\Http\Request;
use App\Exports\ProductsExport;
use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Repositories\SaveRepository;
use Maatwebsite\Excel\Facades\Excel;
use App\Repositories\ValidationRepository;

class ProductController extends Controller
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
        $sortBy = $_GET['sort_by'] ?? null;
        $src = $_GET['src'] ?? null;
        if(empty($sortBy) || $sortBy == "all"){
            return Product::withTrashed()
            ->join('categories','categories.id','=','products.category_id')
            ->select('products.*')
            ->where('products.name', 'like', '%' . $src . '%')
            ->orWhere('products.name_bangla', 'like', '%' . $src . '%')
            ->orWhere('products.purchase_price', 'like', '%' . $src . '%')
            ->orWhere('products.vat', 'like', '%' . $src . '%')
            ->orWhere('products.reorder_qty', 'like', '%' . $src . '%')
            ->orWhere('categories.name', 'like', '%' . $src . '%')
            ->with('category')->with('measurement')
            ->orderby('products.id','DESC')
            ->paginate(25);            
        }
        else if($sortBy == "active"){
            return Product::join('categories','categories.id','=','products.category_id')
            ->select('products.*')
            ->where('products.name', 'like', '%' . $src . '%')
            ->orWhere('products.name_bangla', 'like', '%' . $src . '%')
            ->orWhere('products.purchase_price', 'like', '%' . $src . '%')
            ->orWhere('products.vat', 'like', '%' . $src . '%')
            ->orWhere('products.reorder_qty', 'like', '%' . $src . '%')
            ->orWhere('categories.name', 'like', '%' . $src . '%')
            ->with('category')->with('measurement')
            ->orderby('products.id','DESC')
            ->paginate(25);
        }
        else if($sortBy == "deactivated"){
            if(!empty($src)){
                return Product::onlyTrashed()
                ->join('categories','categories.id','=','products.category_id')
                ->select('products.*')
                ->whereNotNull('categories.deleted_at')
                ->where(function($q) use($src){
                    $q->where('products.name', 'like', '%' . $src . '%')
                    ->orWhere('products.name_bangla', 'like', '%' . $src . '%')
                    ->orWhere('products.purchase_price', 'like', '%' . $src . '%')
                    ->orWhere('products.vat', 'like', '%' . $src . '%')
                    ->orWhere('products.reorder_qty', 'like', '%' . $src . '%')
                    ->orWhere('categories.name', 'like', '%' . $src . '%');
                })
                ->with('category')->with('measurement')
                ->orderby('products.id','DESC')
                ->paginate(25);
            }
            else{
                return Product::onlyTrashed()
                ->with('category')->with('measurement')
                ->orderby('id','DESC')
                ->paginate(25);
            }
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function create(Request $request)
    {
        $basicSetting       = BasicSetting::where('name','default_currency')->first();
        $default_currency   = $basicSetting->val ?? 1;

        $data = [
            'categories'    =>  Category::all(),
            'measurements'  =>  Measurement::all(),
            'currency'      =>  Currency::find($default_currency),
        ];
        return $data;
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidProduct($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->Product($request);
    }

    public function getByCategory(Request $request)
    {
        return ['products'=>Product::where('category_id',$request->category)->get()];
    }
    
    public function getByWarehouse(Request $request)
    {
        return [
            'products'=> Stock::where([
                ['warehouse_id','=',$request->warehouse],
                ['qty','>',0],
            ])->with('product',function ($q)
            {
                $q->with('measurement');
            })->get()
        ];
    }

    public function block(Request $request)
    {
        return $this->save->BlockProducts($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockProduct($request);
    }

    public function import(Request $request)
    {
        $isValid = $this->vr->isValidImportfile($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return response()->json(['errors' => ['invalid request']]);
        $info = Product::withTrashed()->find($request->id);
        /* try { php artisan make:export ProductsExport --model=Product
            Excel::import(new IncomeHeadsImport, $request->file('file'));
            SetLog('income head(s) import.');
            return response()->json(['success'=> 'Data Imported Successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        } */
    }

    public static function export()
    {
        try {
            return Excel::download(new ProductsExport, 'products.csv');
            SetLog('Product category(s) export.');
            return response()->json(['success'=> 'Data export successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

}
