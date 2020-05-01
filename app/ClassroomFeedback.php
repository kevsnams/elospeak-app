<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

use App\Student;
use App\Teacher;

class ClassroomFeedback extends Model
{
    protected $table = 'classroom_feedbacks';

    protected $appends = ['from', 'to', 'human_date'];

    public function classroom()
    {
        return $this->belongsTo('App\Classroom');
    }
    
    public function getFromAttribute()
    {
        return $this->from_user_type === 'teacher' ? 
            Teacher::findOrFail($this->from_id) : Student::findOrFail($this->from_id);
    }

    public function getToAttribute()
    {
        return $this->to_user_type === 'teacher' ?
            Teacher::findOrFail($this->to_id) : Student::findOrFail($this->to_id);
    }

    public function getHumanDateAttribute()
    {
        $carbon = Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at, session('timezone'));
        return $carbon->format('F j, Y h:i A');
    }
}
