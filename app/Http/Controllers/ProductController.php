<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\ActivityLog;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * List products — with search, filter, sort, pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        // Search by name or supplier
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('supplier', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Sort
        $sortField = $request->input('sort_by', 'created_at');
        $sortDir   = $request->input('sort_dir', 'desc');
        $allowed   = ['name', 'quantity', 'status', 'created_at', 'expiration_date', 'unit_price'];

        if (in_array($sortField, $allowed)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $perPage  = min((int) $request->input('per_page', 10), 50);
        $products = $query->paginate($perPage);

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'total'        => $products->total(),
                'per_page'     => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
            ],
        ]);
    }

    /**
     * Store a new product.
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $this->handleImageUpload($request->file('image'));
        }

        $data['status'] = $this->calculateStatus($data['quantity'], $data['minimum_stock']);

        $product = Product::create($data);
        $product->load('category');

        ActivityLog::log('created', "Added product: {$product->name}", $request->user()->id);

        return response()->json($product, 201);
    }

    /**
     * Show a single product.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load('category'));
    }

    /**
     * Update a product.
     */
    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $this->handleImageUpload($request->file('image'));
        }

        // Recalculate status based on new quantity/minimum
        $quantity     = $data['quantity']      ?? $product->quantity;
        $minStock     = $data['minimum_stock'] ?? $product->minimum_stock;
        $data['status'] = $this->calculateStatus($quantity, $minStock);

        $product->update($data);
        $product->load('category');

        ActivityLog::log('updated', "Updated product: {$product->name}", $request->user()->id);

        return response()->json($product);
    }

    /**
     * Delete a product.
     */
    public function destroy(Request $request, Product $product): JsonResponse
    {
        $name = $product->name;

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        ActivityLog::log('deleted', "Deleted product: {$name}", $request->user()->id);

        return response()->json(['message' => "Product \"{$name}\" deleted."]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private function handleImageUpload($file): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        return $file->storeAs('products', $filename, 'public');
    }

    private function calculateStatus(int $quantity, int $minimum): string
    {
        if ($quantity === 0)          return 'out_of_stock';
        if ($quantity <= $minimum)    return 'low_stock';
        return 'in_stock';
    }
}