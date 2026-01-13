<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ProductImage extends Model {
    protected $guarded = ['id'];

    public function imageable(): MorphTo { return $this->morphTo(); }
}
