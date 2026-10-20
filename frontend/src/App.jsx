// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BusinessProvider } from "./context/BusinessContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Transaction from "./pages/Transaction/Transaction";
import ProfitLoss from "./pages/Reports/ProfitLoss";
import BalanceSheet from "./pages/Reports/BalanceSheet";
import CashFlow from "./pages/Reports/CashFlow";
import EquityChange from "./pages/Reports/EquityChange";
import GeneralJournal from "./pages/AccountingCycle/GeneralJournal";
import Ledger from "./pages/AccountingCycle/Ledger";
import TrialBalance from "./pages/AccountingCycle/TrialBalance";
import AdjustingJournal from "./pages/AccountingCycle/AdjustingJournal";
import Profile from "./pages/Profile/Profile";
import { GuideProvider } from "./context/GuideContext";
import OpeningBalance from "./pages/OpeningBalance/OpeningBalance";
import Panduan from "./pages/Panduan/Panduan";
import Landing from "./pages/Landing/Landing";
import Tim from "./pages/Tim/Tim";

function App() {
  return (
    <BrowserRouter>
      <BusinessProvider>
        <GuideProvider>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="transaction" element={<Transaction />} />
            <Route path="atur-saldo-awal" element={<OpeningBalance />} />
            <Route path="siklus-akuntansi/jurnal-umum" element={<GeneralJournal />} />
            <Route path="siklus-akuntansi/buku-besar" element={<Ledger />} />
            <Route path="siklus-akuntansi/neraca-saldo" element={<TrialBalance />} />
            <Route path="siklus-akuntansi/jurnal-penyesuaian" element={<AdjustingJournal />} />
            <Route path="laporan/laba-rugi" element={<ProfitLoss />} />
            <Route path="laporan/neraca" element={<BalanceSheet />} />
            <Route path="laporan/perubahan-modal" element={<EquityChange />} />
            <Route path="laporan/arus-kas" element={<CashFlow />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/tim" element={<Tim />} />
        </Routes>
        </GuideProvider>
      </BusinessProvider>
    </BrowserRouter>
  );
}

export default App;