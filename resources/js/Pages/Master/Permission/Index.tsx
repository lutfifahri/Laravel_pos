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
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Key,
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

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: Permission[];
}

export default function PermissionIndex({ permissions }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

    // Modal Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    const { data, setData, post, put, reset, processing, errors, clearErrors } = useForm({
        name: '',
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
            accessorKey: 'name',
            header: 'Nama Permission',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center border shadow-sm">
                        <Key className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-bold tracking-tight lowercase text-sm">{row.getValue('name')}</span>
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }: any) => {
                const permission = row.original;
                return (
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600"
                            onClick={() => openEditModal(permission)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600 text-destructive"
                            onClick={() => openDeleteConfirm(permission.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ], []);

    const table = useReactTable({
        data: permissions,
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
        setEditingPermission(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (permission: Permission) => {
        setEditingPermission(permission);
        setData({
            name: permission.name,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (id: number) => {
        setPermissionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!permissionToDelete) return;
        setIsProcessingDelete(true);
        router.delete(route('master.permissions.destroy', permissionToDelete), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setPermissionToDelete(null);
                setIsProcessingDelete(false);
            },
            onError: () => setIsProcessingDelete(false)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPermission) {
            put(route('master.permissions.update', editingPermission.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('master.permissions.store'), {
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
                            MASTER PERMISSION
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Daftar kunci akses teknis sistem</p>
                    </div>
                    <Button 
                        onClick={openCreateModal}
                        className="h-11 px-6 font-black uppercase tracking-tighter shadow-lg shadow-primary/25 rounded-xl"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Permission Baru
                    </Button>
                </div>
            }
        >
            <Head title="Master Permission" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="border-none shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-md overflow-hidden rounded-2xl">
                        <CardHeader className="bg-muted/30 border-b pb-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Cari permission..."
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
                                                    Belum ada data permission.
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
                            {editingPermission ? 'Edit Permission' : 'Permission Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Gunakan format lowercase dan tanpa spasi (slug).
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5 py-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-[10px] uppercase font-black text-muted-foreground">Slug Permission</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value.toLowerCase().replace(' ', '-'))}
                                    required
                                    placeholder="contoh: edit-transaksi"
                                    className="rounded-xl h-11 font-bold lowercase"
                                />
                                {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing} className="w-full h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20 rounded-xl">
                                {editingPermission ? 'Simpan Perubahan' : 'Tambah Permission'}
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
                title="Hapus Permission?"
                description="Menghapus permission akan mencabut hak akses ini dari semua Role dan User yang menggunakannya."
            />
        </AuthenticatedLayout>
    );
}
