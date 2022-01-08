<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('client')->nullable();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable()->unique();
            $table->string('address')->nullable();

            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            //$table->foreignId('current_team_id')->nullable();
            $table->text('profile_photo_path')->nullable();

            $table->boolean('block')->default(false)->comment('0 (false) = active , 1(true) = blocked');
            $table->unsignedBigInteger('role_id')->nullable();
            $table->foreign('role_id')->references('id')->on('roles');
            $table->integer('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable()->references('id')->on('users');
            $table->integer('deleted_by')->nullable()->references('id')->on('users');

            $table->timestamps();
        });

        // Insert some stuff
        DB::table('users')->insert([
            'name'              =>  'rowshansoft developer',
            'email'             =>  'developer@rowshansoft.com',
            'email_verified_at' =>  now(),
            'password'          =>  '$2y$10$S5sOVa5ExZ7sMDxFMvZKGeyPEnogrIsNV43CFefG5Y/LRDR/PPnnm',#developer@rowshansoft.com
            'block'             =>  false,

            'role_id'           =>  1,
            
            'created_by'        =>  '0',
            'created_at'        =>  now(),
            'updated_at'        =>  now()            
        ]);

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
