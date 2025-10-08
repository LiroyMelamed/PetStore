import { useEffect, useMemo, useState } from "react";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../api";
import { useTranslation } from "react-i18next";
import styles from "./AdminCategories.module.scss";

export default function AdminCategories() {
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        seo_title: "",
        seo_description: ""
    });

    const load = async () => {
        const data = await fetchCategories();
        setRows(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            const d = await fetchCategories();
            if (!ignore) setRows(Array.isArray(d) ? d : []);
        })();
        return () => { ignore = true; };
    }, []);

    const filtered = useMemo(() => {
        if (!q) return rows;
        const qq = q.toLowerCase();
        return rows.filter(c =>
            (c.name || "").toLowerCase().includes(qq) ||
            (c.seo_title || "").toLowerCase().includes(qq)
        );
    }, [rows, q]);

    const resetForm = () => {
        setEditingId(null);
        setForm({ name: "", seo_title: "", seo_description: "" });
    };

    const submit = async () => {
        if (editingId) await updateCategory(editingId, form);
        else await createCategory(form);
        resetForm();
        load();
    };

    const edit = (c) => {
        setEditingId(c.id);
        setForm({
            name: c.name || "",
            seo_title: c.seo_title || "",
            seo_description: c.seo_description || ""
        });
    };

    const remove = async (id) => {
        if (!confirm(t("admin.categories.confirmDelete"))) return;
        await deleteCategory(id);
        load();
    };

    return (
        <div className={styles.grid}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                        className="input"
                        placeholder={t("admin.categories.search_placeholder")}
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        style={{ minWidth: 220 }}
                    />
                    <div className="badge">{filtered.length} {t("admin.categories.items_count")}</div>
                </div>
                <button className="btn btn--primary" onClick={resetForm}>+ {t("common.create_button")}</button>
            </div>

            {/* Form */}
            <div className="card panel">
                <div className={styles.formGrid}>
                    <div>
                        <label>{t("admin.categories.fields.name")}</label>
                        <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                        <label>{t("admin.categories.fields.seoTitle")}</label>
                        <input className="input" value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label>{t("admin.categories.fields.seoDescription")}</label>
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
                            <th>{t("admin.categories.fields.name")}</th>
                            <th>{t("admin.categories.fields.seoTitle")}</th>
                            <th>{t("admin.categories.fields.seoDescription")}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.name}</td>
                                <td>{c.seo_title}</td>
                                <td>{c.seo_description}</td>
                                <td className={styles.actions}>
                                    <button className="btn" onClick={() => edit(c)}>{t("common.edit_button")}</button>
                                    <button className="btn btn--danger" onClick={() => remove(c.id)}>{t("common.delete_button")}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
