<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAccountHeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('account_heads', function (Blueprint $table) {
            $table->id();
            
            $table->string('name')->unique()->collation('utf16_general_ci');
            $table->string('name_bangla')->nullable()->unique()->collation('utf16_general_ci');

            $table->enum('head_type', ['income', 'expenses']);
            $table->enum('search', [
                'na',  
                'bank', 
                'customer', 
                'supplier'
            ]);
            /* 
            'na', 
            'agent', 
            'bank', 
            'customer',
            'employee', 
            'investor',  
            'supplier'
            */

            $table->enum('calculation', ['n', 'i', 'd'])
            ->default('n')->comment(' n = N/A, i = increase, d = decrease');

            $table->integer('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable()->references('id')->on('users');
            $table->integer('deleted_by')->nullable()->references('id')->on('users');

            $table->timestamps();
            $table->softDeletes();
        });
        DB::table('account_heads')->insert([
            [
                'name'              =>  'Sales',
                'name_bangla'       =>  'বিক্রি',
                'head_type'         =>  'income',
                'search'            =>  'customer',
                'calculation'       =>  'i',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ],
            [
                'name'              =>  'Bank Interest',
                'name_bangla'       =>  'ব্যাংক সুদ',
                'head_type'         =>  'income',
                'search'            =>  'bank',
                'calculation'       =>  'i',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ],
            [
                'name'              =>  'Customer Due',//'Customers Outstanding Bill',
                'name_bangla'       =>  'গ্রাহকের বকেয়া বিল',
                'head_type'         =>  'income',
                'search'            =>  'customer',
                'calculation'       =>  'd',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ],
            [
                'name'              =>  'Supplier Bill',
                'name_bangla'       =>  'সরবরাহকারীর বিল',
                'head_type'         =>  'expenses',
                'search'            =>  'supplier',
                'calculation'       =>  'd',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ],
            [
                'name'              =>  'Bank Charges',
                'name_bangla'       =>  'ব্যাংক চার্জ',
                'head_type'         =>  'expenses',
                'search'            =>  'bank',
                'calculation'       =>  'd',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ],
            [
                'name'              =>  'Office Cost',
                'name_bangla'       =>  'অফিস খরচ',
                'head_type'         =>  'expenses',
                'search'            =>  'na',
                'calculation'       =>  'n',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ],
            /* [
                'name'              =>  'Salary',
                'name_bangla'       =>  'বেতন',
                'head_type'         =>  'expenses',
                'search'            =>  'employee',
                'calculation'       =>  'd',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ], */
            /* [
                'name'              =>  'Withdraw',
                'name_bangla'       =>  'উত্তোলন',
                'head_type'         =>  'expenses',
                'search'            =>  'investor',
                'calculation'       =>  'd',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ], */
            [
                'name'              =>  'Bank Deposit',
                'name_bangla'       =>  'ব্যাংক জমা',
                'head_type'         =>  'expenses',
                'search'            =>  'bank',
                'calculation'       =>  'i',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ],
            /* [
                'name'              =>  'Invest',
                'name_bangla'       =>  'বিনিয়োগ',
                'head_type'         =>  'income',
                'search'            =>  'investor',
                'calculation'       =>  'i',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ],
            [
                'name'              =>  'Sales Commission',
                'name_bangla'       =>  'বিক্রয় কমিশন',
                'head_type'         =>  'expenses',
                'search'            =>  'agent',
                'calculation'       =>  'd',
                'created_by'        =>  '0',
                'created_at'        =>  now(),
                'updated_at'        =>  now()
            ], */
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('account_heads');
    }
}
