<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'name'            => ['required', 'string', 'max:255', "unique:products,name,{$productId}"],
            'category_id'     => ['required', 'exists:categories,id'],
            'quantity'        => ['required', 'integer', 'min:0'],
            'minimum_stock'   => ['required', 'integer', 'min:0'],
            'unit_price'      => ['required', 'numeric', 'min:0'],
            'supplier'        => ['required', 'string', 'max:255'],
            'entry_date'      => ['required', 'date'],
            'expiration_date' => ['nullable', 'date', 'after:entry_date'],
            'notes'           => ['nullable', 'string', 'max:1000'],
            'image'           => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}