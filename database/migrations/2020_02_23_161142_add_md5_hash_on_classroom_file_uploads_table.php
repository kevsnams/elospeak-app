<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMd5HashOnClassroomFileUploadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('classroom_file_uploads', function (Blueprint $table) {
            $table->string('md5_hash', 40)->nullable()->after('node');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('classroom_file_uploads', function (Blueprint $table) {
            $table->dropColumn('md5_hash');
        });
    }
}
