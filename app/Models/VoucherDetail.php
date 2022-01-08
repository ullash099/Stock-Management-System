<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VoucherDetail extends Model
{
    use HasFactory;
    protected $fillable = [
        'voucher_master_id','description','amount'
    ];
}
