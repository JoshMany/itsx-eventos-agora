<?php

namespace App\Enums;

enum ParticipantType: string
{
    case Student = 'student';
    case Staff = 'staff';
    case External = 'external';

    public function label(): string
    {
        return match ($this) {
            self::Student => 'Estudiante',
            self::Staff => 'Personal',
            self::External => 'Externo',
        };
    }
}
