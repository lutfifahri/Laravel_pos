<?php

namespace App\Services;

use App\Models\Customer;

class CustomerService
{
    public function getAllCustomers()
    {
        return Customer::all();
    }

    public function createCustomer($data)
    {
        return Customer::create($data);
    }

    public function updateCustomer(Customer $customer, $data)
    {
        return $customer->update($data);
    }

    public function deleteCustomer(Customer $customer)
    {
        return $customer->delete();
    }
}
