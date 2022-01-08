<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;

class AdminController extends Controller
{
    public function __construct()
    {
    }

    public function index()
    {
        Artisan::call('optimize:clear');
        $user = Auth::user();
        $status = false;
        $role = null;

        if(!empty($user)){
            $status = true;
            $role = $user->role->name;
        }
        $this->addViewData([
            'status'    =>   $status,
            'role'      =>   $role
        ]);
        return view('app')->with($this->viewData);
    }

    public function migration()
    {
        Artisan::call('migrate:fresh');
    }
}
