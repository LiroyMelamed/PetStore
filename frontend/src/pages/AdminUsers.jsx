import { useEffect, useState } from "react";
import { setUserRole, fetchAdmins } from "../api";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);

    const load = async () => {
        const data = await fetchAdmins();
        setRows(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const data = await fetchAdmins();
                if (!ignore) setRows(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { ignore = true; };
    }, []);

    const changeRole = async (id, role) => {
        try { await setUserRole(id, role); load(); }
        catch (e) { alert(e?.error || "Error"); }
    };

    return (
        <div style={{ padding: 16 }}>
            <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
                <thead><tr>
                    <th>{t("users.columns.id")}</th>
                    <th>{t("users.columns.email")}</th>
                    <th>{t("users.columns.role")}</th>
                    <th>{t("users.columns.actions")}</th>
                </tr></thead>
                <tbody>
                    {rows.map(u => (
                        <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                            <td>{u.id}</td>
                            <td>{u.email}</td>
                            <td>{t(`users.roles.${u.role}`)}</td>
                            <td style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => changeRole(u.id, 'user')}>{t("users.roles.user")}</button>
                                <button onClick={() => changeRole(u.id, 'manager')}>{t("users.roles.manager")}</button>
                                <button onClick={() => changeRole(u.id, 'admin')}>{t("users.roles.admin")}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
