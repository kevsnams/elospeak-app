<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Classroom extends Model
{
    protected $appends = ['start_with_tz', 'end_with_tz'];
    
    const STATUS_ACTIVE = 1;
    const STATUS_DONE = 2;
    const STATUS_CANCELLED = 3;

    public static function status()
    {
        return collect([
            [self::STATUS_ACTIVE, 'Active'],
            [self::STATUS_DONE, 'Done'],
            [self::STATUS_CANCELLED, 'Cancelled']
        ]);
    }
    
    public function teacher()
    {
        return $this->belongsTo('App\Teacher');
    }

    public function student()
    {
        return $this->belongsTo('App\Student');
    }

    public function enrollment()
    {
        return $this->belongsTo('App\Enrollment');
    }

    public function getStartWithTzAttribute()
    {
        $carbon = Carbon::createFromFormat('Y-m-d H:i:s', $this->start, session('timezone'));
        return $carbon->format('Y-m-d H:i:s');
    }

    public function getEndWithTzAttribute()
    {
        $carbon = Carbon::createFromFormat('Y-m-d H:i:s', $this->end, session('timezone'));
        return $carbon->format('Y-m-d H:i:s');
    }
}
