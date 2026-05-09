<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Services\OrderService;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function print(Order $order)
    {
        $order->load(['customer', 'items.product', 'creator']);
        $pdf = Pdf::loadView('pdf.invoice', compact('order'));
        return $pdf->stream('Invoice-' . $order->kode . '.pdf');
    }

    public function index(Request $request)
    {
        return Inertia::render('Order/Index', [
            'orders' => $this->orderService->getAllOrders($request->all()),
            'filters' => $request->only(['start_date', 'end_date']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Order/Create', [
            'customers' => Customer::all(),
            'products' => Product::all(),
            'next_code' => 'ORD-' . strtoupper(\Illuminate\Support\Str::random(6)),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        try {
            $this->orderService->createOrder($request->all());
            return redirect()->route('orders.index')->with('success', 'Penjualan berhasil dibuat.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal membuat penjualan: ' . $e->getMessage()]);
        }
    }

    public function show(Order $order)
    {
        return Inertia::render('Order/Show', [
            'order' => $order->load(['customer', 'items.product', 'creator']),
        ]);
    }

    public function edit(Order $order)
    {
        if ($order->status === 'Sudah Dibayar') {
            return redirect()->route('orders.index')->with('error', 'Penjualan yang sudah dibayar tidak bisa diubah.');
        }

        return Inertia::render('Order/Edit', [
            'order' => $order->load('items'),
            'customers' => Customer::all(),
            'products' => Product::all(),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        if ($order->status === 'Sudah Dibayar') {
            return redirect()->route('orders.index')->with('error', 'Penjualan yang sudah dibayar tidak bisa diubah.');
        }

        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        try {
            $this->orderService->updateOrder($order, $request->all());
            return redirect()->route('orders.index')->with('success', 'Penjualan berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui penjualan: ' . $e->getMessage()]);
        }
    }

    public function destroy(Order $order)
    {
        if ($order->status === 'Sudah Dibayar') {
            return redirect()->route('orders.index')->with('error', 'Penjualan yang sudah dibayar tidak bisa dihapus.');
        }

        try {
            $this->orderService->deleteOrder($order);
            return redirect()->route('orders.index')->with('success', 'Penjualan berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus penjualan: ' . $e->getMessage()]);
        }
    }
}
