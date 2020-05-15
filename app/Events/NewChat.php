<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use App\Classroom;
use App\ChatLog;

class NewChat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $classroomId;
    public $classroom;
    public $from;
    public $channelId;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($message, $from, $classroomId)
    {
        $this->message = $message;
        $this->classroomId = $classroomId;
        $this->from = $from;
        $this->classroom = Classroom::findOrFail($this->classroomId);
        $this->channelId = 'classroom.'. $this->classroom->id .'.board';

        /** @TODO Queue this, also TeacherChatNew event */
        $chatLog = new ChatLog();
        $chatLog->from = $this->from;
        $chatLog->message = $this->message;
        $chatLog->classroom_id = $this->classroomId;
        $chatLog->channel_id = $this->channelId;

        $chatLog->save();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel($this->channelId);
    }
}
