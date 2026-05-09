import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

interface Product {
    id: number;
    nama: string;
    harga: number;
}

interface Customer {
    id: number;
    nama: string;
}

interface Props {
    customers: Customer[];
    products: Product[];
    next_code: string;
}

export default function OrderCreate({ customers, products, next_code }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        items: [{ product_id: '', qty: 1, price: 0, total_price: 0 }],
    });

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', qty: 1, price: 0, total_price: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        (newItems[index] as any)[field] = value;

        if (field === 'product_id') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                newItems[index].price = product.harga;
                newItems[index].total_price = product.harga * newItems[index].qty;
            }
        }

        if (field === 'qty') {
            newItems[index].total_price = newItems[index].price * parseInt(value || 0);
        }

        setData('items', newItems);
    };

    const calculateTotal = () => {
        return data.items.reduce((sum, item) => {
            const totalPrice = parseFloat(item.total_price as any) || 0;
            return sum + totalPrice;
        }, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Tambah Penjualan
                    </h2>
                </div>
            }
        >
            <Head title="Tambah Penjualan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Penjualan</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Kode Penjualan (Auto)</Label>
                                    <Input value={next_code} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customer_id">Customer</Label>
                                    <select
                                        id="customer_id"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.customer_id}
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Customer</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.nama}</option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <p className="text-sm text-red-500">{errors.customer_id}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Item Produk</CardTitle>
                                <Button type="button" onClick={addItem} variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" /> Tambah Item
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="grid items-end gap-4 md:grid-cols-12 border-b pb-4 last:border-0 last:pb-0">
                                            <div className="md:col-span-5 space-y-2">
                                                <Label>Produk</Label>
                                                <select
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    value={item.product_id}
                                                    onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Pilih Produk</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.nama} - Rp {new Intl.NumberFormat('id-ID').format(p.harga)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label>Qty</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.qty}
                                                    onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label>Harga</Label>
                                                <Input value={new Intl.NumberFormat('id-ID').format(item.price)} disabled />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label>Subtotal</Label>
                                                <Input value={new Intl.NumberFormat('id-ID').format(item.total_price)} disabled />
                                            </div>
                                            <div className="md:col-span-1">
                                                {data.items.length > 1 && (
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-end border-t pt-6">
                                    <div className="text-right space-y-1">
                                        <p className="text-sm text-muted-foreground">Total Keseluruhan</p>
                                        <p className="text-3xl font-bold">Rp {new Intl.NumberFormat('id-ID').format(calculateTotal())}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Penjualan</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
