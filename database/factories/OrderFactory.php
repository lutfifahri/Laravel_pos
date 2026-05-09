<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'created_by' => User::factory(),
            'harga' => 0, // Will be updated based on items
            'total_harga' => 0, // Will be updated based on items
        ];
    }
}
