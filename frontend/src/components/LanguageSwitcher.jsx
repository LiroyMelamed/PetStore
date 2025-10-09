// src/components/LanguageSwitcher.jsx
import { Button } from "@mui/material";
import i18n from "../i18n";

export default function LanguageSwitcher({ className }) {
    const toggleLanguage = () => {
        const newLang = i18n.language === "he" ? "en" : "he";
        i18n.changeLanguage(newLang);
        localStorage.setItem("i18nextLng", newLang);
        document.dir = newLang === "he" ? "rtl" : "ltr";
    };

    return (
        <Button onClick={toggleLanguage} className={className}>
            {i18n.language === "he" ? "English" : "עברית"}
        </Button>
    );
}
