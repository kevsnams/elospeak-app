<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Teacher extends Authenticatable
{
    protected $appends = ['user_type', 'uc_user_type'];
    protected $hidden = ['password', 'remember_token'];

    public function getUserTypeAttribute()
    {
        return 'teacher';
    }

    public function getUcUserTypeAttribute()
    {
        return ucfirst($this->user_type);
    }
}
