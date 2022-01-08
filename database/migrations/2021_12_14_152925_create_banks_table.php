<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBanksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banks', function (Blueprint $table) {
            $table->id();

            $table->enum('bank_type', ['bank','mobile_bank']);
            $table->string('name')->collation('utf16_general_ci');
            $table->string('account_holder')->collation('utf16_general_ci');

            $table->string('account_no')->unique()->collation('utf16_general_ci');
            $table->float('opening_balance', 11, 2)->default(0);
            $table->float('outstanding', 11, 2)->default(0);

            $table->text('bank_address')->nullable()->collation('utf16_general_ci');

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
        Schema::dropIfExists('banks');
    }
}
