<?php

namespace App\Http\Controllers\profile;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Laravel\Fortify\Actions\GenerateNewRecoveryCodes;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;

class TwoFactorAuthenticationController extends Controller
{
    public function store(Request $request, EnableTwoFactorAuthentication $enable)
    {
        try {
            $enable($request->user());
            return response()->json(['success'=> __('successfully created')]);
        } catch (Exception $e) {
            return response()->json(['errors' => ['there is a problem try again']]);
        }
    }

    public function destroy(Request $request, DisableTwoFactorAuthentication $disable)
    {
        try {
            $disable($request->user());
            return response()->json(['success'=> __('successfully created')]);
        } catch (Exception $e) {
            return response()->json(['errors' => ['there is a problem try again']]);
        }
    }

    public function regenerate(Request $request,GenerateNewRecoveryCodes $generate)
    {
        try {
            $generate($request->user());
            return response()->json(['success'=> __('successfully created')]);
        } catch (Exception $e) {
            return response()->json(['errors' => ['there is a problem try again']]);
        }
    }
}