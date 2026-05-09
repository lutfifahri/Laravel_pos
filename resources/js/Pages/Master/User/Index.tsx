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
    User as UserIcon,
    Shield,
    ChevronLeft,
    ChevronRight,
    Mail,
    Lock,
    CheckSquare
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

interface User {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
    permissions: { name: string }[];
}

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface Props {
    users: User[];
    roles: Role[];
    permissions: Permission[];
}

export default function UserIndex({ users, roles, permissions }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Modal Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    const { data, setData, post, put, reset, processing, errors, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
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
            header: 'Nama User',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border shadow-sm">
                        <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{row.getValue('name')}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">System Account</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="text-xs font-semibold">{row.getValue('email')}</span>
                </div>
            ),
        },
        {
            id: 'access',
            header: 'Akses',
            cell: ({ row }: any) => {
                const userRoles = row.original.roles || [];
                const userPermissions = row.original.permissions || [];
                return (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {userRoles.map((role: any, idx: number) => (
                            <Badge key={idx} variant="default" className="capitalize font-black text-[9px] py-0 px-2 h-5 tracking-widest bg-primary text-primary-foreground">
                                {role.name}
                            </Badge>
                        ))}
                        {userPermissions.map((perm: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="capitalize font-bold text-[9px] py-0 px-2 h-5 bg-muted/50">
                                {perm.name.replace('-', ' ')}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }: any) => {
                const user = row.original;
                return (
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600"
                            onClick={() => openEditModal(user)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600 text-destructive"
                            onClick={() => openDeleteConfirm(user.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ], []);

    const table = useReactTable({
        data: users,
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
        setEditingUser(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.roles[0]?.name || '',
            permissions: user.permissions.map(p => p.name),
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
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        setIsProcessingDelete(true);
        router.delete(route('master.users.destroy', userToDelete), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
                setIsProcessingDelete(false);
            },
            onError: () => setIsProcessingDelete(false)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(route('master.users.update', editingUser.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('master.users.store'), {
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
                            MANAJEMEN USER
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Kelola akun dan hak akses tim anda</p>
                    </div>
                    <Button 
                        onClick={openCreateModal}
                        className="h-11 px-6 font-black uppercase tracking-tighter shadow-lg shadow-primary/25 rounded-xl"
                    >
                        <Plus className="mr-2 h-5 w-5" /> User Baru
                    </Button>
                </div>
            }
        >
            <Head title="Manajemen User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="border-none shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-md overflow-hidden rounded-2xl">
                        <CardHeader className="bg-muted/30 border-b pb-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Cari user..."
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
                                                    Belum ada data user.
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
                            {editingUser ? 'Edit User' : 'User Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Atur identitas dan hak akses akun di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5 py-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[10px] uppercase font-black text-muted-foreground">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className="rounded-xl h-10 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] uppercase font-black text-muted-foreground">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        className="rounded-xl h-10"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[10px] uppercase font-black text-muted-foreground">Password {editingUser && '(Opsional)'}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={!editingUser}
                                    className="rounded-xl h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-1">
                                    <Shield className="h-3 w-3" /> Pilih Role Utama
                                </Label>
                                <select
                                    id="role"
                                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-bold capitalize"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-1">
                                    <CheckSquare className="h-3 w-3" /> Tambahan Permission
                                </Label>
                                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/30 border max-h-[150px] overflow-y-auto">
                                    {permissions.map((perm) => (
                                        <div key={perm.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`perm-${perm.id}`} 
                                                checked={data.permissions.includes(perm.name)}
                                                onCheckedChange={() => togglePermission(perm.name)}
                                            />
                                            <Label 
                                                htmlFor={`perm-${perm.id}`}
                                                className="text-xs font-bold capitalize cursor-pointer"
                                            >
                                                {perm.name.replace('-', ' ')}
                                            </Label>
                                        </div>
                                    ))}
                                    {permissions.length === 0 && (
                                        <p className="text-[10px] text-muted-foreground italic col-span-2">Belum ada permission tersedia.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing} className="w-full h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20 rounded-xl">
                                {editingUser ? 'Perbarui Akses' : 'Buat Akun'}
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
                title="Hapus User?"
                description="Akun ini akan kehilangan semua hak akses ke sistem."
            />
        </AuthenticatedLayout>
    );
}
