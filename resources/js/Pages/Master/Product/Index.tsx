import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { CurrencyInput } from '@/Components/CurrencyInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight
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

interface Product {
    id: number;
    kode: string;
    nama: string;
    harga: number;
    image: string | null;
    created_at: string;
}

interface Props {
    products: Product[];
    next_code: string;
}

export default function ProductIndex({ products, next_code }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Modal Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    const { data, setData, post, reset, processing, errors, clearErrors } = useForm({
        kode: '',
        nama: '',
        harga: '',
        image: null as File | null,
    });

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
            accessorKey: 'image',
            header: 'Gambar',
            cell: ({ row }: any) => {
                const image = row.getValue('image');
                return (
                    <div className="h-12 w-12 rounded-xl border bg-muted overflow-hidden shadow-sm transition-transform hover:scale-105">
                        {image ? (
                            <img src={`/storage/${image}`} alt="Product" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
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
            accessorKey: 'nama',
            header: 'Nama Produk',
            cell: ({ row }: any) => <span className="font-semibold">{row.getValue('nama')}</span>,
        },
        {
            accessorKey: 'harga',
            header: 'Harga',
            cell: ({ row }: any) => {
                const amount = parseFloat(row.getValue('harga'));
                return (
                    <span className="font-black text-primary">
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
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }: any) => {
                const product = row.original;
                return (
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600"
                            onClick={() => openEditModal(product)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600 text-destructive"
                            onClick={() => openDeleteConfirm(product.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ], []);

    const table = useReactTable({
        data: products,
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

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setData('kode', next_code);
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setData({
            kode: product.kode,
            nama: product.nama,
            harga: product.harga.toString(),
            image: null,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (id: number) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!productToDelete) return;
        setIsProcessingDelete(true);
        router.delete(route('master.products.destroy', productToDelete), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
                setIsProcessingDelete(false);
            },
            onError: () => setIsProcessingDelete(false)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            router.post(route('master.products.update', editingProduct.id), {
                _method: 'PUT',
                ...data,
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('master.products.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">
                            MASTER PRODUK
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Kelola katalog barang dagangan anda</p>
                    </div>
                    <Button 
                        onClick={openCreateModal}
                        className="h-11 px-6 font-black uppercase tracking-tighter shadow-lg shadow-primary/25 rounded-xl"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Produk Baru
                    </Button>
                </div>
            }
        >
            <Head title="Master Produk" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="border-none shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-md overflow-hidden rounded-2xl">
                        <CardHeader className="bg-muted/30 border-b pb-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Cari produk..."
                                        className="pl-9 h-10 w-full lg:w-80 bg-background border rounded-xl shadow-sm focus-visible:ring-primary/20 transition-all"
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
                                                <TableRow key={row.id} className="hover:bg-primary/[0.02] border-b transition-colors">
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
                                                <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground italic font-bold">
                                                    Belum ada data produk.
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">
                            {editingProduct ? 'Edit Produk' : 'Produk Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi informasi produk anda di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5 py-6">
                            <div className="grid gap-2">
                                <Label htmlFor="kode" className="text-[10px] uppercase font-black text-muted-foreground">Kode Produk</Label>
                                <Input
                                    id="kode"
                                    value={data.kode}
                                    onChange={(e) => setData('kode', e.target.value)}
                                    required
                                    readOnly={!editingProduct}
                                    className={`rounded-xl h-11 font-black ${!editingProduct ? 'bg-muted cursor-not-allowed opacity-60' : ''}`}
                                />
                                {errors.kode && <p className="text-xs text-red-500 font-bold">{errors.kode}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-[10px] uppercase font-black text-muted-foreground">Nama Produk</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    required
                                    className="rounded-xl h-11 font-semibold"
                                />
                                {errors.nama && <p className="text-xs text-red-500 font-bold">{errors.nama}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="harga" className="text-[10px] uppercase font-black text-muted-foreground">Harga Jual</Label>
                                <CurrencyInput
                                    id="harga"
                                    value={data.harga}
                                    onChange={(val) => setData('harga', val)}
                                    required
                                    className="rounded-xl h-11"
                                />
                                {errors.harga && <p className="text-xs text-red-500 font-bold">{errors.harga}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="image" className="text-[10px] uppercase font-black text-muted-foreground">Gambar Produk</Label>
                                <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center hover:bg-muted/30 transition-colors cursor-pointer relative overflow-hidden">
                                    <Input
                                        id="image"
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                    />
                                    {data.image ? (
                                        <p className="text-xs font-bold text-primary truncate w-full text-center">{data.image.name}</p>
                                    ) : (
                                        <>
                                            <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Upload Foto</p>
                                        </>
                                    )}
                                </div>
                                {errors.image && <p className="text-xs text-red-500 font-bold">{errors.image}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing} className="w-full h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20 rounded-xl">
                                {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                processing={isProcessingDelete}
                title="Hapus Produk?"
                description="Produk yang dihapus tidak dapat dipulihkan. Pastikan produk tidak terkait dengan transaksi aktif."
            />
        </AuthenticatedLayout>
    );
}
