<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyOption extends Model
{
    protected $fillable = [
        'question_id', 'label', 'value',
    ];
}
