<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Student extends Authenticatable
{
    protected $appends = ['user_type'];
    
    public function getUserTypeAttribute()
    {
        return 'student';
    }
}
