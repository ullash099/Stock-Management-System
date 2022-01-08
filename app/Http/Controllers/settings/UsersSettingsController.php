<?php

namespace App\Http\Controllers\settings;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Repositories\SaveRepository;
use App\Repositories\ValidationRepository;
use Illuminate\Support\Facades\Auth;

class UsersSettingsController extends Controller
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
        $user_id = Auth::user()->id;
        $src = $_GET['src'] ?? null;
        if(!empty($src)){
            return User::where(function($query) use ($src){
                $query->where('name', 'like', '%' . $src . '%')
                ->orWhere('email', 'like', '%' . $src . '%');
            })
            ->whereNotIn('id', [1, $user_id])
            ->with('role')
            ->orderby('id','DESC')
            ->paginate(25);
        }
        else{
            return User::whereNotIn('id', [1, $user_id])
            ->with('role')
            ->orderby('id','DESC')
            ->paginate(25);
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function roles()
    {
        return Role::whereNotIn('id', [1])->get();
    }

    public function store(Request $request)
    {
        $isValid = $this->vr->isValidUser($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        return $this->save->NewUser($request);
    }

    public function manuallyVerifyEmail(Request $request)
    {
        return $this->save->ManuallyVerifyEmail($request->id);
    }

    public function block(Request $request)
    {
        return $this->save->BlockUsers($request);
    }

    public function unblock(Request $request)
    {
        return $this->save->UnblockUser($request);
    }

    public function verifyEmail(Request $request)
    {
        dd('verifyEmail');
    }
}
