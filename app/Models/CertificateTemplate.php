<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CertificateTemplate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'pdf_background',
        'html_template',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (CertificateTemplate $template): void {
            if (! $template->uuid) {
                $template->uuid = (string) Str::orderedUuid();
            }
        });
    }
}
