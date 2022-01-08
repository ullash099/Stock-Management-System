<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseDetail extends Model
{
    use HasFactory;
    protected $fillable = [
        'purchase_master_id','warehouse_id','product_id',
        'qty','price','subtotal','rtn_qty'
    ];

    public function purchase_masters()
    {
        return $this->hasMany(PurchaseMaster::class,'purchase_master_id','id')->withTrashed();
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class)->withTrashed();
    }
    
    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }
}
