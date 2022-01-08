<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Bank;
use App\Exports\BanksExport;
use Illuminate\Http\Request;
use App\Repositories\SaveRepository;
use Maatwebsite\Excel\Facades\Excel;
use App\Repositories\ValidationRepository;

class BankController extends Controller
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
            return Bank::withTrashed()
            ->where('name', 'like', '%' . $src . '%')
            ->orWhere('account_holder', 'like', '%' . $src . '%')
            ->orWhere('account_no', 'like', '%' . $src . '%')
            ->orWhere('bank_address', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);            
        }
        else if($sortBy == "active"){
            return Bank::where('name', 'like', '%' . $src . '%')
            ->orWhere('account_holder', 'like', '%' . $src . '%')
            ->orWhere('account_no', 'like', '%' . $src . '%')
            ->orWhere('bank_address', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else if($sortBy == "deactivated"){
            if(!empty($src)){
                return Bank::onlyTrashed()
                ->where('name', 'like', '%' . $src . '%')
                ->orWhere('account_holder', 'like', '%' . $src . '%')
                ->orWhere('account_no', 'like', '%' . $src . '%')
                ->orWhere('bank_address', 'like', '%' . $src . '%')
                ->orderby('id','DESC')
                ->paginate(25);
            }
            else{
                return Bank::onlyTrashed()
                ->orderby('id','DESC')
                ->paginate(25);
            }
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidBank($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->Bank($request);
    }

    public function block(Request $request)
    {
        return $this->save->BlockBanks($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockBank($request);
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
            return Excel::download(new BanksExport, 'banks.csv');
            SetLog('banks(s) export.');
            return response()->json(['success'=> 'Data export successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}
