import React, { useState, useMemo, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    Search,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Image as ImageIcon,
    FilterX,
    CreditCard
} from 'lucide-react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
} from '@tanstack/react-table';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';

interface Payment {
    id: number;
    kode: string;
    order: { 
        kode: string;
        customer: { nama: string };
        items: {
            product_name: string;
            product?: { image: string | null };
        }[];
    };
    user: { name: string };
    amount: number;
    method: string;
    paid_at: string;
    created_at: string;
}

interface Props {
    payments: Payment[];
    filters: {
        start_date?: string;
        end_date?: string;
    };
}

export default function PaymentIndex({ payments, filters }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    // Modal Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    // Auto-reload on date change
    useEffect(() => {
        if (startDate !== (filters.start_date || '') || endDate !== (filters.end_date || '')) {
            const timeoutId = setTimeout(() => {
                router.get(route('payments.index'), {
                    start_date: startDate,
                    end_date: endDate,
                }, { 
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [startDate, endDate]);

    const columns = useMemo(() => [
        {
            id: 'no',
            header: 'No.',
            cell: ({ row, table }: any) => {
                const { pageIndex, pageSize } = table.getState().pagination;
                return (
                    <span className="text-[10px] font-black text-muted-foreground/50">
                        {pageIndex * pageSize + row.index + 1}
                    </span>
                );
            },
        },
        {
            id: 'products',
            header: 'Produk',
            cell: ({ row }: any) => {
                const items = row.original.order?.items || [];
                return (
                    <div className="flex -space-x-3 overflow-hidden p-1">
                        {items.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="inline-block h-10 w-10 rounded-xl ring-2 ring-background bg-muted overflow-hidden border shadow-sm transition-transform hover:translate-y-[-2px] hover:z-10">
                                {item.product?.image ? (
                                    <img src={`/storage/${item.product.image}`} alt={item.product_name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {items.length > 3 && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl ring-2 ring-background bg-primary/10 border border-primary/20 text-[11px] font-black text-primary">
                                +{items.length - 3}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'kode',
            header: 'Kode',
            cell: ({ row }: any) => <span className="font-black text-sm tracking-tight">{row.getValue('kode')}</span>,
        },
        {
            accessorKey: 'order.kode',
            header: 'Penjualan',
            cell: ({ row }: any) => (
                <div className="flex flex-col">
                    <span className="font-black text-xs text-primary">{row.original.order?.kode || '-'}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{row.original.order?.customer?.nama || 'Umum'}</span>
                </div>
            ),
        },
        {
            accessorKey: 'amount',
            header: 'Jumlah',
            cell: ({ row }: any) => {
                const amount = parseFloat(row.getValue('amount'));
                return (
                    <span className="font-black text-green-600">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                        }).format(amount)}
                    </span>
                );
            },
        },
        {
            accessorKey: 'method',
            header: 'Metode',
            cell: ({ row }: any) => {
                const method = row.getValue('method');
                return (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <CreditCard className="h-3 w-3" />
                        {method.replace('_', ' ')}
                    </div>
                );
            }
        },
        {
            accessorKey: 'paid_at',
            header: 'Tanggal',
            cell: ({ row }: any) => (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold">{new Date(row.getValue('paid_at')).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{new Date(row.getValue('paid_at')).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }: any) => {
                const payment = row.original;
                return (
                    <div className="flex justify-end gap-1">
                        <Link href={route('payments.show', payment.id)}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        <Link href={route('payments.edit', payment.id)}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600 transition-colors"><Edit className="h-4 w-4" /></Button>
                        </Link>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600 transition-colors text-destructive"
                            onClick={() => openDeleteModal(payment.id)} 
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ], [filters]);

    const table = useReactTable({
        data: payments,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const openDeleteModal = (id: number) => {
        setPaymentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!paymentToDelete) return;
        
        setIsProcessingDelete(true);
        router.delete(route('payments.destroy', paymentToDelete), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setPaymentToDelete(null);
                setIsProcessingDelete(false);
            },
            onError: () => {
                setIsProcessingDelete(false);
            }
        });
    };

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        router.get(route('payments.index'), {}, { replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">
                            PEMBAYARAN
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Catatan arus kas masuk anda</p>
                    </div>
                    <Link href={route('payments.create')}>
                        <Button className="h-11 px-6 font-black uppercase tracking-tighter shadow-lg shadow-green-500/25 rounded-xl bg-green-600 hover:bg-green-700">
                            <Plus className="mr-2 h-5 w-5" /> Terima Bayar
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Pembayaran" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="border-none shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-md overflow-hidden rounded-2xl">
                        <CardHeader className="bg-muted/30 border-b pb-8">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 bg-background p-1.5 rounded-xl border shadow-sm group focus-within:ring-2 ring-primary/20 transition-all">
                                        <div className="pl-2.5">
                                            <Calendar className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="h-8 border-none focus-visible:ring-0 w-36 bg-transparent text-xs font-bold"
                                        />
                                        <div className="text-muted-foreground font-black text-[10px]">—</div>
                                        <Input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="h-8 border-none focus-visible:ring-0 w-36 bg-transparent text-xs font-bold"
                                        />
                                        {(startDate || endDate) && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={resetFilters}
                                                className="h-7 w-7 rounded-lg hover:bg-red-500/10 hover:text-red-600"
                                            >
                                                <FilterX className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Cari data..."
                                            className="pl-9 h-10 w-full lg:w-64 bg-background border rounded-xl shadow-sm focus-visible:ring-primary/20 transition-all"
                                            value={globalFilter ?? ''}
                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-background border p-1 rounded-xl shadow-sm">
                                        <select
                                            value={table.getState().pagination.pageSize}
                                            onChange={e => {
                                                table.setPageSize(Number(e.target.value))
                                            }}
                                            className="h-8 text-[10px] font-black border-none bg-muted/50 rounded-lg focus:ring-0 cursor-pointer"
                                        >
                                            {[5, 10, 20, 30, 40, 50, 1000].map(pageSize => (
                                                <option key={pageSize} value={pageSize}>
                                                    {pageSize === 1000 ? 'ALL' : pageSize}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="h-4 w-[1px] bg-muted mx-1"></div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="px-3 h-8 flex items-center bg-muted/50 rounded-lg">
                                            <span className="text-[10px] font-black whitespace-nowrap">
                                                {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead key={header.id} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground py-5 px-6">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id} className="hover:bg-primary/[0.02] border-b transition-colors group">
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id} className="py-5 px-6">
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-48 text-center">
                                                    <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                                                        <FilterX className="h-10 w-10" />
                                                        <p className="text-sm font-bold uppercase tracking-widest">Tidak ada data pembayaran</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                processing={isProcessingDelete}
                title="Hapus Pembayaran?"
                description="Menghapus pembayaran akan mengembalikan status penjualan terkait menjadi 'Belum Dibayar'."
            />
        </AuthenticatedLayout>
    );
}
