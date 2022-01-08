<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoiceMastersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoice_masters', function (Blueprint $table) {
            $table->id();
            
            $table->string('invoice')->unique();
            $table->date('invoice_date');

            $table->unsignedBigInteger('customer_id')->nullable();
            $table->foreign('customer_id')->references('id')->on('customers');

            $table->float('sub_total', 12,2)->default(0);
            $table->float('vat', 12,2)->default(0);
            $table->float('total', 12,2)->default(0);
            
            $table->float('advance', 12,2)->default(0);
            $table->float('discount', 12,2)->default(0);
            $table->float('net_payable', 12,2)->default(0);

            $table->float('cash', 12,2)->default(0);
            
            $table->unsignedBigInteger('bank_id')->nullable();
            $table->foreign('bank_id')->references('id')->on('banks');
            $table->string('bank_ref')->nullable();
            $table->float('bank_amount', 12,2)->default(0);

            $table->float('exchange_amount', 12,2)->default(0);

            $table->float('receive', 12,2)->default(0);
            $table->float('return_due', 12,2)->default(0);

            $table->boolean('is_delivered')->default(false);

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
        Schema::dropIfExists('invoice_masters');
    }
}
