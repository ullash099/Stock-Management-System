<?php
namespace App\Repositories;

use Cart;
use Exception;
use App\Models\Bank;
use App\Models\User;
use App\Models\Media;
use App\Models\Stock;
use App\Models\Product;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\AccountHead;
use App\Models\Measurement;
use App\Models\BasicSetting;
use App\Models\OpeningStock;
use Illuminate\Http\Request;
use App\Models\InvoiceDetail;
use App\Models\InvoiceMaster;
use App\Models\VoucherDetail;
use App\Models\VoucherMaster;
use App\Models\PurchaseDetail;
use App\Models\PurchaseMaster;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;


class SaveRepository
{
    public function UpdateProfileInfo(Request $request)
    {
        $id = Auth::user()->id;
        $oldAvatar =  Auth::user()->profile_photo_path;
        $data = [
            'name'      =>  $request->name,
            'email'     =>  $request->email,
        ];
        if ($request->file('file')) {
            if (!empty($oldAvatar)) {
                Storage::disk('public')->delete($oldAvatar);
            }
            $path = $request->file('file')->storePublicly('avatars', 'public');
            $data['profile_photo_path'] = $path;
        }
        DB::beginTransaction();
        try {
            User::where('id', $id)->update($data);
            DB::commit();
            return 'updated';
        } catch (Exception $e) {
            DB::rollback();
            return $e;
        }
    }

    public function UpdatePassword(Request $request)
    {
        $id = Auth::user()->id;
        $data = [
            'password' => Hash::make($request->password),
        ];
        DB::beginTransaction(); DB::commit(); DB::rollback();
        try {
            User::where('id', $id)->update($data);
            DB::commit();
            return 'updated';
        } catch (Exception $e) {
            DB::rollback();
            return $e;
        }
    }

    public function SaveMedia($media, $id = null)
    {
        if (!empty($id)){
            Media::where('id', $id)->update($media);
            return $id;
        }
        else{
            $info = Media::create($media);
            return $info->id;
        }
    }

    public function DeleteMedia($id = null)
    {
        DB::beginTransaction();
        try {
            Media::where('id', $id)->delete();
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollback();
            return $e;
        }
    }

    #settings
    public function BasicSettings($data = [])
    {
        $created_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            foreach ($data as $key => $value) {
                if (!empty($value)) {
                    $basic_settings = BasicSetting::where('name', $key);
                    if ($basic_settings->count() > 0) {
                        //update info
                        $data = [
                            'val'           => $value  ?? ``,
                            'updated_by'    => $created_by
                        ];
                        BasicSetting::where('name', $key)->update($data);
                        SetLog('updated '. str_replace('_',' ',$key).' info. (' . $value . ')');
                    } else {
                        //insert
                        $data = [
                            'name'          => $key,
                            'val'           => $value ?? ``,
                            'created_by'    => $created_by
                        ];
                        BasicSetting::create($data);
                        SetLog('saved '. str_replace('_',' ',$key).' info. (' . $value . ')');
                    }
                }
            }
            DB::commit();
            return response()->json(['success'=> 'successfully saved']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    #Measurement
    public function BlockMeasurements(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            Measurement::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            Measurement::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block measurement unit(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockMeasurement(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = Measurement::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;
        DB::beginTransaction();
        try {
            $info->save();
            $info->restore();
            SetLog('unblock measurement. (' . $info->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function Measurement(Request $request)
    {
        $user = Auth::user()->id;

        if (!empty($request->id)) {
            // update
            $info = Measurement::find($request->id);

            if (!empty($info)) {

                $info->name         =   $request->name;
                $info->name_bangla  =   $request->name_bangla;
                $info->updated_by   =   $user;

                DB::beginTransaction();
                try {
                    $info->save();
                    SetLog('updated attribute info. ('. $request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name,
                'name_bangla'       =>  $request->name_bangla,
                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                Measurement::create($data);
                SetLog('saved Measurement info. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }
    
    #Warehouse
    public function Warehouse(Request $request)
    {
        $user = Auth::user()->id;
        if (!empty($request->id)) {
            // update
            $info = Warehouse::find($request->id);

            if (!empty($info)) {

                $info->name         =   $request->name;
                $info->name_bangla  =   $request->name_bangla;
                $info->address      =   $request->address;
                $info->updated_by   =   $user;

                DB::beginTransaction();
                try {
                    $info->save();
                    SetLog('updated warehouse info. ('. $request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name,
                'name_bangla'       =>  $request->name_bangla,
                'address'           =>  $request->address,
                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                Warehouse::create($data);
                SetLog('saved warehouse info. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function BlockWarehouse(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            Warehouse::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            Warehouse::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block warehouse(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockWarehouse(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = Warehouse::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;

        DB::beginTransaction();        
        try {
            $info->save();
            $info->restore();
            SetLog('unblock warehouse. (' . $info->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    #income Head
    public function IncomeHead(Request $request)
    {
        $user = Auth::user()->id;
        if (!empty($request->id)) {
            // update
            $info = AccountHead::find($request->id);

            if (!empty($info)) {

                $info->name         =   $request->name;
                $info->name_bangla  =   $request->name_bangla;
                $info->search       =   $request->search;
                $info->calculation  =   $request->calculation;
                $info->updated_by   =   $user;

                DB::beginTransaction();
                try {
                    $info->save();
                    SetLog('updated income head info. ('. $request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name,
                'name_bangla'       =>  $request->name_bangla,
                'head_type'         =>  'income',
                'search'            =>  $request->search,
                'calculation'       =>  $request->calculation,
                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                AccountHead::create($data);
                SetLog('saved income head info. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function BlockIncomeHead(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            AccountHead::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            AccountHead::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block income account head(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockIncomeHead(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = AccountHead::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;
        DB::beginTransaction();
        try {
            $info->save();
            $info->restore();
            SetLog('unblock income account head. (' . $info->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    #expenses Head
    public function ExpenseHead(Request $request)
    {
        $user = Auth::user()->id;
        if (!empty($request->id)) {
            // update
            $info = AccountHead::find($request->id);

            if (!empty($info)) {

                $info->name         =   $request->name;
                $info->name_bangla  =   $request->name_bangla;
                $info->search       =   $request->search;
                $info->calculation  =   $request->calculation;
                $info->updated_by   =   $user;

                DB::beginTransaction();
                try {
                    $info->save();
                    SetLog('updated expenses head info. ('. $request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name,
                'name_bangla'       =>  $request->name_bangla,
                'head_type'         =>  'expenses',
                'search'            =>  $request->search,
                'calculation'       =>  $request->calculation,
                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                AccountHead::create($data);
                SetLog('saved expenses head info. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function BlockExpenseHead(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            AccountHead::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            AccountHead::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block expense account head(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockExpenseHead(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = AccountHead::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;
        DB::beginTransaction();
        try {
            $info->save();
            $info->restore();
            SetLog('unblock expense account head. (' . $info->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    #user 
    public function ManuallyVerifyEmail($id)
    {
        $updated_by = Auth::user()->id;
        if (!empty($id)) {
            $info = User::find($id);
            if (!empty($info)) {
                $info->email_verified_at = now();
                $info->updated_by = $updated_by;
                DB::beginTransaction();
                try {
                    $info->save();
                    SetLog('Manually verified user email . (' . $info->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully verified']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        }
    }

    public function BlockUsers(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            User::whereIn('id',explode(',',$request->items))
            ->update([
                'block'         => true,
                'deleted_by'    => $deleted_by
            ]);
            DB::table('sessions')->whereIn('user_id', explode(',',$request->items))->delete();
            SetLog('block User(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockUser(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = User::find($request->id);

        $info->block        = false;
        $info->updated_by   = $updated_by;
        DB::beginTransaction();
        try {
            $info->save();
            SetLog('unblock User. (' . $info->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function NewUser(Request $request)
    {
        $created_by = Auth::user()->id;
        $data = [
            'name'          => $request->name,
            'email'         => $request->email,
            'role_id'       => $request->role,
            'password'      => Hash::make($request->password),
            'created_by'    => $created_by
        ];

        DB::beginTransaction();
        try {
            $user = User::create($data);
            $user->sendEmailVerificationNotification();
            SetLog('New user Created (' . $request->email . ')');
            DB::commit();
            return response()->json(['success'=> 'user successfully created']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    #expenses Head
    public function Bank(Request $request)
    {
        $user = Auth::user()->id;
        if (!empty($request->id)) {
            // update
            $info = Bank::find($request->id);

            if (!empty($info)) {

                $info->bank_type        =   $request->bank_type;
                $info->name             =   $request->name;
                $info->account_holder   =   $request->account_holder;
                $info->account_no       =   $request->account_no;
                $info->bank_address     =   $request->bank_address;
                $info->updated_by       =   $user;

                DB::beginTransaction();
                try {
                    $info->save();
                    SetLog('updated bank info. ('. $request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'bank_type'         =>  $request->bank_type,
                'name'              =>  $request->name,
                'account_holder'    =>  $request->account_holder,
                'opening_balance'   =>  $request->opening_balance,
                'outstanding'       =>  $request->opening_balance,
                'account_no'        =>  $request->account_no,
                'bank_address'      =>  $request->bank_address,
                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                Bank::create($data);
                SetLog('saved bank info. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function BlockBanks(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            Bank::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            Bank::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block bank(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockBank(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = Bank::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;
        DB::beginTransaction();
        try {
            $info->save();
            $info->restore();
            SetLog('unblock bank. (' . $info->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function UpdateBankOutstanding($bank, $amount)
    {
        $info = Bank::where('id', $bank)->firstOrFail();
        if (!empty($info)) {
            #update
            $info->outstanding += $amount;
            try {
                $info->save();
            } catch (Exception $e) {
                return $e;
            }
        }
    }
    
    #Supplier
    public function Supplier(Request $request)
    {
        $user = Auth::user()->id;
        if (!empty($request->id)) {
            // update
            $info = Supplier::find($request->id);

            if (!empty($info)) {

                $info->name             =   $request->name;
                $info->name_bangla      =   $request->name_bangla;
                $info->phone            =   $request->phone;
                $info->phone_alt        =   $request->phone_alt;
                $info->email            =   $request->email;
                $info->supplier_address =   $request->supplier_address;
                $info->updated_by       =   $user;

                DB::beginTransaction();
                try {
                    $info->save();
                    SetLog('updated supplier info. ('. $request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name,
                'name_bangla'       =>  $request->name_bangla,
                'phone'             =>  $request->phone,
                'phone_alt'         =>  $request->phone_alt,
                'email'             =>  $request->email,
                'opening_balance'   =>  $request->opening_balance,
                'outstanding'       =>  $request->opening_balance,
                'supplier_address'  =>  $request->supplier_address,
                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                Supplier::create($data);
                SetLog('saved supplier info. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function BlockSuppliers(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            Supplier::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            Supplier::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block supplier(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockSupplier(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = Supplier::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;
        DB::beginTransaction();
        try {
            $info->save();
            $info->restore();
            SetLog('unblock supplier. (' . $info->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function UpdateSupplierOutstanding($supplier, $amount)
    {
        $info = Supplier::where('id', $supplier)->firstOrFail();
        if (!empty($info)) {
            #update
            $info->outstanding += $amount;
            try {
                $info->save();
            } catch (Exception $e) {
                return $e;
            }
        }
    }
    
    #Customer
    public function Customer(Request $request)
    {
        $user = Auth::user()->id;
        if (!empty($request->id)) {
            // update
            $info = Customer::find($request->id);

            if (!empty($info)) {

                $info->name             =   $request->name;
                $info->name_bangla      =   $request->name_bangla;
                $info->phone            =   $request->phone;
                $info->phone_alt        =   $request->phone_alt;
                $info->email            =   $request->email;
                $info->customer_address =   $request->customer_address;
                $info->discount         =   $request->discount;
                $info->updated_by       =   $user;

                DB::beginTransaction();
                try {
                    $info->save();
                    SetLog('updated customer info. ('. $request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name,
                'name_bangla'       =>  $request->name_bangla,
                'phone'             =>  $request->phone,
                'phone_alt'         =>  $request->phone_alt,
                'email'             =>  $request->email,
                'customer_address'  =>  $request->customer_address,
                'opening_balance'   =>  $request->opening_balance,
                'outstanding'       =>  $request->opening_balance,
                'discount'          =>  $request->discount,
                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                Customer::create($data);
                SetLog('saved customer info. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function BlockCustomers(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            Customer::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            Customer::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block customer(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockCustomer(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = Customer::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;
        DB::beginTransaction();
        try {
            $info->save();
            $info->restore();
            SetLog('unblock customer. (' . $info->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function UpdateCustomerOutstanding($customer, $amount)
    {
        $info = Customer::where('id', $customer)->firstOrFail();
        if (!empty($info)) {
            #update
            $info->outstanding += $amount;
            try {
                $info->save();
            } catch (Exception $e) {
                return $e;
            }
        }
    }
    
    #Category
    public function Category(Request $request)
    {
        $user = Auth::user()->id;

        $thumbnail = [];
        if ($request->hasFile('file')) {
            $upload = $request->file('file');
            $path = $upload->getRealPath();
            $file = file_get_contents($path);
            $base64 = base64_encode($file);
            $thumbnail = [
                'name'          =>  $upload->getClientOriginalName(),
                'mime'          =>  $upload->getClientMimeType(),
                'size'          =>  number_format(($upload->getSize() / 1024), 1),
                'attachment'    =>  'data:'.$upload->getClientMimeType().';base64,'.$base64#$base64#
            ];
        }

        if (!empty($request->id)) {
            // update
            $info = Category::find($request->id);

            if (!empty($info)) {
                $media_id           = $info->thumbnail_id;

                $info->name         =   $request->name;
                $info->name_bangla  =   $request->name_bangla;
                $info->parent_id    =   $request->parent_id;
                $info->description  =   $request->description;

                $info->updated_by   =   $user;

                DB::beginTransaction();
                try {
                    if (!empty($thumbnail)){
                        if(!empty($media_id)){
                            $thumbnail['updated_by'] = $user;
                            $thumbnail['updated_at'] = now();
                            $this->SaveMedia($thumbnail,$media_id);
                        }
                        else{
                            $thumbnail['created_by'] = $user;
                            $thumbnail_id = $this->SaveMedia($thumbnail);
                            $info->thumbnail_id = $thumbnail_id;
                        }
                    }
                    if ($request->remove_pic) {
                        $info->thumbnail_id = null;
                    }
                    $info->save();

                    if ($request->remove_pic) {
                        if(!empty($media_id)){
                            $this->DeleteMedia($media_id);
                        }
                    }

                    SetLog('updated category information. ('.$request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name,
                'name_bangla'       =>  $request->name_bangla,
                'parent_id'         =>  $request->parent_id,
                'description'       =>  $request->description,
                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                if (!empty($thumbnail)) {
                    $thumbnail['created_by'] = $user;
                    $thumbnail_id = $this->SaveMedia($thumbnail);
                    $data['thumbnail_id'] = $thumbnail_id;
                }
                
                $category = Category::create($data);
                SetLog('saved a category information. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved','id'=>$category->id]);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function BlockCategories(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            Category::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            Category::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block product category(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockCategory(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = Category::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;
        try {
            $info->save();
            $info->restore();
            SetLog('unblock product category. (' . $info->name . ')');
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    #Product
    public function Product(Request $request)
    {
        $user = Auth::user()->id;

        if (!empty($request->id)) {
            // update
            $info = Product::find($request->id);

            if (!empty($info)) {
                $info->name             =   $request->name;
                $info->name_bangla      =   $request->name_bangla;

                $info->category_id      =   $request->category;
                $info->measurement_id   =   $request->measurement;

                $info->purchase_price   =   $request->purchase_price;
                $info->sales_price      =   $request->sales_price;
                $info->vat              =   $request->vat;
                $info->reorder_qty      =   $request->reorder_qty;

                $info->updated_by       =   $user;

                DB::beginTransaction();
                try {
                    $info->save();

                    SetLog('updated product information. ('.$request->name . ')');
                    DB::commit();
                    return response()->json(['success'=> 'successfully saved']);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['errors' => [$e->getMessage()]]);
                }
            }
        } else {
            $data = [
                '_token'            =>  $request->token,
                'name'              =>  $request->name,
                'name_bangla'       =>  $request->name_bangla,

                'category_id'       =>  $request->category,
                'measurement_id'    =>  $request->measurement,

                'purchase_price'    =>  $request->purchase_price,
                'sales_price'       =>  $request->sales_price,
                'vat'               =>  $request->vat,
                'reorder_qty'       =>  $request->reorder_qty,

                'created_by'        =>  $user
            ];

            DB::beginTransaction();
            try {
                Product::create($data);
                SetLog('saved product information. (' . $request->name . ')');
                DB::commit();
                return response()->json(['success'=> 'successfully saved']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
    }

    public function BlockProducts(Request $request)
    {
        $deleted_by = Auth::user()->id;
        DB::beginTransaction();
        try {
            Product::whereIn('id',explode(',',$request->items))
            ->update(['deleted_by' => $deleted_by]);
            Product::whereIn('id',explode(',',$request->items))->delete();
            SetLog('block product(s).');
            DB::commit();
            return response()->json(['success'=> 'successfully blocked']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    public function UnblockProduct(Request $request)
    {
        $updated_by = Auth::user()->id;
        $info = Product::withTrashed()->find($request->id);

        $info->updated_by   = $updated_by;
        $info->deleted_by   = null;
        $info->deleted_at   = null;
        try {
            $info->save();
            $info->restore();
            SetLog('unblock product. (' . $info->name . ')');
            return response()->json(['success'=> 'successfully unblocked']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function UpdateProductPriceBulk($products)
    {
        foreach ($products as $product) {
            $productinfo = Product::where('id', $product['id'])->first();
            if (!empty($productinfo)) {
                #update
                $productinfo->purchase_price = $product['purchase_price'];
                $productinfo->vat = $product['vat'];
                $productinfo->sales_price = $product['sales_price'];
                $productinfo->updated_by = $product['updated_by'];
                try {
                    $productinfo->save();
                } catch (Exception $e) {
                    return $e;
                }
            }
        }
    }

    #opening stock
    public function OpeningStock(Request $request)
    {
        $user = Auth::user()->id;

        $data = [
            '_token'        =>  $request->token,
            'warehouse_id'  =>  $request->warehouse,
            'category_id'   =>  $request->category,
            'product_id'    =>  $request->product,
            'qty'           =>  $request->qty,
            'created_by'    =>  $user
        ];
        $stockData = [
            '_token'        =>  $request->token,
            'warehouse_id'  =>  $request->warehouse,
            #'category_id'   =>  $request->category,
            'product_id'    =>  $request->product,
            'qty'           =>  $request->qty,
            'created_by'    =>  $user
        ];

        DB::beginTransaction();
        try {
            OpeningStock::create($data);
            Stock::create($stockData);
            SetLog('saved opening stock information. (' . $request->name . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully saved']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    #stock in
    public function StockInBulk($stockData)
    {
        foreach ($stockData as $stock) {
            $info = Stock::where([
                ['warehouse_id', '=', $stock['warehouse_id']],
                ['product_id', '=', $stock['product_id']]
            ])->first();

            if (!empty($info)) {
                #update
                $info->qty += $stock['qty'];
                $info->updated_by = $stock['updated_by'];
                try {
                    $info->save();
                } catch (Exception $e) {
                    return $e;
                }
            } else {
                $data = [
                    'warehouse_id'      =>  $stock['warehouse_id'],
                    'product_id'        =>  $stock['product_id'],
                    'qty'               =>  $stock['qty'],
                    'created_by'        =>  $stock['updated_by']
                ];
                try {
                    Stock::create($data);
                } catch (Exception $e) {
                    return $e;
                }
            }
        }
    }
    
    public function StockOutBulk($stockData)
    {
        foreach ($stockData as $stock) {
            $info = Stock::where([
                ['warehouse_id', '=', $stock['warehouse_id']],
                ['product_id', '=', $stock['product_id']]
            ])->first();

            if (!empty($info)) {
                #update
                $info->qty -= $stock['qty'];
                $info->updated_by = $stock['updated_by'];
                try {
                    $info->save();
                } catch (Exception $e) {
                    return $e;
                }
            }
        }
    }

    #Purchase
    public function Purchase(Request $request)
    {
        $created_by =  Auth::user()->id;
        $masterData = [
            '_token'            =>      $request->token,
            'voucher'           =>      $request->voucher,
            'purchase_date'     =>      date('Y-m-d', strtotime($request->purchase_date)),
            'supplier_id'       =>      $request->supplier,
            'ref'               =>      $request->ref,
            'total'             =>      $request->total,
            'created_by'        =>      $created_by
        ];

        DB::beginTransaction();
        try {
            $purchase = PurchaseMaster::create($masterData);
            $detailsData = [];
            $stockInData = [];
            $productPriceUpdateData = [];
            $num_elements = 0;
            while ($num_elements < count($request->product)) {
                $detailsData[] = [
                    'purchase_master_id'    =>  $purchase->id,
                    'product_id'            =>  $request->product[$num_elements],
                    'warehouse_id'          =>  $request->warehouse[$num_elements],
                    'qty'                   =>  $request->qty[$num_elements],
                    'price'                 =>  $request->purchase_price[$num_elements],
                    'subtotal'              =>  $request->subtotal[$num_elements]
                ];

                $stockInData[] = [
                    'warehouse_id'          =>  $request->warehouse[$num_elements],
                    'product_id'            =>  $request->product[$num_elements],
                    'qty'                   =>  $request->qty[$num_elements],
                    'updated_by'            =>  $created_by
                ];
                $productPriceUpdateData[] = [
                    'id'                =>  $request->product[$num_elements],
                    'purchase_price'    =>  $request->purchase_price[$num_elements],
                    'vat'               =>  $request->vat[$num_elements],
                    'sales_price'       =>  $request->sales_price[$num_elements],
                    'updated_by'        =>  $created_by
                ];
                $num_elements++;
            }

            PurchaseDetail::insert($detailsData);
            #stock in
            $this->StockInBulk($stockInData);
            #update product price
            $this->UpdateProductPriceBulk($productPriceUpdateData);
            #update supplier outstanding balance
            $this->UpdateSupplierOutstanding($request->supplier, $request->total);

            
            SetLog('product purchase posting is done.');
            DB::commit();
            return response()->json(['success'=> 'successfully saved']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function BlockPurchaseVoucher(Request $request)
    {
        $deleted_by = Auth::user()->id;
        $info = PurchaseMaster::with('details')->find($request->id);

        if (!empty($info->supplier_id)) {
            $supplier = $info->supplier_id;
            $amount = -$info->total;
            $stockData = [];

            foreach ($info->details as $detail) {
                $stockData[] = [
                    'warehouse_id'  =>  $detail->warehouse_id,
                    'product_id'    =>  $detail->product_id,
                    'qty'           =>  ($detail->qty - $detail->rtn_qty),
                    'updated_by'    =>  $deleted_by
                ];
            }
            $info->deleted_by       = $deleted_by;
            DB::beginTransaction();
            try {
                $info->save();
                $info->delete();
                $this->UpdateSupplierOutstanding($supplier, $amount);
                $this->StockOutBulk($stockData);

                SetLog('purchase voucher deleted.');
                DB::commit();
                return response()->json(['success'=> 'successfully deleted']);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['errors' => [$e->getMessage()]]);
            }
        }
        else{
            return response()->json(['errors' => ['no record found']]);
        }
    }

    public function PurchaseReturn(Request $request)
    {
        $updated_by =  Auth::user()->id;

        DB::beginTransaction();
        try {
            $purchaseMaster = PurchaseMaster::where('voucher',$request->voucher)->first();
            $supplier = $purchaseMaster->supplier_id;
            $stockData = [];
            $totalReturn = 0;

            $num_elements = 0;
            while ($num_elements < count($request->id)) {
                $detail = PurchaseDetail::find($request->id[$num_elements]);

                $stockData[] = [
                    'warehouse_id'  =>  $detail->warehouse_id,
                    'product_id'    =>  $detail->product_id,
                    'qty'           =>  $request->rtn_qty[$num_elements],
                    'updated_by'    =>  $updated_by
                ];

                $totalReturn += $request->rtn_qty[$num_elements]*$detail->price;

                $detail->rtn_qty += $request->rtn_qty[$num_elements];
                $detail->subtotal -= $request->rtn_qty[$num_elements]*$detail->price;
                $detail->save();
                
                $num_elements++;
            }
            $purchaseMaster->total -= $totalReturn;
            $purchaseMaster->save();
            $this->StockOutBulk($stockData);
            $this->UpdateSupplierOutstanding($supplier, -$totalReturn);

            SetLog('purchase voucher return.');
            DB::commit();
            return response()->json(['success'=> 'successfully return']);

        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    #Sales
    public function Sales(Request $request)
    {
        $user =  Auth::user();
        $created_by = $user->id;
        $invoice_date   =   date('Y-m-d');
        $invoice = time();

        $invoice_master = [
            'invoice'       =>  $invoice,
            'invoice_date'  =>  $invoice_date,
            
            'customer_id'   =>  $request->customer,            
            'sub_total'     =>  $request->sub_total,
            'vat'           =>  $request->vat,
            'total'         =>  $request->total,
            'advance'       =>  $request->advance,
            'discount'      =>  $request->discount ?? 0,
            'net_payable'   =>  $request->net_payable,

            'cash'          =>  $request->cash,
            'bank_amount'   =>  $request->bank_amount,
            'bank_id'       =>  $request->bank ?? null,
            'bank_ref'      =>  $request->bank_ref,

            'receive'       =>  $request->receive,
            'return_due'    =>  $request->return_due,
            'created_by'    =>  $created_by
        ];

        $transactions_type = 'both';
        if ($request->cash > 0 && $request->bank_amount == 0) {
            $transactions_type = 'cash';
        } elseif ($request->cash == 0 && $request->bank_amount > 0) {
            $transactions_type = 'bank';
        }

        $voucher_master = [
            'voucher'               =>  $invoice,
            'voucher_date'          =>  $invoice_date,
            'customer_id'           =>  $request->customer,
            'voucher_type'          =>  's',
            'account_head_id'       =>  1,
            'transactions_type'     =>  $transactions_type,
            'deposit_in_bank_id'    =>  $request->bank ?? null,
            'total'                 =>  $request->net_payable,
            'cash_amount'           =>  $request->cash ?? 0,
            'bank_amount'           =>  $request->bank_amount ?? 0,
            'created_by'            =>  $created_by
        ];

        DB::beginTransaction();
        try {
            $invoice = InvoiceMaster::create($invoice_master);
            $invoice_detail = [];            
            $stockOutData = [];

            foreach (Cart::getContent() as $cart) {
                $invoice_detail[] = [
                    'invoice_master_id' =>  $invoice->id,
                    'invoice_date'      =>  $invoice_date,

                    'warehouse_id'  =>  $cart->attributes->warehouse_id,                    
                    'product_id'        =>  $cart->attributes->product_id,
                    'regular_price'     =>  $cart->attributes->regular_price,
                    'price'             =>  $cart->price,
                    'quantity'          =>  $cart->quantity,
                    'rtn_quantity'      =>  0,
                    'note'              =>  $cart->attributes->note,
                    'vat'               =>  $cart->attributes->vat,
                    'vat_amount'        =>  $cart->attributes->vat_amount,
                ];

                $stockOutData[] = [
                    'warehouse_id'  =>  $cart->attributes->warehouse_id,
                    'product_id'    =>  $cart->attributes->product_id,
                    'qty'           =>  $cart->quantity,
                    'updated_by'    =>  $created_by
                ];
            }

            $voucher = VoucherMaster::create($voucher_master);
            $voucher_details = [
                'voucher_master_id' =>  $voucher->id,
                'description'       =>  'product sale',
                'amount'            =>  $request->net_payable
            ];
            VoucherDetail::insert($voucher_details);
            $this->stockOutBulk($stockOutData);
            
            if (!empty($request->customer)) {
                if ($request->advance > 0) {
                    $this->UpdateCustomerOutstanding($request->customer, abs($request->advance));
                }
                if ($request->return_due < 0) {
                    $this->UpdateCustomerOutstanding($request->customer, abs($request->return_due));
                }
            }
            
            InvoiceDetail::insert($invoice_detail);
            DB::commit();
            Cart::clear();
            Cart::removeCartCondition('VAT');
            return [
                'success'       => 'successfully saved',
                'invoice'       =>  $invoice,
                'cart'          =>  [
                    'cart'          =>  Cart::getContent(),
                    'sub_total'     =>  Cart::getSubTotal(),
                    'total_vat'     =>  Cart::getCondition('VAT')->parsedRawValue ?? 0,
                    'total'         =>  Cart::getTotal()
                ]
            ];
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function DeleteInvoice(Request $request)
    {
        $deleted_by = Auth::user()->id;
        $info = InvoiceMaster::with('details')->find($request->id);

        $invoice        =   $info->invoice;
        $customer       =   $info->customer_id;
        $advance        =   $info->advance;
        $return_due     =   $info->return_due;

        $stockInData = [];
        foreach ($info->details as $detail) {
            $stockInData[] = [
                'warehouse_id'  =>  $detail->warehouse_id,
                'product_id'    =>  $detail->product_id,
                'qty'           => ($detail->quantity - $detail->rtn_quantity),
                'updated_by'    =>  $deleted_by
            ];
        }
        $info->deleted_by   =   $deleted_by;
        DB::beginTransaction();
        try {
            # delete invoice master
            $info->save();
            $info->delete();

            if (!empty($customer)) {
                if ($advance > 0) {
                    $this->UpdateCustomerOutstanding($customer, abs($advance));
                }
                if ($return_due < 0) {
                    $this->UpdateCustomerOutstanding($customer, abs($return_due));
                }
            }

            $this->StockInBulk($stockInData);
            VoucherMaster::where('voucher', $invoice)->update([
                'deleted_by'    =>  $deleted_by,
                'deleted_at'    =>  now()
            ]);
            SetLog('Delete a invoice. (' . $invoice . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully deleted']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function Return(Request $request)
    {
        DB::beginTransaction();
        try {

            $created_by =  Auth::user()->id;
            $voucher = time();

            $invoiceMasterInfo = InvoiceMaster::find($request->invoice);
            $invoice = $invoiceMasterInfo->invoice;
            $invoiceMasterInfo->exchange_amount -= $request->total;
            $invoiceMasterInfo->updated_by = $created_by;

            $num_elements = 0;
            while ($num_elements < count($request->return_id)) {
                if($request->return_qty[$num_elements] > 0){

                    $details = InvoiceDetail::find($request->return_id[$num_elements]);
                    $details->rtn_quantity += $request->return_qty[$num_elements];
                    $details->save();

                    $stock = Stock::where([
                        ['warehouse_id','=',$request->warehouse_id[$num_elements]],
                        ['product_id','=',$request->product_id[$num_elements]]
                    ])->first();
                    $stock->qty -= $request->return_qty[$num_elements];
                    $stock->save();
                }
                $num_elements++;
            }
            $invoiceMasterInfo->save();

            /* expense voucher */
            $masterData = [
                'voucher'               =>  $voucher,
                'voucher_date'          =>  date('Y-m-d'),
                'voucher_type'          =>  'cr',
                'account_head_id'       =>  $request->account_head,
                'transactions_type'     =>  $request->transactions_type,
                'withdraw_from_bank_id' =>  $request->withdraw_from_bank != 0 ? $request->withdraw_from_bank : null,
                'total'                 =>  $request->total,
                'cash_amount'           =>  $request->cash ?? 0,
                'bank_amount'           =>  $request->bank ?? 0,
                'created_by'            =>  $created_by
            ];           

            if ($request->search == 'customer') {
                $masterData['customer_id'] = $request->expense_to;
            } elseif ($request->search == 'supplier') {
                $masterData['supplier_id'] = $request->expense_to;
            } elseif ($request->search == 'bank') {
                $masterData['bank_id'] = $request->expense_to;
            }

            $voucherInfo = VoucherMaster::create($masterData);
            
            $detailsData = [
                'voucher_master_id'    =>  $voucherInfo->id,
                'description'          =>  $request->description,
                'amount'               =>  $request->total
            ];

            VoucherDetail::insert($detailsData);

            if ($request->search == 'customer') {
                if ($request->calculation == 'i') {
                    # increment
                    $this->UpdateCustomerOutstanding($request->expense_to, abs($request->cash+$request->bank));
                } elseif ($request->calculation == 'd') {
                    # decrease
                    $this->UpdateCustomerOutstanding($request->expense_to, -abs($request->cash+$request->bank));
                }
                if (!empty($request->withdraw_from_bank)) {
                    $this->UpdateBankOutstanding($request->withdraw_from_bank, -abs($request->cash+$request->bank));
                }
            } elseif ($request->search == 'supplier') {
                if ($request->calculation == 'i') {
                    # increment
                    $this->UpdateSupplierOutstanding($request->expense_to, abs($request->cash+$request->bank));
                } elseif ($request->calculation == 'd') {
                    # decrease
                    $this->UpdateSupplierOutstanding($request->expense_to, -abs($request->cash+$request->bank));
                }
                if (!empty($request->withdraw_from_bank)) {
                    $this->UpdateBankOutstanding($request->withdraw_from_bank, -abs($request->cash+$request->bank));
                }
            } elseif ($request->search == 'bank') {
                if ($request->calculation == 'i') {
                    if ($request->expense_to == $request->withdraw_from_bank) {
                        //single bank increment
                        $this->UpdateBankOutstanding($request->expense_to, abs($request->cash+$request->bank));
                    } else {
                        //double bank increment
                        $this->UpdateBankOutstanding($request->expense_to, abs($request->cash+$request->bank));
                    }
                } elseif ($request->calculation == 'd') {
                    if ($request->expense_to == $request->withdraw_from_bank) {
                        //single bank increment
                        $this->UpdateBankOutstanding($request->expense_to, -abs($request->cash+$request->bank));
                    } else {
                        //double bank increment
                        $this->UpdateBankOutstanding($request->expense_to, -abs($request->cash+$request->bank));
                    }
                }
            }
            else{
                if (!empty($request->withdraw_from_bank)) {
                    $this->UpdateBankOutstanding($request->withdraw_from_bank, -abs($request->cash+$request->bank));
                }
            }

            SetLog('sales return done. (' . $invoice . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully returned']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function Delivery(Request $request)
    {
        //DB::beginTransaction();
        try {
            $num_elements = 0;
            while ($num_elements < count($request->id)) {
                if($request->delivery_qty[$num_elements] > 0){
                    $details = InvoiceDetail::where('id',$request->id[$num_elements])->first();
                    $quantity = $details->delivery_quantity+$request->delivery_qty[$num_elements];

                    InvoiceDetail::where('id',$request->id[$num_elements])
                    ->update([
                        'delivery_quantity' => $quantity
                    ]);

                }
                $num_elements++;
            }
            SetLog('Items Delivered. (' . $request->invoice . ')');
            //DB::commit();
            return true;
        } catch (Exception $e) {
            //DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    public function chckDoneDelivery($invoice)
    {
        try {
            $masterInfo = InvoiceMaster::where('invoice',$invoice)->first();

            $invoiceDetails = InvoiceDetail::where('invoice_master_id','=',$masterInfo->id)
            ->get();
            /* [
                [],
                //['rtn_quantity+delivery_quantity','<','quantity'],
            ]) */

            $is_delivered = true;
            
            foreach ($invoiceDetails as $detail) {
                $totalDelivery = $detail->rtn_quantity+$detail->delivery_quantity;
                if($detail->quantity > $totalDelivery){
                    $is_delivered = false;
                }
            }
            $masterInfo->is_delivered = $is_delivered;
            $masterInfo->save();

            return response()->json(['success'=> 'successfully saved']);
        } catch (Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }

    #Income Voucher
    public function IncomeVoucher(Request $request)
    {
        $created_by =  Auth::user()->id;
        $voucher = time();
        $masterData = [
            'voucher'               =>  $voucher,
            'voucher_date'          =>  date('Y-m-d'),
            'voucher_type'          =>  'dr',
            'account_head_id'       =>  $request->account_head,
            'transactions_type'     =>  $request->transactions_type,
            'deposit_in_bank_id'    =>  $request->deposit_in_bank != 0? $request->deposit_in_bank : null,
            'total'                 =>  $request->total,
            'cash_amount'           =>  $request->cash ?? 0,
            'bank_amount'           =>  $request->bank ?? 0,
            'created_by'            =>  $created_by
        ];
        if ($request->search == 'customer') {
            $masterData['customer_id'] = $request->income_from;
        } elseif ($request->search == 'supplier') {
            $masterData['supplier_id'] = $request->income_from;
        } elseif ($request->search == 'bank') {
            $masterData['bank_id'] = $request->income_from;
        }

        DB::beginTransaction();
        try {
            $voucherInfo = VoucherMaster::create($masterData);
            $detailsData = [];
            $num_elements = 0;
            while ($num_elements < count($request->description)) {
                $detailsData[] = [
                    'voucher_master_id'    =>  $voucherInfo->id,
                    'description'          =>  $request->description[$num_elements],
                    'amount'               =>  $request->amount[$num_elements]
                ];
                $num_elements++;
            }
            VoucherDetail::insert($detailsData);

            if ($request->search == 'customer') {
                if ($request->calculation == 'i') {
                    # increment
                    $this->UpdateCustomerOutstanding($request->income_from, abs($request->cash+$request->bank));
                } elseif ($request->calculation == 'd') {
                    # decrease
                    $this->UpdateCustomerOutstanding($request->income_from, -abs($request->cash+$request->bank));
                }
                if (!empty($request->deposit_in_bank)) {
                    $this->UpdateBankOutstanding($request->deposit_in_bank, abs($request->cash+$request->bank));
                }
            } elseif ($request->search == 'supplier') {
                if ($request->calculation == 'i') {
                    # increment
                    $this->UpdateSupplierOutstanding($request->income_from, abs($request->cash+$request->bank));
                } elseif ($request->calculation == 'd') {
                    # decrease
                    $this->UpdateSupplierOutstanding($request->income_from, -abs($request->cash+$request->bank));
                }
                if (!empty($request->deposit_in_bank)) {
                    $this->UpdateBankOutstanding($request->deposit_in_bank, abs($request->cash+$request->bank));
                }
            } elseif ($request->search == 'bank') {
                if ($request->calculation == 'i') {
                    if ($request->income_from == $request->deposit_in_bank) {
                        //single bank increment
                        $this->UpdateBankOutstanding($request->income_from, abs($request->cash+$request->bank));
                    } else {
                        //double bank increment
                        $this->UpdateBankOutstanding($request->income_from, abs($request->cash+$request->bank));
                    }
                } elseif ($request->calculation == 'd') {
                    if ($request->income_from == $request->deposit_in_bank) {
                        //single bank increment
                        $this->UpdateBankOutstanding($request->income_from, -abs($request->cash+$request->bank));
                    } else {
                        //double bank increment
                        $this->UpdateBankOutstanding($request->income_from, -abs($request->cash+$request->bank));
                    }
                }
            }
            else{
                if (!empty($request->deposit_in_bank)) {
                    $this->UpdateBankOutstanding($request->deposit_in_bank, abs($request->cash+$request->bank));
                }
            }
            SetLog('Income Voucher created. (' . $voucher . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully saved','voucher'=>$voucher]);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
    
    #Income Voucher
    public function ExpenseVoucher(Request $request)
    {
        $created_by =  Auth::user()->id;
        $voucher = time();
        $masterData = [
            'voucher'               =>  $voucher,
            'voucher_date'          =>  date('Y-m-d'),
            'voucher_type'          =>  'cr',
            'account_head_id'       =>  $request->account_head,
            'transactions_type'     =>  $request->transactions_type,
            'withdraw_from_bank_id' =>  $request->withdraw_from_bank != 0 ? $request->withdraw_from_bank : null,
            'total'                 =>  $request->total,
            'cash_amount'           =>  $request->cash ?? 0,
            'bank_amount'           =>  $request->bank ?? 0,
            'created_by'            =>  $created_by
        ];
        if ($request->search == 'customer') {
            $masterData['customer_id'] = $request->expense_to;
        } elseif ($request->search == 'supplier') {
            $masterData['supplier_id'] = $request->expense_to;
        } elseif ($request->search == 'bank') {
            $masterData['bank_id'] = $request->expense_to;
        }

        DB::beginTransaction();
        try {
            $voucherInfo = VoucherMaster::create($masterData);
            $detailsData = [];
            $num_elements = 0;
            while ($num_elements < count($request->description)) {
                $detailsData[] = [
                    'voucher_master_id'    =>  $voucherInfo->id,
                    'description'          =>  $request->description[$num_elements],
                    'amount'               =>  $request->amount[$num_elements]
                ];
                $num_elements++;
            }
            VoucherDetail::insert($detailsData);

            if ($request->search == 'customer') {
                if ($request->calculation == 'i') {
                    # increment
                    $this->UpdateCustomerOutstanding($request->expense_to, abs($request->cash+$request->bank));
                } elseif ($request->calculation == 'd') {
                    # decrease
                    $this->UpdateCustomerOutstanding($request->expense_to, -abs($request->cash+$request->bank));
                }
                if (!empty($request->withdraw_from_bank)) {
                    $this->UpdateBankOutstanding($request->withdraw_from_bank, -abs($request->cash+$request->bank));
                }
            } elseif ($request->search == 'supplier') {
                if ($request->calculation == 'i') {
                    # increment
                    $this->UpdateSupplierOutstanding($request->expense_to, abs($request->cash+$request->bank));
                } elseif ($request->calculation == 'd') {
                    # decrease
                    $this->UpdateSupplierOutstanding($request->expense_to, -abs($request->cash+$request->bank));
                }
                if (!empty($request->withdraw_from_bank)) {
                    $this->UpdateBankOutstanding($request->withdraw_from_bank, -abs($request->cash+$request->bank));
                }
            } elseif ($request->search == 'bank') {
                if ($request->calculation == 'i') {
                    if ($request->expense_to == $request->withdraw_from_bank) {
                        //single bank increment
                        $this->UpdateBankOutstanding($request->expense_to, abs($request->cash+$request->bank));
                    } else {
                        //double bank increment
                        $this->UpdateBankOutstanding($request->expense_to, abs($request->cash+$request->bank));
                    }
                } elseif ($request->calculation == 'd') {
                    if ($request->expense_to == $request->withdraw_from_bank) {
                        //single bank increment
                        $this->UpdateBankOutstanding($request->expense_to, -abs($request->cash+$request->bank));
                    } else {
                        //double bank increment
                        $this->UpdateBankOutstanding($request->expense_to, -abs($request->cash+$request->bank));
                    }
                }
            }
            else{
                if (!empty($request->withdraw_from_bank)) {
                    $this->UpdateBankOutstanding($request->withdraw_from_bank, -abs($request->cash+$request->bank));
                }
            }
            SetLog('Expense Voucher created. (' . $voucher . ')');
            DB::commit();
            return response()->json(['success'=> 'successfully saved','voucher'=>$voucher]);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['errors' => [$e->getMessage()]]);
        }
    }
}