<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterClassroomFeedbacksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('classroom_feedbacks', function (Blueprint $table) {
            $table->renameColumn('user_type', 'from_user_type');
            $table->bigInteger('to_id')->after('user_type');
            $table->string('to_user_type', 20)->after('to_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('classroom_feedbacks', function (Blueprint $table) {
            $table->rename('from_user_type', 'user_type');
            $table->dropColumn('to_id');
            $table->dropColumn('to_user_type');
        });
    }
}
