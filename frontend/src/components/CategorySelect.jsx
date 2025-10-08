import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function CategorySelect({ categories = [], value, onChange, label = "קטגוריה" }) {
    return (
        <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="cat-select-label">{label}</InputLabel>
            <Select
                labelId="cat-select-label"
                label={label}
                value={value ?? ""}
                onChange={(e) => onChange?.(e.target.value || null)}
            >
                <MenuItem value="">הכל</MenuItem>
                {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                        {c.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
