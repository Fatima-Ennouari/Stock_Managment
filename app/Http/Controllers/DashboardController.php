<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Main dashboard statistics.
     */
    public function stats(): JsonResponse
    {
        $totalProducts    = Product::count();
        $inStock          = Product::where('status', 'in_stock')->count();
        $lowStock         = Product::where('status', 'low_stock')->count();
        $outOfStock       = Product::where('status', 'out_of_stock')->count();
        $totalValue       = Product::selectRaw('SUM(quantity * unit_price) as total')->value('total') ?? 0;

        // Category breakdown for chart
        $byCategory = Product::selectRaw('categories.name as category, COUNT(*) as count, SUM(products.quantity) as total_qty')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->groupBy('categories.id', 'categories.name')
            ->get();

        // Stock status for pie chart
        $statusBreakdown = [
            ['label' => 'In Stock',     'value' => $inStock,    'color' => '#10b981'],
            ['label' => 'Low Stock',    'value' => $lowStock,   'color' => '#f59e0b'],
            ['label' => 'Out of Stock', 'value' => $outOfStock, 'color' => '#ef4444'],
        ];

        return response()->json([
            'total_products'  => $totalProducts,
            'in_stock'        => $inStock,
            'low_stock'       => $lowStock,
            'out_of_stock'    => $outOfStock,
            'total_value'     => round($totalValue, 2),
            'by_category'     => $byCategory,
            'status_breakdown'=> $statusBreakdown,
        ]);
    }

    /**
     * Recent activity log.
     */
    public function recentActivity(): JsonResponse
    {
        $activities = ActivityLog::with('user')
            ->latest()
            ->take(15)
            ->get()
            ->map(fn($log) => [
                'id'          => $log->id,
                'action'      => $log->action,
                'description' => $log->description,
                'user_name'   => $log->user?->name ?? 'System',
                'created_at'  => $log->created_at->diffForHumans(),
                'raw_date'    => $log->created_at->toISOString(),
            ]);

        return response()->json($activities);
    }

    /**
     * Products that need attention (low/out of stock).
     */
    public function lowStockProducts(): JsonResponse
    {
        $products = Product::with('category')
            ->whereIn('status', ['low_stock', 'out_of_stock'])
            ->orderBy('quantity')
            ->take(10)
            ->get()
            ->map(fn($p) => [
                'id'            => $p->id,
                'name'          => $p->name,
                'category'      => $p->category->name,
                'quantity'      => $p->quantity,
                'minimum_stock' => $p->minimum_stock,
                'status'        => $p->status,
                'image_url'     => $p->image_url,
            ]);

        return response()->json($products);
    }
}