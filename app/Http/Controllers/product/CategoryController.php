<?php

namespace App\Http\Controllers\product;

use Exception;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Exports\CategoriesExport;
use App\Http\Controllers\Controller;
use App\Repositories\SaveRepository;
use Maatwebsite\Excel\Facades\Excel;
use App\Repositories\ValidationRepository;

class CategoryController extends Controller
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
            return Category::withTrashed()
            ->where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orWhere('description', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);            
        }
        else if($sortBy == "active"){
            return Category::where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orWhere('description', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else if($sortBy == "deactivated"){
            if(!empty($src)){
                return Category::onlyTrashed()
                ->where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%')
                ->orWhere('description', 'like', '%' . $src . '%')
                ->orderby('id','DESC')
                ->paginate(25);
            }
            else{
                return Category::onlyTrashed()
                ->orderby('id','DESC')
                ->paginate(25);
            }
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidCategory($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        if ($request->hasFile('file')){
            $validator = $this->vr->isValidfile($request);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()->all()]);
            }
        }
        return $this->save->Category($request);
    }

    public function block(Request $request)
    {
        return $this->save->BlockCategories($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockCategory($request);
    }

    public function import(Request $request)
    {
        $isValid = $this->vr->isValidImportfile($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return response()->json(['errors' => ['invalid request']]);
        /* try {
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
            return Excel::download(new CategoriesExport, 'categories.csv');
            SetLog('Product category(s) export.');
            return response()->json(['success'=> 'Data export successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}
