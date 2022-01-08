<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoiceDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoice_details', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('invoice_master_id');
            $table->foreign('invoice_master_id')->references('id')->on('invoice_masters');

            $table->date('invoice_date');

            $table->unsignedBigInteger('warehouse_id');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products');

            $table->float('regular_price', 12, 2)->default(0);
            $table->float('price', 12, 2)->default(0);
            
            $table->float('quantity', 12, 2)->default(0);
            $table->float('rtn_quantity', 12, 2)->default(0);
            $table->float('delivery_quantity', 12, 2)->default(0);

            $table->string('note')->nullable();

            $table->float('vat', 12, 2)->default(0);
            $table->float('vat_amount', 12, 2)->default(0);
            $table->float('discount', 12, 2)->default(0);
            $table->float('discount_amount', 12, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invoice_details');
    }
}
