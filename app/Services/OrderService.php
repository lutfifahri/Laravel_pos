<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function getAllOrders($filters = [])
    {
        $query = Order::with(['customer', 'creator', 'items.product'])->orderBy('created_at', 'desc');

        if (isset($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        return $query->get();
    }

    public function createOrder($data)
    {
        return DB::transaction(function () use ($data) {
            $order = Order::create([
                'kode' => 'ORD-' . strtoupper(Str::random(6)),
                'customer_id' => $data['customer_id'],
                'created_by' => auth()->id(),
                'harga' => 0,
                'total_harga' => 0,
                'status' => 'Belum Dibayar',
            ]);

            $total_harga = 0;
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->harga * $item['qty'];
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->nama,
                    'qty' => $item['qty'],
                    'price' => $product->harga,
                    'total_price' => $subtotal,
                ]);

                $total_harga += $subtotal;
            }

            $order->update([
                'harga' => $total_harga,
                'total_harga' => $total_harga,
            ]);

            return $order;
        });
    }

    public function updateOrder(Order $order, $data)
    {
        return DB::transaction(function () use ($order, $data) {
            $order->items()->delete();

            $total_harga = 0;
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->harga * $item['qty'];
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->nama,
                    'qty' => $item['qty'],
                    'price' => $product->harga,
                    'total_price' => $subtotal,
                ]);

                $total_harga += $subtotal;
            }

            $order->update([
                'customer_id' => $data['customer_id'],
                'harga' => $total_harga,
                'total_harga' => $total_harga,
            ]);

            return $order;
        });
    }

    public function deleteOrder(Order $order)
    {
        return DB::transaction(function () use ($order) {
            $order->items()->delete();
            return $order->delete();
        });
    }
}
