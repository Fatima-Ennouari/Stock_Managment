<?php
// ============================================================
// FILE: database/migrations/2024_01_01_000001_create_hotel_stock_tables.php
// Run all 4 tables in one migration for simplicity
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Users table (extend default)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'manager', 'staff'])->default('admin');
            $table->string('avatar')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('description', 500)->nullable();
            $table->string('color', 20)->default('#3b82f6');
            $table->string('icon', 50)->default('package');
            $table->timestamps();
        });

        // Products (hotel stock items)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('quantity')->default(0);
            $table->unsignedInteger('minimum_stock')->default(5);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->string('supplier')->nullable();
            $table->date('entry_date');
            $table->date('expiration_date')->nullable();
            $table->enum('status', ['in_stock', 'low_stock', 'out_of_stock'])->default('in_stock');
            $table->text('notes')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();

            $table->index(['status', 'category_id']);
        });

        // Activity log
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action', 50); // created, updated, deleted
            $table->string('description');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        // Sanctum personal access tokens
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('users');
    }
};