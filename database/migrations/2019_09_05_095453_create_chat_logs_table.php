<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChatLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chat_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('classroom_id');
            $table->string('message', 1000);
            $table->string('from', 10);
            $table->string('channel_id', 100);
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
        Schema::dropIfExists('chat_logs');
    }
}
