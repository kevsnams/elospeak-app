<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    const UNPAID = 0;
    const PAID = 1;
    
    const INACTIVE = 0;
    const ACTIVE = 1;

    public function classrooms()
    {
        return $this->hasMany('App\Classrooms');
    }
}
