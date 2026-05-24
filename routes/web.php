
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Hotel Stock Management System
|--------------------------------------------------------------------------
*/

// Public routes (no auth required)
Route::post('/login',  [AuthController::class, 'login']);

// Protected routes (Sanctum token required)
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats',           [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-activity', [DashboardController::class, 'recentActivity']);
    Route::get('/dashboard/low-stock',       [DashboardController::class, 'lowStockProducts']);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Products (stock)
    Route::apiResource('products', ProductController::class);
    Route::post('/products/{product}/restore', [ProductController::class, 'restore']);

    // Profile
    Route::patch('/profile',          [ProfileController::class, 'update']);
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar',    [ProfileController::class, 'uploadAvatar']);
});