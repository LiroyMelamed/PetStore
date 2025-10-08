import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function StockToggle({ checked, onChange, label = "רק במלאי" }) {
    return (
        <FormControlLabel
            control={<Switch checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} />}
            label={label}
        />
    );
}
