<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

use App\UserPhoto;

class Teacher extends Authenticatable
{
    const EDUC_UNDERGRADUATE = 0;
    const EDUC_COLLEGE_GRADUATE = 1;

    protected $appends = ['user_type', 'uc_user_type', 'age', 'photo_url'];
    protected $hidden = ['password', 'remember_token'];

    public static function educationalAttainments()
    {
        return collect([
            [self::EDUC_UNDERGRADUATE, 'Undergraduate'],
            [self::EDUC_COLLEGE_GRADUATE, 'College Graduate']
        ]);
    }

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
        return 'teacher';
    }

    public function getUcUserTypeAttribute()
    {
        return ucfirst($this->user_type);
    }

    public function getAgeAttribute()
    {
        return intval(idate('Y') - idate('Y', strtotime($this->birthday)));
    }
}
