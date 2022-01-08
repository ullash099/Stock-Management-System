<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;
    protected $fillable = [
        'parent_id','name','name_l',
        'route'
    ];

    public function parent()
    {
        return $this->belongsTo(Menu::class,'parent_id','id');
    }

    public function childs()
    {
        return $this->hasMany(Menu::class,'parent_id','id')->orderBy('id');
    }
}
