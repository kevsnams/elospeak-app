<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Teacher extends Authenticatable
{
    protected $appends = ['user_type'];
    
    public function getUserTypeAttribute()
    {
        return 'teacher';
    }
}
