<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Supplier extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name','name_bangla',
        'phone','phone_alt','email',
        'supplier_address','opening_balance','outstanding',
        'created_by','updated_by','deleted_by','deleted_at'
    ];
}
