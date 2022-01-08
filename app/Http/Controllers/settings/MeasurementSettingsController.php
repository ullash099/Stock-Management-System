<?php

namespace App\Http\Controllers\settings;

use App\Exports\MeasurementsExport;
use Exception;
use App\Models\Measurement;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Imports\MeasurementsImport;
use App\Repositories\SaveRepository;
use Maatwebsite\Excel\Facades\Excel;
use App\Repositories\ValidationRepository;

class MeasurementSettingsController extends Controller
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
            return Measurement::withTrashed()
            ->where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);            
        }
        else if($sortBy == "active"){
            return Measurement::where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else if($sortBy == "deactivated"){
            if(!empty($src)){
                return Measurement::onlyTrashed()
                ->where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%')
                ->orderby('id','DESC')
                ->paginate(25);
            }
            else{
                return Measurement::onlyTrashed()
                ->orderby('id','DESC')
                ->paginate(25);
            }
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidMeasurement($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->Measurement($request);
    }

    public function block(Request $request)
    {
        return $this->save->BlockMeasurements($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockMeasurement($request);
    }

    public function import(Request $request)
    {
        $isValid = $this->vr->isValidImportfile($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        try {
            Excel::import(new MeasurementsImport, $request->file('file'));
            SetLog('measurement(s) import.');
            return response()->json(['success'=> 'Data Imported Successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public static function export()
    {
        try {
            return Excel::download(new MeasurementsExport, 'measurements.csv');
            SetLog('measurement(s) export.');
            return response()->json(['success'=> 'Data export successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}
