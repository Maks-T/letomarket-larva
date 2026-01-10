<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum CompanyType: string implements HasLabel
{
    case LEGAL = 'legal';
    case ENTREPRENEUR = 'entrepreneur';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::LEGAL => 'Юридическое лицо',
            self::ENTREPRENEUR => 'Индивидуальный предприниматель',
        };
    }
}
