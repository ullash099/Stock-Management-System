<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;
    protected $fillable = [
        'warehouse_id', 
        #'category_id',
        'product_id',
        'qty',
        'created_by', 'updated_by'
    ];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class)->withTrashed();
    }

    /* public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    } */
    
    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }
}
