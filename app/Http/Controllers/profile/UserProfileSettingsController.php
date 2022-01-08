<?php

namespace App\Http\Controllers\profile;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\SaveRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Repositories\ValidationRepository;

class UserProfileSettingsController extends Controller
{
    private $vr;
    private $save;
    public function __construct(ValidationRepository $validationRepository, SaveRepository $saveRepository)
    {
        $this->vr = $validationRepository;
        $this->save = $saveRepository; 
    }

    public function updateProfileInfo(Request $request)
    {
        $isValid = $this->vr->isValidProfileInfo($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }
        if ($request->hasFile('file')){
            $validator = $this->vr->isValidProfilePhoto($request);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()->all()]);
            }
        }
        if ($this->save->updateProfileInfo($request) === 'updated') {
            return response()->json(['success'=> 'successfully created']);
        } else {
            return response()->json(['errors' => ['there is a problem try again']]);
        }
    }

    public function updatePassword(Request $request)
    {
        $isValid = $this->vr->isPasswordMatches($request);
        if ($isValid->fails()) {
            return response()->json(['errors' => $isValid->errors()->all()]);
        }

        if ($this->save->updatePassword($request) === 'updated') {
            return response()->json(['success'=> 'successfully updated']);
        }
        return response()->json(['errors' => ['there is a problem try again']]);
    }

    public function CreateNewPassword(Request $request)
    {
        $this->addViewData([
            'request'   =>  $request
        ]);
        return view('auth.reset-password')->with($this->viewData);
    }
}
