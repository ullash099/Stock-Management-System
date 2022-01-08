<?php

namespace App\Http\Controllers\settings;

use Exception;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use App\Exports\WarehousesExport;
use App\Imports\WarehousesImport;
use App\Http\Controllers\Controller;
use App\Repositories\SaveRepository;
use Maatwebsite\Excel\Facades\Excel;
use App\Repositories\ValidationRepository;

class WarehouseSettingsController extends Controller
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
            return Warehouse::withTrashed()
            ->where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orWhere('address', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);            
        }
        else if($sortBy == "active"){
            return Warehouse::where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orWhere('address', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else if($sortBy == "deactivated"){
            if(!empty($src)){
                return Warehouse::onlyTrashed()
                ->where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%')
                ->orWhere('address', 'like', '%' . $src . '%')
                ->orderby('id','DESC')
                ->paginate(25);
            }
            else{
                return Warehouse::onlyTrashed()
                ->orderby('id','DESC')
                ->paginate(25);
            }
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidWarehouse($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->Warehouse($request);
    }

    public function block(Request $request)
    {
        return $this->save->BlockWarehouse($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockWarehouse($request);
    }

    public function import(Request $request)
    {
        $isValid = $this->vr->isValidImportfile($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        try {
            Excel::import(new WarehousesImport, $request->file('file'));
            SetLog('warehouse(s) import.');
            return response()->json(['success'=> 'Data Imported Successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public static function export()
    {
        try {
            return Excel::download(new WarehousesExport, 'warehouses.csv');
            SetLog('warehouse(s) export.');
            return response()->json(['success'=> 'Data export successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}
