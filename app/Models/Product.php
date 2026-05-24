<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'quantity',
        'minimum_stock',
        'unit_price',
        'supplier',
        'entry_date',
        'expiration_date',
        'status',
        'notes',
        'image',
    ];

    protected $casts = [
        'quantity'        => 'integer',
        'minimum_stock'   => 'integer',
        'unit_price'      => 'float',
        'entry_date'      => 'date',
        'expiration_date' => 'date',
    ];

    protected $appends = ['image_url', 'total_value', 'is_expired'];

    // ── Relationships ──────────────────────────────────────────────────

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // ── Accessors ──────────────────────────────────────────────────────

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }
        return Storage::disk('public')->url($this->image);
    }

    public function getTotalValueAttribute(): float
    {
        return round($this->unit_price * $this->quantity, 2);
    }

    public function getIsExpiredAttribute(): bool
    {
        if (! $this->expiration_date) return false;
        return $this->expiration_date->isPast();
    }

    // ── Scopes ─────────────────────────────────────────────────────────

    public function scopeLowStock($query)
    {
        return $query->where('status', 'low_stock');
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('status', 'out_of_stock');
    }
}