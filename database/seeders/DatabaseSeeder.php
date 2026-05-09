<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call Permission Seeder
        $this->call(PermissionSeeder::class);

        // Create Roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Give all permissions to admin
        $adminRole->syncPermissions(\Spatie\Permission\Models\Permission::all());

        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole($adminRole);

        // Create 50 Users
        User::factory(50)->create()->each(function ($user) use ($userRole) {
            $user->assignRole($userRole);
        });

        // Create 50 Customers
        Customer::factory(50)->create();

        // Create 50 Products
        Product::factory(50)->create();

        // Create 50 Orders with Items and Payments
        $customers = Customer::all();
        $products = Product::all();
        $users = User::all();

        for ($i = 0; $i < 50; $i++) {
            $order = Order::create([
                'kode' => 'ORD-' . strtoupper(Str::random(6)),
                'customer_id' => $customers->random()->id,
                'created_by' => $users->random()->id,
                'harga' => 0,
                'total_harga' => 0,
                'status' => 'Sudah Dibayar',
            ]);

            $total = 0;
            $itemsCount = rand(1, 5);
            for ($j = 0; $j < $itemsCount; $j++) {
                $product = $products->random();
                $qty = rand(1, 3);
                $price = $product->harga;
                $subtotal = $qty * $price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->nama,
                    'qty' => $qty,
                    'price' => $price,
                    'total_price' => $subtotal,
                ]);

                $total += $subtotal;
            }

            $order->update([
                'harga' => $total,
                'total_harga' => $total,
            ]);

            // Create Payment for this order
            Payment::create([
                'kode' => 'PAY-' . strtoupper(Str::random(6)),
                'order_id' => $order->id,
                'method' => collect(['cash', 'credit_card', 'bank_transfer'])->random(),
                'amount' => $total,
                'status' => 'completed',
                'user_id' => $order->created_by,
                'paid_at' => now(),
            ]);
        }
    }
}
