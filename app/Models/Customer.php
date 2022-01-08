<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = [
        'name','name_bangla','reg_no',
        'phone','phone_alt','email',
        'customer_address','opening_balance','outstanding','discount',
        'created_by','updated_by','deleted_by','deleted_at'
    ];
}
