<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')->orderBy('name')->get();
        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:100', 'unique:categories,name'],
            'description' => ['nullable', 'string', 'max:500'],
            'color'       => ['nullable', 'string', 'max:20'],
            'icon'        => ['nullable', 'string', 'max:50'],
        ]);

        $category = Category::create($data);
        return response()->json($category, 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json($category->loadCount('products'));
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:100', "unique:categories,name,{$category->id}"],
            'description' => ['nullable', 'string', 'max:500'],
            'color'       => ['nullable', 'string', 'max:20'],
            'icon'        => ['nullable', 'string', 'max:50'],
        ]);

        $category->update($data);
        return response()->json($category);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with existing products.',
            ], 422);
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted.']);
    }
}