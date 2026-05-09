import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Payment {
    id: number;
    kode: string;
    amount: number;
    method: string;
    paid_at: string;
    user: { name: string };
    order: {
        kode: string;
        customer: { nama: string };
        total_harga: number;
    };
}

interface Props {
    payment: Payment;
}

export default function PaymentShow({ payment }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Detail Pembayaran: {payment.kode}
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Pembayaran ${payment.kode}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Card className="overflow-hidden">
                        <div className="bg-primary p-6 text-primary-foreground flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80 uppercase tracking-widest">Kwitansi Pembayaran</p>
                                <h3 className="text-2xl font-bold">{payment.kode}</h3>
                            </div>
                            <CheckCircle2 className="h-12 w-12 opacity-20" />
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Dibayar Untuk</p>
                                        <p className="font-bold text-lg">{payment.order?.kode}</p>
                                        <p className="text-sm">{payment.order?.customer?.nama}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Metode Pembayaran</p>
                                        <p className="font-medium capitalize">{payment.method.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-right">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Jumlah Pembayaran</p>
                                        <p className="text-3xl font-black">Rp {new Intl.NumberFormat('id-ID').format(payment.amount)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Tanggal Bayar</p>
                                        <p className="font-medium">{new Date(payment.paid_at).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-dashed pt-8 flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Penerima</p>
                                    <p className="font-medium">{payment.user?.name}</p>
                                </div>
                                <div className="text-center w-32 border-t pt-2 border-gray-300">
                                    <p className="text-[10px] text-muted-foreground uppercase">Tanda Tangan</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
