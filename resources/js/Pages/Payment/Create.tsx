import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { CurrencyInput } from '@/Components/CurrencyInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Order {
    id: number;
    kode: string;
    total_harga: number;
    remaining_balance: number;
    customer: { nama: string };
}

interface Props {
    orders: Order[];
    next_code: string;
}

export default function PaymentCreate({ orders, next_code }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        order_id: '',
        method: 'cash',
        amount: 0,
    });

    const handleOrderChange = (id: string) => {
        setData('order_id', id);
        const order = orders.find(o => o.id === parseInt(id));
        if (order) {
            setData('amount', order.remaining_balance);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Tambah Pembayaran
                    </h2>
                </div>
            }
        >
            <Head title="Tambah Pembayaran" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Kode Pembayaran (Auto)</Label>
                                    <Input value={next_code} disabled />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="order_id">Pilih Penjualan (Belum Dibayar)</Label>
                                    <select
                                        id="order_id"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.order_id}
                                        onChange={(e) => handleOrderChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Penjualan</option>
                                        {orders.map(o => (
                                            <option key={o.id} value={o.id}>
                                                {o.kode} - {o.customer?.nama} (Sisa: Rp {new Intl.NumberFormat('id-ID').format(o.remaining_balance)})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.order_id && <p className="text-sm text-red-500">{errors.order_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="method">Metode Pembayaran</Label>
                                    <select
                                        id="method"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.method}
                                        onChange={(e) => setData('method', e.target.value)}
                                        required
                                    >
                                        <option value="cash">Tunai (Cash)</option>
                                        <option value="bank_transfer">Transfer Bank</option>
                                        <option value="credit_card">Kartu Kredit</option>
                                        <option value="e-wallet">E-Wallet</option>
                                    </select>
                                    {errors.method && <p className="text-sm text-red-500">{errors.method}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Jumlah Bayar</Label>
                                    <CurrencyInput
                                        id="amount"
                                        value={data.amount}
                                        onChange={(val) => setData('amount', val)}
                                        required
                                    />
                                    {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                                </div>

                                <div className="flex justify-end gap-4 pt-6">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Batal</Button>
                                    <Button type="submit" disabled={processing}>Submit Pembayaran</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
