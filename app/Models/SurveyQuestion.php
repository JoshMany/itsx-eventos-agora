<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurveyQuestion extends Model
{
    protected $fillable = [
        'survey_id', 'question_type', 'question', 'sort_order',
    ];

    /** @return BelongsTo<Survey, $this> */
    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }

    /** @return HasMany<SurveyOption, $this> */
    public function options(): HasMany
    {
        return $this->hasMany(SurveyOption::class, 'question_id');
    }
}
