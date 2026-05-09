<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $order->kode }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.5;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
        }
        .header {
            width: 100%;
            margin-bottom: 40px;
        }
        .header td {
            vertical-align: top;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
            text-transform: uppercase;
            letter-spacing: -1px;
        }
        .invoice-title {
            text-align: right;
            font-size: 32px;
            font-weight: 900;
            color: #eee;
            text-transform: uppercase;
            margin: 0;
        }
        .info-table {
            width: 100%;
            margin-bottom: 30px;
        }
        .info-table td {
            width: 33%;
        }
        .label {
            font-size: 10px;
            font-weight: bold;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .value {
            font-weight: bold;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            text-align: left;
            padding: 12px 10px;
            font-size: 10px;
            text-transform: uppercase;
            color: #64748b;
        }
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #f1f5f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-section {
            width: 100%;
            margin-top: 20px;
        }
        .total-box {
            float: right;
            width: 250px;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
        }
        .total-row {
            margin-bottom: 10px;
        }
        .total-row:last-child {
            margin-bottom: 0;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
        }
        .grand-total {
            font-size: 18px;
            font-weight: 900;
            color: #3b82f6;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            background-color: #dcfce7;
            color: #166534;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="header">
            <tr>
                <td class="logo">
                    POS SYSTEM
                </td>
                <td class="invoice-title">
                    INVOICE
                </td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td>
                    <div class="label">Customer</div>
                    <div class="value">{{ $order->customer->nama ?? 'Umum' }}</div>
                    <div class="value" style="font-weight: normal; color: #64748b;">{{ $order->customer->phone ?? '-' }}</div>
                </td>
                <td>
                    <div class="label">Order Info</div>
                    <div class="value">#{{ $order->kode }}</div>
                    <div class="value" style="font-weight: normal; color: #64748b;">{{ $order->created_at->format('d M Y, H:i') }}</div>
                </td>
                <td class="text-right">
                    <div class="label">Status</div>
                    <div class="status-badge">{{ $order->status }}</div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Harga</th>
                    <th class="text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td style="font-weight: bold;">{{ $item->product_name }}</td>
                    <td class="text-center">{{ $item->qty }}</td>
                    <td class="text-right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    <td class="text-right" style="font-weight: bold;">Rp {{ number_format($item->total_price, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-box">
                <div class="total-row">
                    <span style="color: #64748b;">Subtotal:</span>
                    <span style="float: right;">Rp {{ number_format($order->total_harga, 0, ',', '.') }}</span>
                </div>
                <div class="total-row" style="clear: both; margin-top: 20px;">
                    <span style="font-weight: bold;">TOTAL:</span>
                    <span class="grand-total" style="float: right;">Rp {{ number_format($order->total_harga, 0, ',', '.') }}</span>
                </div>
            </div>
            <div style="clear: both;"></div>
        </div>

        <div className="footer">
            <p>Terima kasih telah berbelanja di toko kami!</p>
            <p>Invoice ini sah dan diproses secara otomatis oleh sistem.</p>
        </div>
    </div>
</body>
</html>
