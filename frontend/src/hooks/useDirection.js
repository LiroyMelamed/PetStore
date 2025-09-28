// src/hooks/useDirection.js
import { useEffect } from "react";
import i18n from "../i18n";

export default function useDirection() {
    useEffect(() => {
        const lang = i18n.language || "he";
        document.dir = lang === "he" ? "rtl" : "ltr";
    }, [i18n.language]);
}
