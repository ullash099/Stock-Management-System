<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bank extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'bank_type', 'name', 'account_holder',
        'account_no', 'opening_balance','outstanding', 'bank_address',
        'created_by','updated_by','deleted_by','deleted_at'
    ];
}
