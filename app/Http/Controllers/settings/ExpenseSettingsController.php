<?php

namespace App\Http\Controllers\settings;

use App\Exports\ExpenseHeadsExport;
use Exception;
use App\Models\AccountHead;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\SaveRepository;
use Maatwebsite\Excel\Facades\Excel;
use App\Repositories\ValidationRepository;

class ExpenseSettingsController extends Controller
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
            return AccountHead::withTrashed()
            ->where('head_type', 'expenses')
            ->where(function($query) use ($src) {
                $query->where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%');
            })
            ->orderby('id','DESC')
            ->paginate(25);            
        }
        else if($sortBy == "active"){
            return AccountHead::where('head_type', 'expenses')
            ->where(function($query) use ($src) {
                $query->where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%');
            })
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else if($sortBy == "deactivated"){
            if(!empty($src)){
                return AccountHead::onlyTrashed()
                ->where('head_type', 'expenses')
                ->where(function($query) use ($src) {
                    $query->where('name', 'like', '%' . $src . '%')
                    ->orWhere('name_bangla', 'like', '%' . $src . '%');
                })
                ->orderby('id','DESC')
                ->paginate(25);
            }
            else{
                return AccountHead::onlyTrashed()
                ->orderby('id','DESC')
                ->paginate(25);
            }
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidAccountHead($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->ExpenseHead($request);
    }

    public function block(Request $request)
    {
        return $this->save->BlockExpenseHead($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockExpenseHead($request);
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
            return Excel::download(new ExpenseHeadsExport, 'expense-heads.csv');
            SetLog('expense head(s) export.');
            return response()->json(['success'=> 'Data export successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}
