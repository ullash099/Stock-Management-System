<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PurchaseMaster extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'voucher','purchase_date',
        'supplier_id','ref','total',
        'created_by','updated_by','deleted_by'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class)->withTrashed();
    }

    public function details()
    {
        return $this->hasMany(PurchaseDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class,'created_by','id');
    }
}
