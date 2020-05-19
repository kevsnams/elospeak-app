<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

use App\UserPhoto;

class Student extends Authenticatable
{
    protected $appends = [ 'user_type', 'uc_user_type', 'age', 'photo_url', 'name' ];
    protected $hidden = ['password', 'remember_token'];

    public function photo()
    {
        return $this->belongsTo('App\UserPhoto', 'user_photo_id');
    }

    public function getPhotoUrlAttribute()
    {
        $photo = UserPhoto::find($this->user_photo_id);
        return $photo ? url($photo->path) : url('img/elo-avatar.png');
    }

    public function getUserTypeAttribute()
    {
        return 'student';
    }

    public function getUcUserTypeAttribute()
    {
        return ucfirst($this->user_type);
    }

    public function getAgeAttribute()
    {
        return $this->birthday ? intval(idate('Y') - idate('Y', strtotime($this->birthday))) : 0;
    }

    public function getNameAttribute()
    {
        return $this->full_name;
    }
}
