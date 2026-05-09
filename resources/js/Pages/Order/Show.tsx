import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { ArrowLeft, Printer, Image as ImageIcon, MapPin, User, Calendar, CreditCard } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

interface Order {
    id: number;
    kode: string;
    customer: { nama: string; phone: string };
    creator: { name: string };
    total_harga: number;
    status: string;
    created_at: string;
    items: {
        id: number;
        product_name: string;
        qty: number;
        price: number;
        total_price: number;
        product?: { image: string | null };
    }[];
}

interface Props {
    order: Order;
}

export default function OrderShow({ order }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('orders.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                            Invoice {order.kode}
                        </h2>
                        <p className="text-xs text-muted-foreground">Detail transaksi penjualan</p>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice ${order.kode}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2 border-none shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="border-b bg-muted/20 pb-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-black uppercase tracking-tight">Rincian Item</CardTitle>
                                    <Badge variant={order.status === 'Sudah Dibayar' ? 'default' : 'secondary'} className="px-4 py-1">
                                        {order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow>
                                            <TableHead className="pl-6 w-16">Foto</TableHead>
                                            <TableHead>Nama Produk</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Harga</TableHead>
                                            <TableHead className="text-right pr-6">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-muted/10 transition-colors border-b">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="h-12 w-12 rounded-lg border bg-muted overflow-hidden">
                                                        {item.product?.image ? (
                                                            <img 
                                                                src={`/storage/${item.product.image}`} 
                                                                className="h-full w-full object-cover" 
                                                                alt={item.product_name} 
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold">{item.product_name}</TableCell>
                                                <TableCell className="text-center font-bold text-muted-foreground">{item.qty}</TableCell>
                                                <TableCell className="text-right">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</TableCell>
                                                <TableCell className="text-right pr-6 font-black text-primary">Rp {new Intl.NumberFormat('id-ID').format(item.total_price)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="p-8 bg-muted/10 border-t flex flex-col items-end space-y-2">
                                    <div className="flex justify-between w-full max-w-[250px] text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>Rp {new Intl.NumberFormat('id-ID').format(order.total_harga)}</span>
                                    </div>
                                    <div className="flex justify-between w-full max-w-[250px] pt-2 border-t font-black text-2xl">
                                        <span>TOTAL</span>
                                        <span className="text-primary">Rp {new Intl.NumberFormat('id-ID').format(order.total_harga)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 to-transparent">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                                        <User className="h-4 w-4" /> Informasi Customer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-white/20">
                                        <p className="text-xl font-black">{order.customer?.nama || 'Umum'}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                            <MapPin className="h-3 w-3" /> {order.customer?.phone || 'No Phone'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" /> Detail Order
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Waktu Transaksi</p>
                                            <p className="text-sm font-semibold">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Kasir</p>
                                            <p className="text-sm font-semibold">{order.creator?.name}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <a href={route('orders.print', order.id)} target="_blank">
                                            <Button className="w-full h-12 text-lg font-black shadow-lg shadow-primary/20">
                                                <Printer className="mr-2 h-5 w-5" /> PRINT STRUK
                                            </Button>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
