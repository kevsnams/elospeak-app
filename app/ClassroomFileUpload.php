<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassroomFileUpload extends Model
{
    protected $appends = ['image_URL'];

    const UPLOAD_DIR = 'public/classroom-files';

    public function getImageURLAttribute()
    {
        return asset('/storage/classroom-files/'. $this->filename);
    }
}
