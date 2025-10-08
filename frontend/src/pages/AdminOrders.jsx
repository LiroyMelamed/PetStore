import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus } from "../api";
import { useTranslation } from "react-i18next";

export default function AdminOrders() {
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);
    const [status, setStatus] = useState("");
    const [q, setQ] = useState("");

    const load = async () => {
        const data = await fetchOrders({ status, q });
        setRows(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const data = await fetchOrders({ status, q });
                if (!ignore) setRows(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { ignore = true; };
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="">{t("common.all_option")}</option>
                    <option value="pending">{t("orders.statuses.pending")}</option>
                    <option value="paid">{t("orders.statuses.paid")}</option>
                    <option value="shipped">{t("orders.statuses.shipped")}</option>
                    <option value="delivered">{t("orders.statuses.delivered")}</option>
                    <option value="failed">{t("orders.statuses.failed")}</option>
                    <option value="canceled">{t("orders.statuses.canceled")}</option>
                </select>
                <input placeholder={t("orders.search_placeholder")} value={q} onChange={e => setQ(e.target.value)} />
                <button onClick={load}>{t("common.filter_button")}</button>
            </div>

            <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
                <thead><tr>
                    <th align="left">{t("orders.columns.id")}</th>
                    <th align="left">{t("orders.columns.status")}</th>
                    <th>{t("orders.columns.subtotal")}</th>
                    <th>{t("orders.columns.discount")}</th>
                    <th>{t("orders.columns.total")}</th>
                    <th>{t("orders.columns.created")}</th>
                    <th></th>
                </tr></thead>
                <tbody>
                    {rows.map(r => (
                        <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                            <td>{r.id}</td>
                            <td>{t(`orders.statuses.${r.status}`)}</td>
                            <td>{r.subtotal}</td>
                            <td>{r.discount_amount}</td>
                            <td>{r.total_price}</td>
                            <td>{new Date(r.created_at).toLocaleString()}</td>
                            <td><StatusEdit id={r.id} onDone={load} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatusEdit({ id, onDone }) {
    const { t } = useTranslation();
    const [status, setStatus] = useState("paid");
    const save = async () => {
        try { await updateOrderStatus(id, status); onDone(); }
        catch (e) { alert(e?.error || "Error"); }
    };
    return (
        <span>
            <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="paid">{t("orders.statuses.paid")}</option>
                <option value="shipped">{t("orders.statuses.shipped")}</option>
                <option value="delivered">{t("orders.statuses.delivered")}</option>
                <option value="failed">{t("orders.statuses.failed")}</option>
                <option value="canceled">{t("orders.statuses.canceled")}</option>
            </select>
            <button style={{ marginLeft: 8 }} onClick={save}>{t("common.update_button")}</button>
        </span>
    );
}
