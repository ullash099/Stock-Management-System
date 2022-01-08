<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCurrenciesTable extends Migration
{
    private $data = [
        [
            'name'          =>  'Bangladeshi Taka',
            'short_code'    =>  'BDT',
            'sign'          =>  '&#2547;',
        ]
    ];
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique();
            $table->string('short_code')->unique();
            $table->string('sign')->unique();

            $table->timestamps();
        });
        DB::table('currencies')->insert($this->data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('currencies');
    }
}
