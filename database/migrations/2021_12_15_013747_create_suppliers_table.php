<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();

            $table->string('name')->collation('utf16_general_ci');
            $table->string('name_bangla')->nullable()->collation('utf16_general_ci');

            $table->string('phone')->unique()->collation('utf16_general_ci');
            $table->string('phone_alt')->nullable()->collation('utf16_general_ci');

            $table->string('email')->unique()->nullable()->collation('utf16_general_ci');

            $table->text('supplier_address')->nullable()->collation('utf16_general_ci');
            
            $table->float('opening_balance', 11, 2)->default(0);
            $table->float('outstanding', 11, 2)->default(0);

            $table->integer('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable()->references('id')->on('users');
            $table->integer('deleted_by')->nullable()->references('id')->on('users');

            $table->timestamps();
            $table->softDeletes();
        });

        // Insert some stuff
        DB::table('suppliers')->insert([
            'name'              =>  'General Supplier',
            'name_bangla'       =>  'সাধারণ সরবরাহকারী',
            'phone'             =>  '',
            'phone_alt'         =>  null,
            'email'             =>  null,
            'supplier_address'  =>  null,
            'outstanding'       =>  0,
            'created_at'        =>  now(),
            'updated_at'        =>  now(),
            'created_by'        =>  '0'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('suppliers');
    }
}
