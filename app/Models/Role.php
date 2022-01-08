<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $fillable = [
        'name','name_l','permissions',
        'created_by'
    ];
    
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
