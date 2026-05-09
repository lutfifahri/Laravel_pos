<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Services\PaymentService;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index(Request $request)
    {
        return Inertia::render('Payment/Index', [
            'payments' => $this->paymentService->getAllPayments($request->all()),
            'filters' => $request->only(['start_date', 'end_date']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Payment/Create', [
            'orders' => Order::where('status', 'Belum Dibayar')->with('customer')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method' => 'required|in:cash,credit_card,bank_transfer',
            'amount' => 'required|numeric|min:0',
        ]);

        try {
            $this->paymentService->createPayment($request->all());
            return redirect()->route('payments.index')->with('success', 'Pembayaran berhasil diproses.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memproses pembayaran: ' . $e->getMessage()]);
        }
    }

    public function destroy(Payment $payment)
    {
        try {
            $this->paymentService->deletePayment($payment);
            return redirect()->route('payments.index')->with('success', 'Pembayaran berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus pembayaran: ' . $e->getMessage()]);
        }
    }
}
