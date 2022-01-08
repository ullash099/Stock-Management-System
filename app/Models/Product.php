<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name', 'name_bangla',
        'measurement_id','category_id',
        'purchase_price', 'sales_price',
        'vat', 'reorder_qty',
        'created_by', 'updated_by', 'deleted_by','deleted_at'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    public function measurement()
    {
        return $this->belongsTo(Measurement::class);
    }

    public function opening_stock()
    {
        return $this->hasMany(OpeningStock::class);
    }

    /* public function discounts()
    {
        $today = date('Y-m-d');
        return $this->hasMany(Discount::class)
            ->whereDate('discount_start', '<=', $today)
            ->whereDate('discount_end', '>=', $today)
            ->latest();
    }

    public function barcodes()
    {
        return $this->hasMany(Barcode::class)
            ->where('is_sold', false)
            ->latest();
    } */
}
