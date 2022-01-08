<?php

namespace App\Http\Controllers\profile;

use Carbon\Carbon;
use App\Models\Role;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

use function Psy\debug;

class UserProfileController extends Controller
{
    public function userInfo(Request $request)
    {
        $user = Auth::user();
        $role = Role::find($user->role_id);
        
        $twoFactor['is_two_factor_available'] = false;

        if(Features::canManageTwoFactorAuthentication()){
            $twoFactor['is_two_factor_available'] = true;
            $twoFactor['two_factor_secret'] = $user->two_factor_secret;

            if (!empty($user->two_factor_secret)){

                if ($user->two_factor_secret){
                    $twoFactor['twoFactorQrCodeSvg'] = $user->twoFactorQrCodeSvg();
                }

                if (!empty($user->two_factor_recovery_codes)){
                    $recovery_codes = [];
                    foreach (json_decode(decrypt($user->two_factor_recovery_codes), true) as $code){
                        array_push($recovery_codes,$code);
                    }
                    $twoFactor['two_factor_recovery_codes'] = $recovery_codes;
                }
            }
        }
        

        $data = [
            'name'          =>  ucwords($user->name),
            'email'         =>  $user->email,
            'phone'         =>  $user->phone,
            'address'       =>  $user->address,
            'role_id'       =>  $user->role_id,
            'role'          =>  ucwords($role->name),
            'permissions'   =>  $role->permissions,
            'photo'         =>  $user->profile_photo_url,
            'sessions'      =>  $this->sessions($request)->all(),
            'two_factor'    =>  $twoFactor,
        ];
        return $data;
    }

    public function sessions(Request $request)
    {
        if (config('session.driver') !== 'database') {
            return collect();
        }

        return collect(
            DB::table('sessions')
                ->where('user_id', $request->user()->getKey())
                ->orderBy('last_activity', 'desc')
                ->get()
        )->map(function ($session) use ($request) {
            $agent = $this->createAgent($session);

            return (object) [
                'agent' => [
                    'is_desktop' => $agent->isDesktop(),
                    'platform' => $agent->platform(),
                    'browser' => $agent->browser(),
                ],
                'ip_address' => $session->ip_address,
                'is_current_device' => $session->id === $request->session()->getId(),
                'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
            ];
        });
    }

    public function MySessions(Request $request)
    {
        if (config('session.driver') !== 'database') {
            return collect();
        }

        $data = [
            'sessions'  =>  collect(
                                DB::table('sessions')
                                    ->where('user_id', $request->user()->getKey())
                                    ->orderBy('last_activity', 'desc')
                                    ->get()
                                )->map(function ($session) use ($request) {
                                $agent = $this->createAgent($session);
            
                                return (object) [
                                    'agent' => [
                                        'is_desktop' => $agent->isDesktop(),
                                        'platform' => $agent->platform(),
                                        'browser' => $agent->browser(),
                                    ],
                                    'ip_address' => $session->ip_address,
                                    'is_current_device' => $session->id === $request->session()->getId(),
                                    'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                                ];
                            })
        ];
        return $data;
    }

    protected function createAgent($session)
    {
        return tap(new Agent, function ($agent) use ($session) {
            $agent->setUserAgent($session->user_agent);
        });
    }
}
