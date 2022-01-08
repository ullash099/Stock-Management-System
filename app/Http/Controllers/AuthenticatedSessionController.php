<?php

namespace App\Http\Controllers;

use Laravel\Fortify\Fortify;
use Illuminate\Routing\Pipeline;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Auth\StatefulGuard;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Http\Requests\LoginRequest;
use App\Http\Middleware\RedirectIfAuthenticated;
use Laravel\Fortify\Actions\AttemptToAuthenticate;
use Laravel\Fortify\Actions\EnsureLoginIsNotThrottled;
use Laravel\Fortify\Actions\PrepareAuthenticatedSession;
use Laravel\Fortify\Http\Requests\TwoFactorLoginRequest;
use Laravel\Fortify\Http\Responses\TwoFactorLoginResponse;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Http\Responses\FailedTwoFactorLoginResponse;

class AuthenticatedSessionController extends Controller
{
    protected $guard;
    public function __construct(StatefulGuard $guard)
    {
        $this->guard = $guard;
    }

    public function create()
    {
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

    public function store(LoginRequest $request)
    {
        $info = $this->loginPipeline($request)->then(function ($request) {
            return app(LoginResponse::class);
        });
        return $info;
    }
    
    protected function loginPipeline(LoginRequest $request)
    {
        if (Fortify::$authenticateThroughCallback) {
            return (new Pipeline(app()))->send($request)->through(array_filter(
                call_user_func(Fortify::$authenticateThroughCallback, $request)
            ));
        }
        if (is_array(config('fortify.pipelines.login'))) {
            return (new Pipeline(app()))->send($request)->through(array_filter(
                config('fortify.pipelines.login')
            ));
        }
        $info = (new Pipeline(app()))->send($request)->through(array_filter([
            config('fortify.limiters.login') ? null : 
                EnsureLoginIsNotThrottled::class,
                RedirectIfTwoFactorAuthenticatable::class,
                AttemptToAuthenticate::class,
                PrepareAuthenticatedSession::class,
                RedirectIfAuthenticated::class
        ]));
        return $info;
    }

    public function TwoFactorAuthenticatedStore(TwoFactorLoginRequest $request)
    {
        $user = $request->challengedUser();

        if ($code = $request->validRecoveryCode()) {
            $user->replaceRecoveryCode($code);
        } elseif (! $request->hasValidCode()) {
            return app(FailedTwoFactorLoginResponse::class);
        }

        $this->guard->login($user, $request->remember());

        return app(TwoFactorLoginResponse::class);
    }

}