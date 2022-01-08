<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVoucherMastersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('voucher_masters', function (Blueprint $table) {
            $table->id();
            
            $table->string('voucher')->unique();
            $table->date('voucher_date');            

            $table->enum('voucher_type', ['dr','cr','s']);

            $table->unsignedBigInteger('account_head_id');
            $table->foreign('account_head_id')->references('id')->on('account_heads');

            $table->enum('transactions_type', ['cash','bank','both']);

            $table->unsignedBigInteger('withdraw_from_bank_id')->nullable();
            $table->foreign('withdraw_from_bank_id')->references('id')->on('banks');

            $table->unsignedBigInteger('deposit_in_bank_id')->nullable();
            $table->foreign('deposit_in_bank_id')->references('id')->on('banks');


            $table->unsignedBigInteger('customer_id')->nullable();
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->unsignedBigInteger('bank_id')->nullable();
            $table->foreign('bank_id')->references('id')->on('banks');

            $table->float('total', 12,4)->default(0);
            $table->float('cash_amount', 12,4)->default(0);
            $table->float('bank_amount', 12,4)->default(0);
                        
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
        Schema::dropIfExists('voucher_masters');
    }
}
