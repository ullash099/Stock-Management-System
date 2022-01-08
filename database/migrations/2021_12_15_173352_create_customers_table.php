<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            
            $table->string('name')->collation('utf16_general_ci');
            $table->string('name_bangla')->nullable()->collation('utf16_general_ci');

            $table->string('reg_no')->nullable()->collation('utf16_general_ci');

            $table->string('phone')->unique()->collation('utf16_general_ci');
            $table->string('phone_alt')->nullable()->collation('utf16_general_ci');

            $table->string('email')->unique()->nullable()->collation('utf16_general_ci');

            $table->text('customer_address')->nullable()->collation('utf16_general_ci');

            $table->float('opening_balance', 11, 2)->default(0);
            $table->float('outstanding', 11, 2)->default(0);
            $table->float('discount', 4, 2)->default(0);

            $table->integer('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable()->references('id')->on('users');
            $table->integer('deleted_by')->nullable()->references('id')->on('users');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customers');
    }
}
