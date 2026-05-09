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
    Shield,
    CheckSquare,
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
import { Badge } from '@/Components/ui/badge';
import { Checkbox } from '@/Components/ui/checkbox';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    roles: Role[];
    permissions: Permission[];
}

export default function RoleIndex({ roles, permissions }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    // Modal Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    const { data, setData, post, put, reset, processing, errors, clearErrors } = useForm({
        name: '',
        permissions: [] as string[],
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
            header: 'Nama Role',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center border shadow-sm">
                        <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-black tracking-tight uppercase text-xs">{row.getValue('name')}</span>
                </div>
            ),
        },
        {
            id: 'permissions',
            header: 'Hak Akses',
            cell: ({ row }: any) => {
                const perms = row.original.permissions || [];
                return (
                    <div className="flex flex-wrap gap-1 max-w-[400px]">
                        {perms.map((p: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="capitalize text-[8px] font-bold py-0 h-4 bg-muted/30">
                                {p.name.replace('-', ' ')}
                            </Badge>
                        ))}
                        {perms.length === 0 && <span className="text-[10px] text-muted-foreground italic">Tanpa akses khusus</span>}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }: any) => {
                const role = row.original;
                return (
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600"
                            onClick={() => openEditModal(role)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600 text-destructive"
                            onClick={() => openDeleteConfirm(role.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ], []);

    const table = useReactTable({
        data: roles,
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
        setEditingRole(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (role: Role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            permissions: role.permissions.map(p => p.name),
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const togglePermission = (permName: string) => {
        const current = [...data.permissions];
        const index = current.indexOf(permName);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(permName);
        }
        setData('permissions', current);
    };

    const openDeleteConfirm = (id: number) => {
        setRoleToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!roleToDelete) return;
        setIsProcessingDelete(true);
        router.delete(route('master.roles.destroy', roleToDelete), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setRoleToDelete(null);
                setIsProcessingDelete(false);
            },
            onError: () => setIsProcessingDelete(false)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            put(route('master.roles.update', editingRole.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('master.roles.store'), {
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
                            MANAJEMEN ROLE
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Atur tingkat otoritas akses sistem</p>
                    </div>
                    <Button 
                        onClick={openCreateModal}
                        className="h-11 px-6 font-black uppercase tracking-tighter shadow-lg shadow-primary/25 rounded-xl"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Role Baru
                    </Button>
                </div>
            }
        >
            <Head title="Manajemen Role" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="border-none shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-md overflow-hidden rounded-2xl">
                        <CardHeader className="bg-muted/30 border-b pb-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Cari role..."
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
                                                    Belum ada data role.
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
                <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">
                            {editingRole ? 'Edit Role' : 'Role Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Tentukan nama role dan set permissions-nya.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 py-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-[10px] uppercase font-black text-muted-foreground">Nama Role</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="CONTOH: KASIR_SENIOR"
                                    className="rounded-xl h-11 font-black uppercase tracking-widest"
                                />
                                {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-1">
                                    <CheckSquare className="h-3 w-3" /> Berikan Permissions
                                </Label>
                                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/30 border max-h-[200px] overflow-y-auto">
                                    {permissions.map((perm) => (
                                        <div key={perm.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`perm-role-${perm.id}`} 
                                                checked={data.permissions.includes(perm.name)}
                                                onCheckedChange={() => togglePermission(perm.name)}
                                            />
                                            <Label 
                                                htmlFor={`perm-role-${perm.id}`}
                                                className="text-xs font-bold capitalize cursor-pointer"
                                            >
                                                {perm.name.replace('-', ' ')}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing} className="w-full h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20 rounded-xl">
                                {editingRole ? 'Perbarui Role' : 'Buat Role'}
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
                title="Hapus Role?"
                description="Menghapus role akan mencabut semua akses dari user yang menggunakan role ini."
            />
        </AuthenticatedLayout>
    );
}
