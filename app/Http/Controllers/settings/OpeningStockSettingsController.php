<?php

namespace App\Http\Controllers\settings;

use App\Models\Product;
use App\Models\Category;
use App\Models\Warehouse;
use App\Models\OpeningStock;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\SaveRepository;
use App\Repositories\ValidationRepository;

class OpeningStockSettingsController extends Controller
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
        if(!empty($src)){
            return OpeningStock::where(function($query) use ($src){
                $warehouses = Warehouse::where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%')->get();
                $warehouse_id = [];
                foreach($warehouses as $warehouse){
                    array_push($warehouse_id,$warehouse->id);
                }

                $categories = Category::where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%')->get();
                $category_id = [];
                foreach($categories as $category){
                    array_push($category_id,$category->id);
                }
                
                $products = Product::where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%')->get();
                $product_id = [];
                foreach($products as $product){
                    array_push($product_id,$product->id);
                }

                $query->orWhereIn('warehouse_id',$warehouse_id)
                ->orWhereIn('category_id',$category_id)
                ->orWhereIn('product_id',$product_id);
            })
            ->with('warehouse')->with('category')
            ->with('product',function ($q)
            {
                return $q->with('measurement');
            })
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else{
            return OpeningStock::with('warehouse')->with('category')
            ->with('product',function ($q)
            {
                return $q->with('measurement');
            })
            ->orderby('id','DESC')
            ->paginate(25);
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function getDefaultData()
    {
        return [
            'categories'    =>  Category::all(),
            'warehouses'    =>  Warehouse::all(),
        ];
    }

    public function getByCategory(Request $request)
    {
        return [
            'products'  =>  Product::where('category_id',$request->category)
                            ->with('opening_stock')
                            ->doesntHave('opening_stock','and',function($q) use ($request) {
                                $q->where('warehouse_id', '=', $request->warehouse);
                            })
                            ->get()
        ];
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidOpeningStock($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->OpeningStock($request);
    }
}
