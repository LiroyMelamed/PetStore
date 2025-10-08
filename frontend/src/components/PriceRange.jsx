import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function PriceRange({ value = [0, 1000], onChange }) {
    const [min, max] = value;

    const set = (nv) => onChange?.(nv);

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 320 }}>
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>מחיר</Typography>
            <TextField
                size="small"
                type="number"
                label="מינ'"
                value={min}
                onChange={(e) => set([Number(e.target.value || 0), max])}
                sx={{ width: 90 }}
            />
            <TextField
                size="small"
                type="number"
                label="מקס'"
                value={max}
                onChange={(e) => set([min, Number(e.target.value || 0)])}
                sx={{ width: 90 }}
            />
            <Box sx={{ flex: 1, px: 1 }}>
                <Slider
                    value={[min, max]}
                    onChange={(_, nv) => set(nv)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5000}
                    step={10}
                />
            </Box>
        </Box>
    );
}
