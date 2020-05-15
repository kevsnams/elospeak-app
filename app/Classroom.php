<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Classroom extends Model
{
    protected $appends = [ 'duration' ];
    protected $dates = [ 'start', 'end' ];

    const STATUS_ACTIVE = 1;
    const STATUS_DONE = 0;
    const STATUS_CANCELLED = 2;

    public function teacher()
    {
        return $this->belongsTo('App\Teacher');
    }

    public function student()
    {
        return $this->belongsTo('App\Student');
    }

    public function getDurationAttribute()
    {
        return $this->end->diffInMinutes($this->start);
    }
}
