<?php

namespace App\Http\Controllers;

use App\Exports\CustomersExport;
use Exception;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Repositories\SaveRepository;
use Maatwebsite\Excel\Facades\Excel;
use App\Repositories\ValidationRepository;

class CustomerController extends Controller
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
            return Customer::withTrashed()
            ->where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orWhere('phone', 'like', '%' . $src . '%')
            ->orWhere('phone_alt', 'like', '%' . $src . '%')
            ->orWhere('email', 'like', '%' . $src . '%')
            ->orWhere('customer_address', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);            
        }
        else if($sortBy == "active"){
            return Customer::where('name', 'like', '%' . $src . '%')
            ->where('name', 'like', '%' . $src . '%')
            ->orWhere('name_bangla', 'like', '%' . $src . '%')
            ->orWhere('phone', 'like', '%' . $src . '%')
            ->orWhere('phone_alt', 'like', '%' . $src . '%')
            ->orWhere('email', 'like', '%' . $src . '%')
            ->orWhere('customer_address', 'like', '%' . $src . '%')
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else if($sortBy == "deactivated"){
            if(!empty($src)){
                return Customer::onlyTrashed()
                ->where('name', 'like', '%' . $src . '%')
                ->orWhere('name_bangla', 'like', '%' . $src . '%')
                ->orWhere('phone', 'like', '%' . $src . '%')
                ->orWhere('phone_alt', 'like', '%' . $src . '%')
                ->orWhere('email', 'like', '%' . $src . '%')
                ->orWhere('customer_address', 'like', '%' . $src . '%')
                ->orderby('id','DESC')
                ->paginate(25);
            }
            else{
                return Customer::onlyTrashed()
                ->orderby('id','DESC')
                ->paginate(25);
            }
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidCustomer($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->Customer($request);
    }

    public function block(Request $request)
    {
        return $this->save->BlockCustomers($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockCustomer($request);
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
            return Excel::download(new CustomersExport, 'customers.csv');
            SetLog('supplier(s) export.');
            return response()->json(['success'=> 'Data export successfully']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}
