<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin user ──────────────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@hotelstock.com'],
            [
                'name'     => 'Hotel Manager',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ]
        );

        // ── Categories ──────────────────────────────────────────────────
        $categories = [
            ['name' => 'Food',          'description' => 'Fresh and dry food products',         'color' => '#f97316', 'icon' => 'utensils'],
            ['name' => 'Beverages',     'description' => 'Drinks, juices, water, coffee, tea',  'color' => '#3b82f6', 'icon' => 'coffee'],
            ['name' => 'Cleaning',      'description' => 'Cleaning and hygiene supplies',        'color' => '#10b981', 'icon' => 'sparkles'],
            ['name' => 'Kitchen',       'description' => 'Kitchen tools and consumables',        'color' => '#8b5cf6', 'icon' => 'chef-hat'],
            ['name' => 'Room Service',  'description' => 'Guest room amenities and supplies',   'color' => '#ec4899', 'icon' => 'bed'],
            ['name' => 'Linen & Towels','description' => 'Bed linen, towels, bathrobes',        'color' => '#06b6d4', 'icon' => 'layers'],
            ['name' => 'Maintenance',   'description' => 'Maintenance and repair supplies',     'color' => '#84cc16', 'icon' => 'wrench'],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['name']] = Category::firstOrCreate(['name' => $cat['name']], $cat);
        }

        // ── Products ────────────────────────────────────────────────────
        $products = [
            // Food
            ['name' => 'Basmati Rice (25kg)',         'category' => 'Food',          'quantity' => 40,  'minimum_stock' => 10, 'unit_price' => 85.00,  'supplier' => 'Al Baraka Foods',   'entry_date' => '2024-11-01', 'expiration_date' => '2025-11-01', 'status' => 'in_stock'],
            ['name' => 'All-Purpose Flour (50kg)',     'category' => 'Food',          'quantity' => 3,   'minimum_stock' => 8,  'unit_price' => 120.00, 'supplier' => 'Al Baraka Foods',   'entry_date' => '2024-11-05', 'expiration_date' => '2025-06-05', 'status' => 'low_stock'],
            ['name' => 'Olive Oil Extra Virgin (5L)',  'category' => 'Food',          'quantity' => 0,   'minimum_stock' => 5,  'unit_price' => 210.00, 'supplier' => 'Mediterranean Co.', 'entry_date' => '2024-10-15', 'expiration_date' => '2026-10-15','status' => 'out_of_stock'],
            ['name' => 'Sugar (25kg bags)',            'category' => 'Food',          'quantity' => 20,  'minimum_stock' => 5,  'unit_price' => 70.00,  'supplier' => 'Al Baraka Foods',   'entry_date' => '2024-11-10', 'expiration_date' => null,          'status' => 'in_stock'],
            ['name' => 'Tomato Paste (400g cans)',     'category' => 'Food',          'quantity' => 4,   'minimum_stock' => 10, 'unit_price' => 12.50,  'supplier' => 'Maroc Conserves',   'entry_date' => '2024-10-20', 'expiration_date' => '2026-10-20','status' => 'low_stock'],

            // Beverages
            ['name' => 'Still Water (1.5L × 12)',     'category' => 'Beverages',     'quantity' => 150, 'minimum_stock' => 30, 'unit_price' => 28.00,  'supplier' => 'Sidi Ali',          'entry_date' => '2024-11-12', 'expiration_date' => '2026-01-12','status' => 'in_stock'],
            ['name' => 'Orange Juice (1L Tetra Pak)', 'category' => 'Beverages',     'quantity' => 60,  'minimum_stock' => 20, 'unit_price' => 18.00,  'supplier' => 'Centrale Laitière', 'entry_date' => '2024-11-10', 'expiration_date' => '2025-02-10','status' => 'in_stock'],
            ['name' => 'Nespresso Capsules (box 50)', 'category' => 'Beverages',     'quantity' => 2,   'minimum_stock' => 5,  'unit_price' => 185.00, 'supplier' => 'Nespresso MA',      'entry_date' => '2024-11-01', 'expiration_date' => '2026-11-01','status' => 'low_stock'],
            ['name' => 'Premium Tea Bags (200pk)',    'category' => 'Beverages',     'quantity' => 18,  'minimum_stock' => 5,  'unit_price' => 95.00,  'supplier' => 'Lipton Maroc',      'entry_date' => '2024-10-01', 'expiration_date' => '2025-10-01','status' => 'in_stock'],
            ['name' => 'Sparkling Water (330ml×24)',  'category' => 'Beverages',     'quantity' => 0,   'minimum_stock' => 20, 'unit_price' => 65.00,  'supplier' => 'Sidi Ali',          'entry_date' => '2024-09-15', 'expiration_date' => '2025-09-15','status' => 'out_of_stock'],

            // Cleaning
            ['name' => 'Multi-Surface Disinfectant (5L)', 'category' => 'Cleaning', 'quantity' => 25,  'minimum_stock' => 8,  'unit_price' => 75.00,  'supplier' => 'CleanPro MA',       'entry_date' => '2024-11-05', 'expiration_date' => '2026-11-05','status' => 'in_stock'],
            ['name' => 'Laundry Detergent (10kg)',    'category' => 'Cleaning',      'quantity' => 3,   'minimum_stock' => 4,  'unit_price' => 180.00, 'supplier' => 'CleanPro MA',       'entry_date' => '2024-10-20', 'expiration_date' => null,          'status' => 'low_stock'],
            ['name' => 'Toilet Cleaner (1L × 12)',    'category' => 'Cleaning',      'quantity' => 30,  'minimum_stock' => 6,  'unit_price' => 22.00,  'supplier' => 'Henkel Maroc',      'entry_date' => '2024-11-08', 'expiration_date' => '2026-11-08','status' => 'in_stock'],
            ['name' => 'Floor Mop Heads (pack 10)',   'category' => 'Cleaning',      'quantity' => 0,   'minimum_stock' => 3,  'unit_price' => 45.00,  'supplier' => 'ProClean Supply',   'entry_date' => '2024-09-01', 'expiration_date' => null,          'status' => 'out_of_stock'],
            ['name' => 'Trash Bags (100L × 50)',      'category' => 'Cleaning',      'quantity' => 12,  'minimum_stock' => 5,  'unit_price' => 38.00,  'supplier' => 'CleanPro MA',       'entry_date' => '2024-11-11', 'expiration_date' => null,          'status' => 'in_stock'],

            // Kitchen
            ['name' => 'Chef Gloves (box 100)',       'category' => 'Kitchen',       'quantity' => 8,   'minimum_stock' => 3,  'unit_price' => 65.00,  'supplier' => 'SafeKitchen Pro',   'entry_date' => '2024-11-01', 'expiration_date' => null,          'status' => 'in_stock'],
            ['name' => 'Aluminum Foil Roll (45m)',    'category' => 'Kitchen',       'quantity' => 1,   'minimum_stock' => 5,  'unit_price' => 28.00,  'supplier' => 'PackMaroc',         'entry_date' => '2024-10-15', 'expiration_date' => null,          'status' => 'low_stock'],
            ['name' => 'Baking Paper (50m roll)',     'category' => 'Kitchen',       'quantity' => 15,  'minimum_stock' => 4,  'unit_price' => 35.00,  'supplier' => 'PackMaroc',         'entry_date' => '2024-11-05', 'expiration_date' => null,          'status' => 'in_stock'],

            // Room Service
            ['name' => 'Minibar Soap (60g × 100)',   'category' => 'Room Service',  'quantity' => 500, 'minimum_stock' => 100,'unit_price' => 3.50,   'supplier' => 'Hospitality Essentials','entry_date' => '2024-11-01', 'expiration_date' => '2026-11-01','status' => 'in_stock'],
            ['name' => 'Shampoo Miniatures (30ml×200)','category' => 'Room Service','quantity' => 80,  'minimum_stock' => 100,'unit_price' => 6.00,   'supplier' => 'Hospitality Essentials','entry_date' => '2024-10-10', 'expiration_date' => '2026-10-10','status' => 'low_stock'],
            ['name' => 'Dental Kit Sets (×100)',      'category' => 'Room Service',  'quantity' => 0,   'minimum_stock' => 50, 'unit_price' => 8.50,   'supplier' => 'HotelAmenities.ma', 'entry_date' => '2024-09-20', 'expiration_date' => '2026-09-20','status' => 'out_of_stock'],
            ['name' => 'Writing Pads (A5 × 200)',     'category' => 'Room Service',  'quantity' => 120, 'minimum_stock' => 50, 'unit_price' => 4.00,   'supplier' => 'PrintMaroc',        'entry_date' => '2024-11-02', 'expiration_date' => null,          'status' => 'in_stock'],
            ['name' => 'Branded Pens (box 500)',      'category' => 'Room Service',  'quantity' => 300, 'minimum_stock' => 100,'unit_price' => 1.20,   'supplier' => 'PrintMaroc',        'entry_date' => '2024-10-25', 'expiration_date' => null,          'status' => 'in_stock'],

            // Linen
            ['name' => 'White Bed Sheets (King 200TC)','category'=> 'Linen & Towels','quantity' => 45, 'minimum_stock' => 20, 'unit_price' => 280.00, 'supplier' => 'LinenLux MA',       'entry_date' => '2024-10-01', 'expiration_date' => null,          'status' => 'in_stock'],
            ['name' => 'Bath Towels (600gsm)',        'category' => 'Linen & Towels','quantity' => 3,  'minimum_stock' => 30, 'unit_price' => 95.00,  'supplier' => 'LinenLux MA',       'entry_date' => '2024-08-15', 'expiration_date' => null,          'status' => 'low_stock'],
            ['name' => 'Pillow Covers (set of 10)',   'category' => 'Linen & Towels','quantity' => 60, 'minimum_stock' => 20, 'unit_price' => 120.00, 'supplier' => 'LinenLux MA',       'entry_date' => '2024-10-20', 'expiration_date' => null,          'status' => 'in_stock'],

            // Maintenance
            ['name' => 'LED Bulbs E27 (box 20)',      'category' => 'Maintenance',   'quantity' => 40,  'minimum_stock' => 10, 'unit_price' => 35.00,  'supplier' => 'TechSupply MA',     'entry_date' => '2024-11-01', 'expiration_date' => null,          'status' => 'in_stock'],
            ['name' => 'WD-40 Spray (500ml × 6)',     'category' => 'Maintenance',   'quantity' => 2,   'minimum_stock' => 3,  'unit_price' => 85.00,  'supplier' => 'TechSupply MA',     'entry_date' => '2024-09-10', 'expiration_date' => null,          'status' => 'low_stock'],
        ];

        foreach ($products as $p) {
            $cat = $categoryModels[$p['category']];
            Product::firstOrCreate(
                ['name' => $p['name']],
                [
                    'category_id'     => $cat->id,
                    'quantity'        => $p['quantity'],
                    'minimum_stock'   => $p['minimum_stock'],
                    'unit_price'      => $p['unit_price'],
                    'supplier'        => $p['supplier'],
                    'entry_date'      => $p['entry_date'],
                    'expiration_date' => $p['expiration_date'],
                    'status'          => $p['status'],
                ]
            );
        }

        // ── Activity logs ───────────────────────────────────────────────
        $logs = [
            ['action' => 'created', 'description' => 'Added product: Basmati Rice (25kg)'],
            ['action' => 'updated', 'description' => 'Updated quantity for Still Water (1.5L × 12)'],
            ['action' => 'deleted', 'description' => 'Removed expired batch: Orange Juice'],
            ['action' => 'created', 'description' => 'Added product: LED Bulbs E27 (box 20)'],
            ['action' => 'updated', 'description' => 'Updated stock: Bath Towels (600gsm) — flagged low stock'],
            ['action' => 'created', 'description' => 'Added new category: Maintenance'],
            ['action' => 'updated', 'description' => 'Updated supplier info: All-Purpose Flour (50kg)'],
        ];

        foreach ($logs as $log) {
            ActivityLog::firstOrCreate(
                ['description' => $log['description']],
                ['action' => $log['action'], 'user_id' => $admin->id]
            );
        }
    }
}