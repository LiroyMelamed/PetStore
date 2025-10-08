import { useEffect } from "react";
import i18n from "../i18n";

export default function useDirection() {
    useEffect(() => {
        const apply = (lng) => {
            document.documentElement.lang = lng;
            document.documentElement.dir = lng === "he" ? "rtl" : "ltr";
        };
        apply(i18n.language);
        const onChange = (lng) => apply(lng);
        i18n.on("languageChanged", onChange);
        return () => i18n.off("languageChanged", onChange);
    }, []);
}
