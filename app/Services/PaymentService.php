<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentService
{
    public function getAllPayments($filters = [])
    {
        $query = Payment::with(['order.customer', 'order.items.product', 'user'])->orderBy('created_at', 'desc');

        if (isset($filters['start_date']) && $filters['start_date']) {
            $query->whereDate('paid_at', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date']) && $filters['end_date']) {
            $query->whereDate('paid_at', '<=', $filters['end_date']);
        }

        return $query->get();
    }

    public function createPayment($data)
    {
        return DB::transaction(function () use ($data) {
            $payment = Payment::create([
                'kode' => 'PAY-' . strtoupper(Str::random(6)),
                'order_id' => $data['order_id'],
                'method' => $data['method'],
                'amount' => $data['amount'],
                'status' => 'completed',
                'user_id' => auth()->id(),
                'paid_at' => now(),
            ]);

            // Update order status
            $order = Order::find($data['order_id']);
            $order->update(['status' => 'Sudah Dibayar']);

            return $payment;
        });
    }

    public function deletePayment(Payment $payment)
    {
        return DB::transaction(function () use ($payment) {
            // Update order status back to unpaid
            $payment->order->update(['status' => 'Belum Dibayar']);
            return $payment->delete();
        });
    }
}
