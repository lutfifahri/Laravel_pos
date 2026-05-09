<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardService
{
    public function getDashboardData()
    {
        $totalRevenue = (float) Order::where('status', 'Sudah Dibayar')->sum('total_harga');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalUsers = User::count();

        $startDate = Carbon::now()->startOfDay()->subDays(6);
        $endDate = Carbon::now()->endOfDay();

        $salesData = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_harga) as total')
        )
        ->whereBetween('created_at', [$startDate, $endDate])
        ->groupBy('date')
        ->orderBy('date', 'ASC')
        ->get();

        $formattedChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dayName = Carbon::now()->subDays($i)->format('D');
            
            $found = $salesData->firstWhere('date', $date);
            
            $formattedChartData[] = [
                'name' => $dayName,
                'total' => $found ? (int) $found->total : 0
            ];
        }

        $topProducts = DB::table('order_items')
            ->select('product_name', DB::raw('SUM(qty) as total_qty'), DB::raw('SUM(total_price) as total_revenue'))
            ->groupBy('product_name')
            ->orderBy('total_qty', 'DESC')
            ->limit(5)
            ->get();

        return [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalUsers' => $totalUsers,
            ],
            'chartData' => $formattedChartData,
            'topProducts' => $topProducts,
        ];
    }
}
