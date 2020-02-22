<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    const STATUS_UNPAID = 0;
    const STATUS_ACTIVE = 1;
    // const STATUS_CURRENT = 4;
    const STATUS_DONE = 2;
    const STATUS_CANCELLED = 3;
    
    public function teacher()
    {
        return $this->belongsTo('App\Teacher');
    }

    public function student()
    {
        return $this->belongsTo('App\Student');
    }
}
