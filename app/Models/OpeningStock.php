<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OpeningStock extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'warehouse_id', 'category_id','product_id',
        'qty',
        'created_by', 'updated_by', 'authorize_by', 'deleted_by', 'authorize_at'
    ];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class)->withTrashed();
    }

    public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }
    
    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }
}
