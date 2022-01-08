<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;


if (!function_exists('SetLog')) {
    function SetLog($msg)
    {
        $user = Auth::user();
        $data = [
            'user_id'       =>  $user->id,
            'role_id'       =>  $user->role_id,
            'msg'           =>  $msg,
            'created_at'    =>  now(),
        ];
        DB::table('logs')->insert($data);
    }
}

if (!function_exists('DebugMe')) {
    function DebugMe($value, $die = 0)
    {
        echo '<pre>';
        if (is_array($value)) {
            print_r($value);
        } elseif (is_object($value)) {
            print_r($value);
        } else {
            echo $value;
        }
        echo '</pre>';
        if ($die != 0) {
            die();
        }
    }
}

if (!function_exists('BasicSetting')) {
    function BasicSetting($name)
    {
        $bs = DB::table('basic_settings')->where('name', $name)->first();
        if (!empty($bs)) {
            return $bs->val;
        }
        return null;
    }
}

if (!function_exists('ConvertToLang')) {
    function ConvertToLang($object, $en = null, $bn = null)
    {
        if (empty($en) && empty($bn)) {
            if (App::isLocale('bn')) {
                if (!empty($object->name_bangla)) {
                    return $object->name_bangla;
                } else {
                    return $object->name;
                }
            } else {
                return $object->name;
            }
        } else {
            if (App::isLocale('bn')) {
                if (!empty($object->$bn)) {
                    return $object->$bn;
                } else {
                    return $object->$en;
                }
            } else {
                return $object->$en;
            }
        }
    }
}

if (!function_exists('ConvertToLangPrint')) {
    function ConvertToLangPrint($object, $lan = null, $en = null, $bn = null)
    {
        if (empty($en) && empty($bn)) {
            if ($lan == 'bn') {
                if (!empty($object->name_bangla)) {
                    return $object->name_bangla;
                } else {
                    return $object->name;
                }
            } else {
                return $object->name;
            }
        } else {
            if ($lan == 'bn') {
                if (!empty($object->$bn)) {
                    return $object->$bn;
                } else {
                    return $object->$en;
                }
            } else {
                return $object->$en;
            }
        }
    }
}



if (!function_exists('have_permission')) {
    function have_permission($id)
    {
        if (empty(session('permissions'))) {
            session()->put('permissions', json_decode(Auth::user()->role->permissions));
        }
        $permissions = (array)session('permissions');
        if (in_array($id, $permissions)) {
            return true;
        } else {
            return false;
        }
    }
}

if (!function_exists('GetBranchInfo')) {
    function GetBranchInfo($id, $field = null)
    {
        $info = DB::table('branches')->where('id', $id)->get();
        if (isset($info[0])) {
            if (empty($field)) {
                return $info[0]->name;
            } elseif ($field == '*') {
                return $info[0];
            } else {
                return $info[0]->$field;
            }
        } elseif ($id === 0) {
            return trans('msg.all') . ' ' . trans('msg.branch');
        } else {
            return '';
        }
    }
}


if (!function_exists('GetRole')) {
    function GetRole($id = null)
    {
        if (!empty($id)) {
            $info = DB::table('roles')->where('id', $id)->first();
            if (!empty($info)) {
                return ConvertToLang($info);
            }
        }
    }
}

if (!function_exists('GetCurrencySymbol')) {
    function GetCurrencySymbol($currency)
    {
        switch ($currency) {
            case "BDT":
                return "&#2547;";
                break;
            case "INR":
                return "&#8377;";
                break;
            case "PKR":
                return "&#8360;";
                break;
            case "NPR":
                return "&#8377;";
                break;
            case "USD":
                return "&#36;";
            default:
                return "&#2547;";
        }
    }
}
