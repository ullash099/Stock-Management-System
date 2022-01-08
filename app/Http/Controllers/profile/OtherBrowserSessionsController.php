<?php

namespace App\Http\Controllers\profile;

use Exception;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class OtherBrowserSessionsController extends Controller
{
    /**
     * Logout from other browser sessions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Contracts\Auth\StatefulGuard  $guard
     * @return \Inertia\Response
     */
    public function destroy(Request $request, StatefulGuard $guard)
    {
        if (!Hash::check($request->password, $request->user()->password)) {
            return response()->json(['errors' => ['This password does not match our records.']]);
        }
        try {
            $this->deleteOtherSessionRecords($request);
            return response()->json(['success'=> 'successfully created']);
        } catch (Exception $e) {
            return response()->json(['errors' => ['there is a problem try again']]);
        }
    }

    /**
     * Delete the other browser session records from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    protected function deleteOtherSessionRecords(Request $request)
    {
        if (config('session.driver') !== 'database') {
            return;
        }

        DB::table(config('session.table', 'sessions'))
            ->where('user_id', $request->user()->getKey())
            ->where('id', '!=', $request->session()->getId())
            ->delete();
        /* DB::table('oauth_access_tokens')
            ->where('user_id', $request->user()->getKey())
            ->delete(); */
    }
}
