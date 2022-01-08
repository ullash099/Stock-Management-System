<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRolesTable extends Migration
{
    private $data = [
        [
            'name'          =>  'Administrator',
            'name_l'        =>  'প্রশাসক',
            'permissions'   =>  '["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","119","120","121","122","123","16","17","18","19","20","116","117","118","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","124","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115"]',
            'created_by'    =>  '0'
        ],
        [
            'name'          =>  'Admin',
            'name_l'        =>  'অ্যাডমিন',
            'permissions'   =>  '',
            'created_by'    =>  '0'
        ],
        [
            'name'          =>  'User',
            'name_l'        =>  'ব্যবহারকারী',
            'permissions'   =>  '',
            'created_by'    =>  '0'
        ]
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('name_l')->nullable()->unique();
            $table->text('permissions')->nullable();

            $table->integer('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable()->references('id')->on('users');
            $table->integer('deleted_by')->nullable()->references('id')->on('users');

            $table->timestamps();
            $table->softDeletes();
        });
        DB::table('roles')->insert($this->data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('roles');
    }
}
