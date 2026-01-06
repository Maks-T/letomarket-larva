<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoyaltyTransaction extends Model
{
  use HasFactory;

  protected $fillable = [
    'customer_id', 'amount', 'type',
    'description', 'meta'
  ];

  protected $casts = [
    'amount' => 'decimal:2',
    'meta' => 'array',
  ];

  public function customer(): BelongsTo
  {
    return $this->belongsTo(Customer::class);
  }
}