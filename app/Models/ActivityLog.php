<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = ['action', 'description', 'user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Quick static helper to create a log entry.
     */
    public static function log(string $action, string $description, ?int $userId = null): void
    {
        static::create([
            'action'      => $action,
            'description' => $description,
            'user_id'     => $userId,
        ]);
    }
}