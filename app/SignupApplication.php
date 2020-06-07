<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SignupApplication extends Model
{
    const STATUS_ACCEPTED = 1;
    const STATUS_PENDING = 0;
    const STATUS_DENIED = -1;
}
