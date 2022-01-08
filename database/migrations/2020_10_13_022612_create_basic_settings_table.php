<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBasicSettingsTable extends Migration
{
    private $data = [
        /* [
            'name'          =>  'permissible_branch',
            'val'           =>  '1',
            'created_by'    =>  0
        ], */
        [
            'name'          =>  'default_currency',
            'val'           =>  '1',
            'created_by'    =>  0
        ],
        #invoice
        [
            'name'          =>  'invoice_print_layout',
            'val'           =>  'a4',
            'created_by'    =>  0
        ],
        [
            'name'          =>  'invoice_font_size',
            'val'           =>  '10',
            'created_by'    =>  0
        ],
        [
            'name'          =>  'invoice_print_language',
            'val'           =>  'en',
            'created_by'    =>  0
        ],
        #report
        [
            'name'          =>  'report_font_size',
            'val'           =>  '14',
            'created_by'    =>  0
        ],
        [
            'name'          =>  'report_print_language',
            'val'           =>  'en',
            'created_by'    =>  0
        ],
        #income_voucher
        [
            'name'          =>  'income_voucher_print_layout',
            'val'           =>  'a4',
            'created_by'    =>  0
        ],
        [
            'name'          =>  'income_voucher_font_size',
            'val'           =>  '14',
            'created_by'    =>  0
        ],
        [
            'name'          =>  'income_voucher_language',
            'val'           =>  'en',
            'created_by'    =>  0
        ],
        #expense voucher
        [
            'name'          =>  'expense_voucher_print_layout',
            'val'           =>  'a4',
            'created_by'    =>  0
        ],
        [
            'name'          =>  'expense_voucher_font_size',
            'val'           =>  '14',
            'created_by'    =>  0
        ],
        [
            'name'          =>  'expense_voucher_language',
            'val'           =>  'en',
            'created_by'    =>  0
        ],
        [
            'name'          =>  'next_due_date',
            'val'           =>  '',
            'created_by'    =>  0
        ],
    ];
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('basic_settings', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('val')->collation('utf16_general_ci');

            $table->integer('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable()->references('id')->on('users');
            $table->timestamps();
        });
        #Insert some stuff
        DB::table('basic_settings')->insert($this->data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('basic_settings');
    }
}
