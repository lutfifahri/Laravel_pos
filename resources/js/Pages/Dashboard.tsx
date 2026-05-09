import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
    DollarSign, 
    ShoppingCart, 
    Package, 
    Users, 
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    AreaChart, 
    Area 
} from 'recharts';

interface Props {
    stats: {
        totalRevenue: number;
        totalOrders: number;
        totalProducts: number;
        totalUsers: number;
    };
    chartData: { name: string; total: number }[];
    topProducts: { product_name: string; total_qty: number; total_revenue: number }[];
}

export default function Dashboard({ 
    stats = { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0 }, 
    chartData = [], 
    topProducts = [] 
}: Props) {
    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard Overview
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Pendapatan Total</CardTitle>
                                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{formatIDR(stats.totalRevenue)}</div>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3 text-green-600" /> 
                                    <span className="text-green-600 font-bold">+12%</span> vs last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Jumlah Penjualan</CardTitle>
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{stats.totalOrders}</div>
                                <p className="text-xs text-muted-foreground mt-1">Total completed transactions</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Produk Tersedia</CardTitle>
                                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                    <Package className="h-4 w-4 text-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{stats.totalProducts}</div>
                                <p className="text-xs text-muted-foreground mt-1">Items in active inventory</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Jumlah Pelanggan</CardTitle>
                                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                    <Users className="h-4 w-4 text-purple-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{stats.totalUsers}</div>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <ArrowDownRight className="h-3 w-3 text-red-600" /> 
                                    <span className="text-red-600 font-bold">-2%</span> vs last week
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-7">
                        {/* Sales Chart */}
                        <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden bg-white dark:bg-gray-900">
                            <CardHeader>
                                <CardTitle className="text-lg font-black flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" /> Laporan Penjualan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="h-[350px] w-full pr-4 pb-4">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.1} />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 'bold' }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 'bold' }}
                                            tickFormatter={(value) => `Rp ${value / 1000}k`}
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: any) => [formatIDR(value), 'Revenue']}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="total" 
                                            stroke="#3b82f6" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorTotal)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            </CardContent>
                        </Card>

                        {/* Top Products */}
                        <Card className="lg:col-span-3 border-none shadow-xl overflow-hidden bg-white dark:bg-gray-900">
                            <CardHeader>
                                <CardTitle className="text-lg font-black uppercase tracking-tighter">Produk Terlaris</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {topProducts.map((product, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-black text-sm border shadow-sm">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm truncate max-w-[150px]">{product.product_name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{product.total_qty} Items Sold</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-sm">{formatIDR(product.total_revenue)}</p>
                                                <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                                                    <div 
                                                        className="h-full bg-primary" 
                                                        style={{ width: `${Math.min((product.total_qty / topProducts[0].total_qty) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {topProducts.length === 0 && (
                                        <p className="text-center text-muted-foreground italic py-10">No sales data yet.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
