import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { CurrencyInput } from '@/Components/CurrencyInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Payment {
    id: number;
    kode: string;
    amount: number;
    method: string;
    order: {
        kode: string;
        customer: { nama: string };
    };
}

interface Props {
    payment: Payment;
}

export default function PaymentEdit({ payment }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        method: payment.method,
        amount: payment.amount,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('payments.update', payment.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Edit Pembayaran: {payment.kode}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit Pembayaran ${payment.kode}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Kode Pembayaran</Label>
                                    <Input value={payment.kode} disabled />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Penjualan</Label>
                                    <Input 
                                        value={payment.order ? `${payment.order.kode} - ${payment.order.customer?.nama || 'Umum'}` : 'Data Penjualan Tidak Ditemukan'} 
                                        disabled 
                                    />
                                    <p className="text-xs text-muted-foreground italic">Penjualan yang dibayar tidak dapat diubah.</p>
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
                                    <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
