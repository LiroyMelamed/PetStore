import { useEffect, useMemo, useState } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api";
import { useTranslation } from "react-i18next";
import styles from "./AdminProducts.module.scss";

export default function AdminProducts() {
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        category_id: "",
        base_price: "",
        is_active: true,
        seo_title: "",
        seo_description: ""
    });

    const load = async () => {
        const data = await fetchProducts();
        setRows(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            const d = await fetchProducts();
            if (!ignore) setRows(Array.isArray(d) ? d : []);
        })();
        return () => { ignore = true; };
    }, []);

    const filtered = useMemo(() => {
        if (!q) return rows;
        const qq = q.toLowerCase();
        return rows.filter(p =>
            (p.name || "").toLowerCase().includes(qq) ||
            String(p.id).includes(qq) ||
            String(p.category_id ?? "").includes(qq)
        );
    }, [rows, q]);

    const resetForm = () => {
        setEditingId(null);
        setForm({
            name: "",
            category_id: "",
            base_price: "",
            is_active: true,
            seo_title: "",
            seo_description: ""
        });
    };

    const submit = async () => {
        const payload = {
            ...form,
            base_price: Number(form.base_price) || 0,
            category_id: form.category_id ? Number(form.category_id) : null
        };
        if (editingId) await updateProduct(editingId, payload);
        else await createProduct(payload);
        resetForm();
        load();
    };

    const edit = (p) => {
        setEditingId(p.id);
        setForm({
            name: p.name || "",
            category_id: p.category_id ?? "",
            base_price: p.base_price ?? "",
            is_active: !!p.is_active,
            seo_title: p.seo_title || "",
            seo_description: p.seo_description || ""
        });
    };

    const remove = async (id) => {
        if (!confirm(t("admin.products.confirmDelete"))) return;
        await deleteProduct(id);
        load();
    };

    return (
        <div className={styles.grid}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                        className="input"
                        placeholder={t("admin.products.search_placeholder")}
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        style={{ minWidth: 220 }}
                    />
                    <div className="badge">{filtered.length} {t("admin.products.items_count")}</div>
                </div>
                <button className="btn btn--primary" onClick={resetForm}>+ {t("common.create_button")}</button>
            </div>

            {/* Form */}
            <div className="card panel">
                <div className={styles.formGrid}>
                    <div>
                        <label>{t("admin.products.fields.name")}</label>
                        <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                        <label>{t("admin.products.fields.categoryId")}</label>
                        <input className="input" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} />
                    </div>
                    <div>
                        <label>{t("admin.products.fields.price")}</label>
                        <input className="input" type="number" value={form.base_price} onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))} />
                    </div>
                    <div>
                        <label>{t("admin.products.fields.active")}</label>
                        <select
                            value={form.is_active ? "1" : "0"}
                            onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "1" }))}
                        >
                            <option value="1">{t("status.active")}</option>
                            <option value="0">{t("status.inactive")}</option>
                        </select>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label>{t("admin.products.fields.seoTitle")}</label>
                        <input className="input" value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label>{t("admin.products.fields.seoDescription")}</label>
                        <input className="input" value={form.seo_description} onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} />
                    </div>
                </div>
                <div className="row" style={{ marginTop: 12 }}>
                    <button className="btn btn--primary" onClick={submit}>
                        {editingId ? t("common.save_button") : t("common.create_button")}
                    </button>
                    {editingId && <button className="btn" onClick={resetForm}>{t("common.cancel_button")}</button>}
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t("admin.products.fields.name")}</th>
                            <th>{t("admin.products.fields.categoryId")}</th>
                            <th>{t("admin.products.fields.price")}</th>
                            <th>{t("admin.products.fields.active")}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.category_id}</td>
                                <td>{p.base_price}</td>
                                <td>{p.is_active ? t("status.active") : t("status.inactive")}</td>
                                <td className={styles.actions}>
                                    <button className="btn" onClick={() => edit(p)}>{t("common.edit_button")}</button>
                                    <button className="btn btn--danger" onClick={() => remove(p.id)}>{t("common.delete_button")}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
