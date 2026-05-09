<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode' => 'PRD-' . $this->faker->unique()->numberBetween(1000, 9999),
            'nama' => $this->faker->word(),
            'image' => $this->faker->imageUrl(640, 480, 'products', true),
            'harga' => $this->faker->randomFloat(2, 10, 500),
        ];
    }
}
