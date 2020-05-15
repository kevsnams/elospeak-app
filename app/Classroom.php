<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Classroom extends Model
{
    protected $appends = [ 'duration', 'raw_start', 'raw_end' ];
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

    public function getRawStartAttribute()
    {
        return $this->start->format('Y-m-d H:i:s');
    }

    public function getRawEndAttribute()
    {
        return $this->end->format('Y-m-d H:i:s');
    }
}
