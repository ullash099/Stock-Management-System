<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name','name_bangla', 'parent_id','description',
        'thumbnail_id',
        'created_by','updated_by','deleted_by','deleted_at'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function thumbnail()
    {
        return $this->belongsTo(Media::class,'thumbnail_id','id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class,'parent_id','id');
    }

    public function childs()
    {
        return $this->hasMany(Category::class,'parent_id','id');
    }
}
