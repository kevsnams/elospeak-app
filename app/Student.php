<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Student extends Authenticatable
{
    protected $appends = ['user_type'];
    protected $hidden = ['password', 'remember_token'];

    
    public function getUserTypeAttribute()
    {
        return 'student';
    }
}
