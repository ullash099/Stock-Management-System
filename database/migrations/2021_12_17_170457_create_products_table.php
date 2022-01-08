<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            
            $table->string('name')->unique()->collation('utf16_general_ci');
            $table->string('name_bangla')->unique()->nullable()->collation('utf16_general_ci');

            $table->unsignedBigInteger('measurement_id');
            $table->foreign('measurement_id')->references('id')->on('measurements');
            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')->references('id')->on('categories');

            $table->float('purchase_price', 11, 2)->default(0);
            $table->float('sales_price', 11, 2)->default(0);
            
            $table->float('reorder_qty', 11, 2)->default(0);            
            $table->float('vat', 6, 2)->default(0);

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
        Schema::dropIfExists('products');
    }
}
