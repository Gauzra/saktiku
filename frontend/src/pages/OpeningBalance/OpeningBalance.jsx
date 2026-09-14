// src/pages/OpeningBalance/OpeningBalance.jsx
import React, { useEffect, useState } from "react";
import { useBusiness } from "../../context/BusinessContext";
import {
    getOpeningBalanceAccounts,
    createOpeningBalance,
    getOpeningBalances,
    deleteTransaction,
} from "../../services/transactionService";
import "./OpeningBalance.css";

const OpeningBalance = () => {
    const { selectedBusiness } = useBusiness();

    // ---- Form State ----
    const [openingAccounts, setOpeningAccounts] = useState({ debit: [], credit: [] });
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        as_of_date: getTodayDate(),
        side: "",
        account_id: "",
        amount: "",
        description: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    // ---- List State ----
    const [obList, setObList] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [listError, setListError] = useState("");

    // ---- Confirm delete ----
    const [deletingId, setDeletingId] = useState(null);
    const [deletingAll, setDeletingAll] = useState(false);

    // ============================================================
    // FETCH
    // ============================================================
    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        if (selectedBusiness) {
            fetchObList();
        }
    }, [selectedBusiness]);

    const fetchAccounts = async () => {
        setLoadingAccounts(true);
        try {
            const res = await getOpeningBalanceAccounts();
            const payload = res?.data || {};
            setOpeningAccounts({
                debit: Array.isArray(payload.debit) ? payload.debit : [],
                credit: Array.isArray(payload.credit) ? payload.credit : [],
            });
        } catch (err) {
            console.error("Gagal ambil akun:", err);
        } finally {
            setLoadingAccounts(false);
        }
    };

    const fetchObList = async () => {
        setLoadingList(true);
        setListError("");
        try {
            // Gunakan API khusus saldo awal yang baru
            const res = await getOpeningBalances(selectedBusiness.id);
            const data = Array.isArray(res?.data) ? res.data : [];
            setObList(data);
        } catch (err) {
            setListError("Gagal memuat data saldo awal.");
            console.error(err);
        } finally {
            setLoadingList(false);
        }
    };

    // ============================================================
    // FORM HANDLERS
    // ============================================================
    const handleSideToggle = (side) => {
        setFormData((prev) => ({
            ...prev,
            side: prev.side === side ? "" : side,
            account_id: "",
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAmountChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setFormData((prev) => ({ ...prev, amount: raw }));
    };

    const formatRupiah = (num) => {
        if (!num) return "";
        return new Intl.NumberFormat("id-ID").format(num);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!selectedBusiness) {
            setFormError("Pilih jenis usaha terlebih dahulu.");
            return;
        }
        if (!formData.as_of_date) {
            setFormError("Tanggal wajib diisi.");
            return;
        }
        if (!formData.side) {
            setFormError("Pilih sisi saldo awal (Debit atau Kredit).");
            return;
        }
        if (!formData.account_id) {
            setFormError("Pilih akun saldo awal.");
            return;
        }
        if (!formData.amount || parseInt(formData.amount) <= 0) {
            setFormError("Nominal harus lebih dari 0.");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                as_of_date: formData.as_of_date,
                side: formData.side,
                account_id: parseInt(formData.account_id),
                amount: parseInt(formData.amount),
                description: formData.description,
                business_type_id: selectedBusiness.id,
            };
            await createOpeningBalance(payload);
            setFormSuccess("Saldo awal berhasil disimpan!");
            setFormData({
                as_of_date: getTodayDate(),
                side: "",
                account_id: "",
                amount: "",
                description: "",
            });
            fetchObList();
            setTimeout(() => setFormSuccess(""), 4000);
        } catch (err) {
            setFormError(err?.message || "Gagal menyimpan saldo awal.");
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================================
    // DELETE
    // ============================================================
    const handleDelete = async (transactionId) => {
        if (!window.confirm("Yakin ingin menghapus saldo awal ini?")) return;
        setDeletingId(transactionId);
        try {
            await deleteTransaction(transactionId);
            fetchObList();
        } catch (err) {
            alert(err?.message || "Gagal menghapus.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAll = async () => {
        if (obList.length === 0) return;
        if (!window.confirm(`Yakin ingin menghapus SEMUA ${obList.length} entri saldo awal? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeletingAll(true);
        try {
            for (const item of obList) {
                await deleteTransaction(item.transaction_id);
            }
            fetchObList();
        } catch (err) {
            alert(err?.message || "Gagal menghapus semua entri.");
            fetchObList();
        } finally {
            setDeletingAll(false);
        }
    };

    // ============================================================
    // RENDER HELPERS
    // ============================================================
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const currentAccounts =
        formData.side === "debit"
            ? openingAccounts.debit
            : formData.side === "credit"
                ? openingAccounts.credit
                : [];

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="opening-balance-page">
            <h1>Atur Saldo Awal</h1>
            <p className="ob-subtitle">
                Catat saldo awal akun aset, utang, dan modal sebelum memulai pencatatan transaksi.
            </p>

            {!selectedBusiness && (
                <div className="ob-no-business">
                    ⚠️ Silakan pilih jenis usaha terlebih dahulu di sidebar.
                </div>
            )}

            <div className="ob-layout">
                {/* ===== FORM ===== */}
                <div className="ob-form-card">
                    <h2>Tambah Saldo Awal</h2>

                    {formError && <div className="ob-error">{formError}</div>}
                    {formSuccess && <div className="ob-success">{formSuccess}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Tanggal */}
                        <div className="ob-form-group">
                            <label>Tanggal</label>
                            <input
                                type="date"
                                name="as_of_date"
                                value={formData.as_of_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Sisi Debit / Kredit */}
                        <div className="ob-form-group">
                            <label>Sisi Saldo Awal</label>
                            <div className="ob-side-toggle">
                                <button
                                    type="button"
                                    className={`ob-side-btn debit ${formData.side === "debit" ? "active" : ""}`}
                                    onClick={() => handleSideToggle("debit")}
                                >
                                    ▲ Debit
                                </button>
                                <button
                                    type="button"
                                    className={`ob-side-btn credit ${formData.side === "credit" ? "active" : ""}`}
                                    onClick={() => handleSideToggle("credit")}
                                >
                                    ▼ Kredit
                                </button>
                            </div>
                            <span className="ob-hint">
                                Debit = Aset &nbsp;|&nbsp; Kredit = Utang / Modal
                            </span>
                        </div>

                        {/* Dropdown Akun */}
                        {formData.side && (
                            <div className="ob-form-group">
                                <label>
                                    Akun {formData.side === "debit" ? "Debit (Aset)" : "Kredit (Utang/Modal)"}
                                </label>
                                <select
                                    name="account_id"
                                    value={formData.account_id}
                                    onChange={handleChange}
                                    disabled={loadingAccounts}
                                >
                                    <option value="">
                                        {loadingAccounts ? "Memuat akun..." : "— Pilih Akun —"}
                                    </option>
                                    {currentAccounts.map((acc) => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.code} - {acc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Nominal */}
                        <div className="ob-form-group">
                            <label>Nominal</label>
                            <input
                                type="text"
                                placeholder="Rp 0"
                                value={formData.amount ? `Rp ${formatRupiah(formData.amount)}` : ""}
                                onChange={handleAmountChange}
                                required
                            />
                        </div>

                        {/* Deskripsi */}
                        <div className="ob-form-group">
                            <label>Deskripsi (Opsional)</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Misal: Saldo kas awal periode"
                            />
                        </div>

                        <button
                            type="submit"
                            className="ob-btn-submit"
                            disabled={submitting || !selectedBusiness}
                        >
                            {submitting ? "Menyimpan..." : "Simpan Saldo Awal"}
                        </button>
                    </form>
                </div>

                {/* ===== LIST ===== */}
                <div className="ob-list-card ob-list-fullwidth">
                    <div className="ob-list-header">
                        <div>
                            <h2>Neraca Saldo Awal</h2>
                            {!loadingList && obList.length > 0 && (
                                <p className="ob-journal-subtitle">
                                    Daftar posisi keuangan awal periode — {selectedBusiness?.name}
                                </p>
                            )}
                        </div>
                        <div className="ob-list-header-actions">
                            {!loadingList && (
                                <span className="ob-badge-count">{obList.length} entri</span>
                            )}
                            {obList.length > 0 && (
                                <button
                                    className="ob-btn-delete-all"
                                    onClick={handleDeleteAll}
                                    disabled={deletingAll}
                                >
                                    {deletingAll ? "Menghapus..." : "🗑 Hapus Semua"}
                                </button>
                            )}
                        </div>
                    </div>

                    {listError && <div className="ob-error">{listError}</div>}

                    {loadingList ? (
                        <div className="ob-loading">
                            <span className="ob-spinner" />
                            Memuat data...
                        </div>
                    ) : obList.length === 0 ? (
                        <div className="ob-empty">
                            <div className="ob-empty-icon">🏦</div>
                            <p>Belum ada saldo awal yang tercatat.</p>
                            <p>Gunakan form di sebelah kiri untuk menambahkan.</p>
                        </div>
                    ) : (
                        <div className="ob-table-wrap">
                            <table className="ob-balance-table">
                                <thead>
                                    <tr>
                                        <th className="col-tgl">Tanggal</th>
                                        <th className="col-acc-d">Akun (Debit)</th>
                                        <th className="col-amt-d">Debit</th>
                                        <th className="col-acc-c">Akun (Kredit)</th>
                                        <th className="col-amt-c">Kredit</th>
                                        <th className="col-opsi"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        // GROUP BY DATE (as_of_date)
                                        const groups = obList.reduce((acc, item) => {
                                            const d = item.as_of_date;
                                            if (!acc[d]) acc[d] = [];
                                            acc[d].push(item);
                                            return acc;
                                        }, {});

                                        return Object.entries(groups).map(([date, items]) => {
                                            const debits = items.filter(t => t.side === 'debit');
                                            const credits = items.filter(t => t.side === 'credit');

                                            return (
                                                <React.Fragment key={date}>
                                                    {/* Row Header Tanggal */}
                                                    <tr className="ob-date-group-header">
                                                        <td colSpan={6}>{formatDate(date)}</td>
                                                    </tr>

                                                    {/* DEBITS (ASSETS) */}
                                                    {debits.map((t) => (
                                                        <tr key={t.id} className="ob-row-item d-side">
                                                            <td className="col-tgl"></td>
                                                            <td className="col-acc-d">
                                                                <span className="ob-acc-code">{t.account_code}</span> {t.account_name}
                                                            </td>
                                                            <td className="col-amt-d">{formatRupiah(t.amount)}</td>
                                                            <td className="col-acc-c"></td>
                                                            <td className="col-amt-c"></td>
                                                            <td className="col-opsi">
                                                                <button className="ob-minibtn-del" title="Hapus" onClick={() => handleDelete(t.transaction_id)}>×</button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {/* SPACER IF BOTH SIDES EXIST */}
                                                    {(debits.length > 0 && credits.length > 0) && (
                                                        <tr className="ob-row-spacer"><td colSpan={6}></td></tr>
                                                    )}

                                                    {/* CREDITS (LIABILITIES/EQUITY) */}
                                                    {credits.map((t) => (
                                                        <tr key={t.id} className="ob-row-item c-side">
                                                            <td className="col-tgl"></td>
                                                            <td className="col-acc-d"></td>
                                                            <td className="col-amt-d"></td>
                                                            <td className="col-acc-c">
                                                                <span className="ob-acc-code">{t.account_code}</span> {t.account_name}
                                                            </td>
                                                            <td className="col-amt-c">{formatRupiah(t.amount)}</td>
                                                            <td className="col-opsi">
                                                                <button className="ob-minibtn-del" title="Hapus" onClick={() => handleDelete(t.transaction_id)}>×</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpeningBalance;
