import { useEffect, useMemo, useState } from "react";
import {
    fetchAdminOverview,
    fetchOrdersOverTime,
    fetchRevenueOverTime,
    fetchOrdersByStatus,
    fetchTopProducts
} from "../api";
import s from "./AdminDashboard.module.scss";
import { useTranslation } from "react-i18next";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#22d3ee"];

export default function AdminDashboard() {
    const { t, i18n } = useTranslation();
    const [gran, setGran] = useState("month");
    const [from, setFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).toISOString());
    const [to, setTo] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

    const [kpis, setKpis] = useState(null);
    const [ordersSeries, setOrdersSeries] = useState([]);
    const [revenueSeries, setRevenueSeries] = useState([]);
    const [statusSeries, setStatusSeries] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    // Load everything together
    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const params = { from, to, granularity: gran };
                const [k, o, r, s, tp] = await Promise.all([
                    fetchAdminOverview(params),
                    fetchOrdersOverTime(params),
                    fetchRevenueOverTime(params),
                    fetchOrdersByStatus(params),
                    fetchTopProducts({ ...params, limit: 8 })
                ]);
                if (ignore) return;
                setKpis(k || {});
                setOrdersSeries(formatTimeSeries(o || []));
                setRevenueSeries(formatTimeSeries(r || [], "revenue"));
                setStatusSeries((s || []).map(x => ({ name: x.status, value: x.count })));
                setTopProducts(tp || []);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { ignore = true; };
    }, [from, to, gran]);

    const locale = i18n.language === "he" ? "he-IL" : "en-US";

    if (!kpis) {
        return <div style={{ padding: 16 }}>Loading…</div>;
    }

    return (
        <div className={s.wrapper}>
            {/* Controls */}
            <div className={s.controls}>
                <label>{t("analytics.granularity")}</label>
                <select value={gran} onChange={e => setGran(e.target.value)}>
                    <option value="day">{t("analytics.granularity_day")}</option>
                    <option value="week">{t("analytics.granularity_week")}</option>
                    <option value="month">{t("analytics.granularity_month")}</option>
                </select>

                <label>{t("analytics.from")}</label>
                <input type="month"
                    value={toMonthValue(from)}
                    onChange={e => setFrom(monthToISO(e.target.value))} />

                <label>{t("analytics.to_exclusive")}</label>
                <input type="month"
                    value={toMonthValue(to)}
                    onChange={e => setTo(monthToISO(e.target.value))} />
            </div>

            {/* KPIs */}
            <div className={s.kpis}>
                <KpiCard title={t("analytics.kpi_active_customers")} value={fmt(kpis.active_customers)} />
                <KpiCard title={t("analytics.kpi_avg_order_value")} value={currency(avgOrderValue(kpis))} />
                <KpiCard title={t("analytics.kpi_revenue_ils")} value={currency(kpis.revenue)} />
                <KpiCard title={t("analytics.kpi_orders")} value={fmt(kpis.orders_count)} />
            </div>

            {/* Charts & table */}
            <div className={s.grid}>
                <div className={`${s.card}`}>
                    <div className={s.cardTitle}>{t("analytics.table_top_products")}</div>
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>{t("analytics.col_revenue")}</th>
                                <th>{t("analytics.col_qty")}</th>
                                <th>{t("analytics.col_product")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(topProducts || []).map((p, i) => (
                                <tr key={p.id}>
                                    <td>{currency(p.revenue)}</td>
                                    <td>{fmt(p.qty)}</td>
                                    <td>{p.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ opacity: .6, fontSize: 12, marginTop: 8 }}>
                        {t("analytics.period")}: {fmtPeriod(from, to, locale)}
                    </div>
                </div>

                <div className={`${s.card}`}>
                    <div className={s.cardTitle}>{t("analytics.chart_orders_over_time")}</div>
                    <div className={s.chartBox}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ordersSeries}>
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="orders" stroke="#60a5fa" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={`${s.card}`}>
                    <div className={s.cardTitle}>{t("analytics.chart_orders_by_status")}</div>
                    <div className={s.chartBox}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie dataKey="value" data={statusSeries} outerRadius={100} label>
                                    {statusSeries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={`${s.card}`}>
                    <div className={s.cardTitle}>{t("analytics.chart_revenue_over_time")}</div>
                    <div className={s.chartBox}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueSeries}>
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- helpers ---------- */
function KpiCard({ title, value }) {
    const { i18n } = useTranslation();
    const isHe = i18n.language === "he";
    return (
        <div className={`${s.card}`}>
            <div className={s.cardTitle}>{title.toUpperCase()}</div>
            <div className={s.cardValue} dir="ltr">{value}</div>
        </div>
    );
}
function toMonthValue(iso) { const d = new Date(iso); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`; }
function monthToISO(v) { const [y, m] = v.split("-").map(Number); return new Date(Date.UTC(y, m - 1, 1)).toISOString(); }
function fmt(n) { return new Intl.NumberFormat().format(Number(n || 0)); }
function currency(n) { return new Intl.NumberFormat(undefined, { style: "currency", currency: "ILS" }).format(Number(n || 0)); }
function avgOrderValue(k) { const o = Number(k?.orders_count || 0); const r = Number(k?.revenue || 0); return o ? (r / o) : 0; }
function fmtPeriod(from, to, locale) { const f = new Date(from), t = new Date(to); return `${f.toLocaleDateString(locale)} — ${t.toLocaleDateString(locale)}`; }
function formatTimeSeries(arr, key = "orders") {
    return (arr || []).map(x => {
        const d = new Date(x.bucket || x.date || x.day || x.month);
        const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return { label, [key]: Number(x[key] || x.count || 0) };
    });
}
