<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Services\CustomerService;
use Inertia\Inertia;

class CustomerController extends Controller
{
    protected $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function index()
    {
        return Inertia::render('Master/Customer/Index', [
            'customers' => $this->customerService->getAllCustomers(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $this->customerService->createCustomer($request->all());

        return redirect()->route('master.customers.index')->with('success', 'Customer berhasil dibuat.');
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $this->customerService->updateCustomer($customer, $request->all());

        return redirect()->route('master.customers.index')->with('success', 'Customer berhasil diperbarui.');
    }

    public function destroy(Customer $customer)
    {
        $this->customerService->deleteCustomer($customer);

        return redirect()->route('master.customers.index')->with('success', 'Customer berhasil dihapus.');
    }
}
