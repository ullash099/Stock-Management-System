<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    use HasFactory;
    protected $fillable = [
        'invoice_master_id', 'invoice_date', 
        'warehouse_id','product_id',                
        'regular_price', 'price',
        'quantity', 'rtn_quantity','delivery_quantity',
        'note',
        'vat', 'vat_amount',
        'discount', 'discount_amount'
    ];

    public function invoice_master()
    {
        return $this->belongsTo(InvoiceMaster::class)->withTrashed();
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
