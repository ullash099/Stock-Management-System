<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMeasurementsTable extends Migration
{
    private $data = [
        [
            'name'          =>  'C.F.T.',
            'name_bangla'   =>  'সি. এফ. টি.',
            'created_by'    =>  '0'
        ],
        [
            'name'          =>  'Tons',
            'name_bangla'   =>  'টন',
            'created_by'    =>  '0'
        ],
        [
            'name'          =>  'KG',
            'name_bangla'   =>  'কেজি',
            'created_by'    =>  '0'
        ],
        [
            'name'          =>  'Piece',
            'name_bangla'   =>  'পিস',
            'created_by'    =>  '0'
        ],
        [
            'name'          =>  'Liters',
            'name_bangla'   =>  'লিটার',
            'created_by'    =>  '0'
        ],
        [
            'name'          =>  'Hour',
            'name_bangla'   =>  'ঘণ্টা',
            'created_by'    =>  '0'
        ],
    ];
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('measurements', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique()->collation('utf16_general_ci');
            $table->string('name_bangla')->nullable()->unique()->collation('utf16_general_ci');

            $table->integer('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable()->references('id')->on('users');
            $table->integer('deleted_by')->nullable()->references('id')->on('users');

            $table->timestamps();
            $table->softDeletes();
        });
        DB::table('measurements')->insert($this->data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('measurements');
    }
}
