<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use App\Classroom;

class ChatNew implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $classroomId;
    public $classroom;
    public $from;

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
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        #return new PrivateChannel('classroom.'. $this->classroom->id);
        return new Channel('classroom.'. $this->classroom->id);
    }
}
