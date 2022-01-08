<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMenusTable extends Migration
{
    private $data = [
        [
            'id'        =>  1,
            'parent_id' =>  null,
            'name'      =>  'Settings',
            'name_l'    =>  'সেটিংস',
        ],
        [
            'id'        =>  2,
            'parent_id' =>  1,
            'name'      =>  'Role',
            'name_l'    =>  'ভূমিকা',
        ],
    ];
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('menus');

            $table->string('name')->unique();
            $table->string('name_l')->unique()->collation('utf16_general_ci');

            $table->timestamps();
        });
        DB::table('menus')->insert($this->data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('menus');
    }
}
