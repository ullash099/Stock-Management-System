<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VoucherMaster extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'voucher','voucher_date',
        'voucher_type',
        'account_head_id','transactions_type',
        'withdraw_from_bank_id','deposit_in_bank_id',

        'customer_id','supplier_id','bank_id',
        
        'total','cash_amount','bank_amount',
        'created_by','updated_by','deleted_by'
    ];
            
    public function account_head()
    {
        return $this->belongsTo(AccountHead::class)->withTrashed();
    }
    
    public function withdraw_from_bank()
    {
        return $this->belongsTo(Bank::class)->withTrashed();
    }
    
    public function deposit_in_bank()
    {
        return $this->belongsTo(Bank::class)->withTrashed();
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class)->withTrashed();
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class)->withTrashed();
    }
    
    public function bank()
    {
        return $this->belongsTo(Bank::class)->withTrashed();
    }

    public function details()
    {
        return $this->hasMany(VoucherDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class,'created_by','id');
    }
}
