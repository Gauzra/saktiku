import api from "./Api";

export const getProfitLoss = async (startDate, endDate) => {
    const res = await api.get("/reports/profit-loss", {
        params: { startDate, endDate }
    });
    return res.data;
};

export const getBalanceSheet = async (date) => {
    const res = await api.get("/reports/balance-sheet", {
        params: { date }
    });
    return res.data;
};

export const getCashFlow = async (startDate, endDate) => {
    const res = await api.get("/reports/cash-flow", {
        params: { startDate, endDate }
    });
    return res.data;
};