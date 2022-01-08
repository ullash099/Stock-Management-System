<?php

namespace App\Http\Controllers\settings;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Role;
use App\Repositories\SaveRepository;
use App\Repositories\ValidationRepository;

class RoleSettingsController extends Controller
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
        # code...
    }

    public function create($id = null)
    {
        if (!empty($id)) {
            $data['data'] =  Role::fine($id);
        }
        //$data['menus']  =   (array)Menu::where('parent_id', null)->with('childs')->get();
        $data['menus']  =   Menu::where('parent_id', null)->with('childs')->get();
        return $data;
    }

    public function store(Request $request)
    {
        # code...
    }
}
