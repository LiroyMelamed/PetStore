import { useEffect, useState } from "react";
import { fetchAllBanners, fetchBanners, createBanner, updateBanner, deleteBannerApi } from "../api";
import styles from "./AdminBanners.module.scss";
import { useTranslation } from "react-i18next";

export default function AdminBanners() {
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);
    const [form, setForm] = useState({ title: "", image_url: "", link_url: "", is_active: true, position: 0 });
    const [editing, setEditing] = useState(null);


    const load = async () => {
        const data = await fetchAllBanners();
        setRows(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            const d = await fetchAllBanners();
            if (!ignore) setRows(d || []);
        })();
        return () => { ignore = true; };
    }, []);

    const submit = async () => {
        const payload = { ...form, position: Number(form.position) || 0 };
        if (editing) await updateBanner(editing.id, payload);
        else await createBanner(payload);
        setEditing(null);
        setForm({ title: "", image_url: "", link_url: "", is_active: true, position: 0 });
        load();
    };

    const edit = (b) => { setEditing(b); setForm({ title: b.title || "", image_url: b.image_url || "", link_url: b.link_url || "", is_active: !!b.is_active, position: b.position || 0 }); };
    const del = async (id) => { if (!confirm(t("admin.banners.confirmDelete"))) return; await deleteBannerApi(id); load(); };
    const toggleActive = async (b) => { await updateBanner(b.id, { is_active: !b.is_active }); load(); };

    return (
        <div className={styles.grid}>
            <div className="card panel">
                <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
                    <div>
                        <label>{t("admin.banners.fields.title")}</label>
                        <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div>
                        <label>{t("admin.banners.fields.linkUrl")}</label>
                        <input className="input" value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label>{t("admin.banners.fields.imageUrl")}</label>
                        <input className="input" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
                    </div>
                    <div>
                        <label>{t("admin.banners.fields.position")}</label>
                        <input className="input" type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
                    </div>
                    <div>
                        <label>{t("admin.banners.fields.active")}</label>
                        <select value={form.is_active ? "1" : "0"} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "1" }))}>
                            <option value="1">{t("status.active")}</option>
                            <option value="0">{t("status.inactive")}</option>
                        </select>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 12 }}>
                    <button className="btn btn--primary" onClick={submit}>{editing ? t("common.save_button") : t("common.create_button")}</button>
                    {editing && <button className="btn" onClick={() => { setEditing(null); setForm({ title: "", image_url: "", link_url: "", is_active: true, position: 0 }); }}>{t("common.cancel_button")}</button>}
                </div>
            </div>

            <div className={styles.cards}>
                {rows.map(b => (
                    <div key={b.id} className={styles.card}>
                        <div className={styles.title}>{b.title}</div>
                        <div className={styles.meta}>{b.link_url}</div>
                        <img className={styles.img} src={b.image_url} alt={b.title} />
                        <div className={styles.row}>
                            <span className="badge">{b.is_active ? t("status.active") : t("status.inactive")}</span>
                            <button className="btn" onClick={() => edit(b)}>{t("common.edit_button")}</button>
                            <button className="btn" onClick={() => toggleActive(b)}>{b.is_active ? t("admin.banners.deactivate") : t("admin.banners.activate")}</button>
                            <button className="btn btn--danger" onClick={() => del(b.id)}>{t("common.delete_button")}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
