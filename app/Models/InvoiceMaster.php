<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InvoiceMaster extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'invoice','invoice_date',
        'customer_id',
        'sub_total','vat','total',
        'advance','discount','net_payable',
        'cash', 'bank_id','bank_ref','bank_amount',
        'exchange_amount',
        'receive','return_due',
        'is_delivered',
        'created_by','updated_by','deleted_by'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class)->withTrashed();
    }

    public function bank()
    {
        return $this->belongsTo(Bank::class)->withTrashed();
    }

    public function details()
    {
        return $this->hasMany(InvoiceDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class,'created_by','id');
    }
}
