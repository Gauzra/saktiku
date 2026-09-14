// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from "../../services/Api";
import { useBusiness } from "../../context/BusinessContext"; // ← IMPORT CONTEXT
import "./dashboard.css";

function Dashboard() {
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const getFirstDayOfMonth = () => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    };
    const getLastDayOfMonth = () => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(getFirstDayOfMonth());
    const [endDate, setEndDate] = useState(getLastDayOfMonth());
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
        balance: 0, // Total Aset
        cashAndBank: 0,
        liabilities: 0,
        equity: 0,
        transactions: [],
        chartData: []
    });

    // 🔥 AMBIL BUSINESS YANG DIPILIH
    const { selectedBusiness } = useBusiness();

    useEffect(() => {
        if (selectedBusiness) {
            fetchDashboardData();
        }
    }, [startDate, endDate, selectedBusiness]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const params = {
                start_date: startDate,
                end_date: endDate,
                business_type_id: selectedBusiness.id
            };

            // Ambil data laba rugi
            const profitLossResponse = await api.get("/reports/profit-loss", { params });

            // Ambil data neraca
            const balanceSheetResponse = await api.get("/reports/balance-sheet", {
                params: {
                    as_of_date: endDate,
                    business_type_id: selectedBusiness.id
                }
            });

            // Ambil transaksi terbaru
            const transactionsResponse = await api.get("/transactions", {
                params: {
                    limit: 5,
                    business_type_id: selectedBusiness.id
                }
            });

            // Ambil data grafik
            const chartResponse = await api.get("/reports/cash-flow-chart", { params });

            setDashboardData({
                totalIncome: profitLossResponse.data.data?.totalIncome || 0,
                totalExpense: profitLossResponse.data.data?.totalExpense || 0,
                netProfit: profitLossResponse.data.data?.netProfit || 0,
                balance: balanceSheetResponse.data.data?.assets || 0,
                cashAndBank: balanceSheetResponse.data.data?.cashAndBank || 0,
                liabilities: balanceSheetResponse.data.data?.liabilities || 0,
                equity: balanceSheetResponse.data.data?.equity || 0,
                transactions: transactionsResponse.data.data || [],
                chartData: chartResponse.data.data || []
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(angka);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short"
        });
    };

    /**
     * Memetakan nilai `dashboard_flow` dari backend ke label dan tone tampilan.
     * Nilai flow ditentukan dari kode akun jurnal, bukan tipe transaksi.
     */
    const getTransactionFlowPresentation = (trx) => {
        const flow = String(trx.dashboard_flow || "").toLowerCase();

        switch (flow) {
            case "capital_in":
                return { tone: "in",      label: "Pemasukan Modal" };
            case "prive":
                return { tone: "out",     label: "Prive" };
            case "sales_return":
                return { tone: "return",  label: "Retur Penjualan" };
            case "purchase_return":
                return { tone: "return",  label: "Retur Pembelian" };
            case "income":
                return { tone: "in",      label: "Pemasukan" };
            case "expense":
                return { tone: "out",     label: "Pengeluaran" };
            case "non_cash":
            default:
                return { tone: "other",   label: "Non Kas" };
        }
    };


    const getMaxValue = () => {
        if (dashboardData.chartData.length === 0) return 1000000;

        const maxMasuk = Math.max(...dashboardData.chartData.map(d => d.masuk || 0));
        const maxKeluar = Math.max(...dashboardData.chartData.map(d => d.keluar || 0));
        const maxValue = Math.max(maxMasuk, maxKeluar);

        const rounded = Math.ceil(maxValue / 1000000) * 1000000;
        return rounded || 1000000;
    };

    const formatYAxis = (value) => {
        if (value >= 1000000) {
            return `Rp${(value / 1000000).toFixed(0)}jt`;
        } else if (value >= 1000) {
            return `Rp${(value / 1000).toFixed(0)}rb`;
        }
        return `Rp${value}`;
    };

    // 🔥 TAMPILKAN PESAN JIKA BELUM PILIH USAHA
    if (!selectedBusiness) {
        return (
            <div className="dashboard">
                <div className="alert alert-warning">
                    <p>Silakan pilih jenis usaha terlebih dahulu di sidebar.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="dashboard-loading">Memuat data...</div>;
    }

    const expensePercentage = dashboardData.totalIncome > 0
        ? ((dashboardData.totalExpense / dashboardData.totalIncome) * 100).toFixed(0)
        : 0;

    const maxValue = getMaxValue();

    return (
        <div className="dashboard">
            {/* INFO USAHA */}
            <div className="dashboard-business-info">
                <span className="business-badge">
                    {selectedBusiness.name}
                </span>
            </div>

            {/* FILTER KALENDER */}
            <div className="dashboard-filter calendar-filter">
                <div className="filter-group">
                    <label>Dari:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="calendar-input"
                    />
                </div>
                <div className="filter-group">
                    <label>Sampai:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="calendar-input"
                    />
                </div>
                <button 
                    className="reset-filter-btn"
                    onClick={() => {
                        setStartDate(getFirstDayOfMonth());
                        setEndDate(getLastDayOfMonth());
                    }}
                >
                    Bulan Ini
                </button>
            </div>

            {/* GROUP 1: KINERJA BISNIS (LABA RUGI) */}
            <div className="dashboard-section-header tour-header-kinerja">
                <h3>Kinerja Bisnis</h3>
            </div>
            <div className="dashboard-cards tour-kinerja">
                <div className="summary-card income">
                    <h4>Total Pemasukan</h4>
                    <p className="amount">{formatRupiah(dashboardData.totalIncome)}</p>
                </div>

                <div className="summary-card expense">
                    <h4>Total Pengeluaran</h4>
                    <p className="amount">{formatRupiah(dashboardData.totalExpense)}</p>
                </div>

                <div className="summary-card net-profit">
                    <h4>Laba / Rugi Bersih</h4>
                    <p className={`amount ${dashboardData.netProfit >= 0 ? 'profit-text' : 'loss-text'}`}>
                        {formatRupiah(dashboardData.netProfit)}
                    </p>
                </div>
            </div>

            {/* GROUP 2: POSISI KEUANGAN (NERACA) */}
            <div className="dashboard-section-header tour-header-posisi">
                <h3>Posisi Keuangan (Real-time)</h3>
            </div>
            <div className="dashboard-cards grid-4 tour-posisi">
                <div className="summary-card cash">
                    <h4>Saldo Kas & Bank</h4>
                    <p className="amount">{formatRupiah(dashboardData.cashAndBank)}</p>
                </div>

                <div className="summary-card assets">
                    <h4>Total Aset</h4>
                    <p className="amount">{formatRupiah(dashboardData.balance)}</p>
                </div>

                <div className="summary-card liabilities">
                    <h4>Total Utang</h4>
                    <p className="amount loss-text">{formatRupiah(dashboardData.liabilities)}</p>
                </div>

                <div className="summary-card equity">
                    <h4>Modal Saat Ini</h4>
                    <p className="amount profit-text">{formatRupiah(dashboardData.equity)}</p>
                </div>
            </div>

            {/* GRAFIK ARUS KAS */}
            <div className="dashboard-chart">
                <h4>Grafik Arus Kas Harian - {selectedBusiness.name}</h4>
                {dashboardData.chartData.length === 0 ? (
                    <div className="chart-placeholder">
                        <p>Tidak ada data grafik untuk periode ini</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboardData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis
                                domain={[0, maxValue]}
                                tickFormatter={formatYAxis}
                            />
                            <Tooltip
                                formatter={(value) => formatRupiah(value)}
                                labelFormatter={(label) => `Tanggal: ${label}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="masuk"
                                stroke="#2e7d32"
                                name="Pemasukan"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="keluar"
                                stroke="#c62828"
                                name="Pengeluaran"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="net"
                                stroke="#0284c7"
                                name="Saldo Bersih"
                                strokeWidth={3}
                                dot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* INSIGHT */}
            <div className="dashboard-insight">
                <h4>Insight - {selectedBusiness.name}</h4>
                <ul>
                    <li>Pengeluaran {expensePercentage}% dari pemasukan</li>
                    <li>Saldo periode ini {dashboardData.balance > 0 ? "positif" : "negatif"}</li>
                    <li>Total transaksi: {dashboardData.transactions.length}</li>
                </ul>
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="dashboard-transactions">
                <h4>Transaksi Terakhir - {selectedBusiness.name}</h4>
                {dashboardData.transactions.length === 0 ? (
                    <p className="empty-message">Belum ada transaksi</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Keterangan</th>
                                    <th>Jenis</th>
                                    <th>Nominal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.transactions.map((trx) => {
                                    const { tone, label } = getTransactionFlowPresentation(trx);
                                    const badgeClass =
                                        tone === "in"
                                            ? "badge-income"
                                            : tone === "out"
                                              ? "badge-expense"
                                              : tone === "return"
                                                ? "badge-return"
                                                : "badge-neutral";
                                    const amountClass =
                                        tone === "in"
                                            ? "income-text"
                                            : tone === "out"
                                              ? "expense-text"
                                              : tone === "return"
                                                ? "return-text"
                                                : "neutral-text";
                                    return (
                                        <tr key={trx.transaction_id}>
                                            <td>{formatDate(trx.transaction_date)}</td>
                                            <td>{trx.description || "-"}</td>
                                            <td>
                                                <span className={`badge ${badgeClass}`}>{label}</span>
                                            </td>
                                            <td className={amountClass}>
                                                {formatRupiah(trx.debit || trx.credit)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;