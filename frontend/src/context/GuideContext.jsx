import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const GuideContext = createContext();

export const useGuide = () => useContext(GuideContext);

export const GuideProvider = ({ children }) => {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [sidebarControls, setSidebarControls] = useState(null);
    const location = useLocation();

    const registerSidebarControls = useCallback((controls) => {
        setSidebarControls(() => controls);
    }, []);

    const startGuide = useCallback(() => {
        setRun(false);
        setRefreshKey(prev => prev + 1);
        
        // Karena tidak ada lagi sidebar, kita pastikan sidebar tertutup di mobile saat mulai
        if (window.innerWidth <= 768 && sidebarControls) {
            sidebarControls(false);
        }

        setTimeout(() => {
            setRun(true);
        }, 400);
    }, [sidebarControls]);

    useEffect(() => {
        setRun(false);
    }, []);

    useEffect(() => {
        const path = location.pathname;
        
        // Pemetaan nama halaman berdasarkan path
        const pageNames = {
            '/': 'Dashboard',
            '/transaction': 'Transaksi',
            '/profile': 'Profil',
            '/business-type': 'Jenis Usaha',
            '/siklus-akuntansi/jurnal-umum': 'Jurnal Umum',
            '/siklus-akuntansi/buku-besar': 'Buku Besar',
            '/siklus-akuntansi/neraca-saldo': 'Neraca Saldo',
            '/laporan/laba-rugi': 'Laporan Laba Rugi',
            '/laporan/neraca': 'Laporan Neraca',
            '/laporan/arus-kas': 'Laporan Arus Kas',
        };

        const currentPageName = pageNames[path] || 'Aplikasi';

        // LANGKAH PERTAMA: Welcome Step yang Dinamis
        const welcomeStep = {
            target: 'body',
            content: path === '/' 
                ? 'Selamat Datang di SIMPEL! Mari kita jelajahi fitur utama untuk membantu keuangan usaha Anda.' 
                : `Halo! Saat ini kita sedang berada di halaman ${currentPageName}. Mari kita pelajari bagian-bagian di halaman ini.`,
            placement: 'center',
            disableBeacon: true,
            requireSidebar: false
        };

        let contentSteps = [];

        if (path === '/') {
            contentSteps = [
                {
                    target: '.dashboard-filter',
                    content: 'Filter Periode: Anda bisa melihat rangkuman keuangan berdasarkan Hari Ini, Minggu Ini, atau Bulan Ini.',
                    placement: 'bottom',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: '.tour-kinerja',
                    content: 'Kinerja Bisnis: Pantau total pemasukan, pengeluaran, dan laba bersih usaha Anda secara real-time.',
                    placement: 'top',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: '.tour-posisi',
                    content: 'Posisi Keuangan: Di sini Anda bisa melihat total Kas, Aset, serta kewajiban (Utang & Modal) usaha.',
                    placement: 'top',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: '.dashboard-chart',
                    content: 'Tren Arus Kas: Grafik ini menunjukkan perbandingan uang masuk dan keluar setiap harinya.',
                    placement: 'top',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: '.dashboard-transactions',
                    content: 'Transaksi Terakhir: Lihat 5 riwayat pencatatan terbaru yang Anda lakukan.',
                    placement: 'top',
                    disableBeacon: true,
                    requireSidebar: false
                }
            ];
        } else if (path === '/transaction') {
            contentSteps = [
                {
                    target: '.transaction-form',
                    content: 'Pencatatan Transaksi: Gunakan formulir ini untuk mencatat setiap uang yang masuk atau keluar.',
                    placement: 'bottom',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: 'input[name="transaction_date"]',
                    content: 'Tanggal: Secara default adalah hari ini, tapi Anda bisa mengubahnya jika ingin mencatat transaksi yang sudah lewat.',
                    placement: 'bottom',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: 'select[name="category_id"]',
                    content: 'Kategori: Pilih jenis transaksi Anda (misal: Penjualan, Biaya Listrik, atau Pembelian Stok).',
                    placement: 'bottom',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: 'input[placeholder="Rp 0"]',
                    content: 'Nominal: Masukkan jumlah uang tanpa titik atau koma (Contoh: 50000).',
                    placement: 'bottom',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: 'input[name="description"]',
                    content: 'Keterangan: Tulis detail transaksi Anda di sini agar mudah diingat di kemudian hari.',
                    placement: 'bottom',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: '.btn-submit',
                    content: 'Simpan: Klik di sini untuk memproses transaksi. Data akan langsung masuk ke laporan!',
                    placement: 'top',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: '.transaction-list',
                    content: 'Riwayat Transaksi: Semua data yang Anda simpan akan tampil rapi di tabel ini.',
                    placement: 'top',
                    disableBeacon: true,
                    requireSidebar: false
                },
                {
                    target: '.export-buttons',
                    content: 'Export Data: Unduh seluruh data transaksi ini dalam format Excel atau PDF untuk laporan fisik.',
                    placement: 'bottom',
                    disableBeacon: true,
                    requireSidebar: false
                }
            ];
        }

        const newSteps = [welcomeStep, ...contentSteps];
        const finalSteps = newSteps.map(step => ({ ...step, disableBeacon: true }));
        setSteps(finalSteps);
    }, [location.pathname]);

    const handleJoyrideCallback = useCallback((data) => {
        const { status, type, step } = data;
        const isMobile = window.innerWidth <= 768;

        if (type === 'step:before' && sidebarControls && isMobile) {
            // Sesuai permintaan baru: Fokus di main content, pastikan sidebar tertutup
            if (step?.requireSidebar) {
                setRun(false);
                sidebarControls(true);
                setTimeout(() => {
                    setRefreshKey(prev => prev + 1);
                    setRun(true);
                }, 350);
                return;
            } else {
                sidebarControls(false);
            }
        }

        if (['finished', 'skipped'].includes(status)) {
            setRun(false);
            localStorage.setItem('hasSeenOnboarding', 'true');
            if (sidebarControls) sidebarControls(false);
        }
    }, [sidebarControls]);

    return (
        <GuideContext.Provider value={{ run, steps, refreshKey, startGuide, handleJoyrideCallback, registerSidebarControls }}>
            {children}
        </GuideContext.Provider>
    );
};
