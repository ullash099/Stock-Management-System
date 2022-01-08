<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Supplier;
use Illuminate\Http\Request;
use App\Exports\SuppliersExport;
use App\Repositories\SaveRepository;
use Maatwebsite\Excel\Facades\Excel;
use App\Repositories\ValidationRepository;

class SupplierController extends Controller
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
            return Supplier::withTrashed()
            ->where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orWhere('phone', 'like', '%' . $src . '%')
            ->orWhere('phone_alt', 'like', '%' . $src . '%')
            ->orWhere('email', 'like', '%' . $src . '%')
            ->orWhere('supplier_address', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);            
        }
        else if($sortBy == "active"){
            return Supplier::where('name', 'like', '%' . $src . '%')
            ->where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orWhere('phone', 'like', '%' . $src . '%')
            ->orWhere('phone_alt', 'like', '%' . $src . '%')
            ->orWhere('email', 'like', '%' . $src . '%')
            ->orWhere('supplier_address', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else if($sortBy == "deactivated"){
            if(!empty($src)){
                return Supplier::onlyTrashed()
                ->where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%')
                ->orWhere('phone', 'like', '%' . $src . '%')
                ->orWhere('phone_alt', 'like', '%' . $src . '%')
                ->orWhere('email', 'like', '%' . $src . '%')
                ->orWhere('supplier_address', 'like', '%' . $src . '%')
                ->orderby('id','DESC')
                ->paginate(25);
            }
            else{
                return Supplier::onlyTrashed()
                ->orderby('id','DESC')
                ->paginate(25);
            }
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidSupplier($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->Supplier($request);
    }

    public function block(Request $request)
    {
        return $this->save->BlockSuppliers($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockSupplier($request);
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
            return Excel::download(new SuppliersExport, 'suppliers.csv');
            SetLog('supplier(s) export.');
            return response()->json(['success'=> 'Data export successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}
