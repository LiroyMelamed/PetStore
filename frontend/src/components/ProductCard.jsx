import * as React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function ProductCard({ product, onClick }) {
    if (!product) return null;
    const { name, price, image_url, description } = product;

    return (
        <Card className="product-card" sx={{ borderRadius: 4, boxShadow: 3 }} onClick={onClick}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    image={image_url || "https://placehold.co/600x400?text=PetStore"}
                    alt={name}
                    sx={{ height: 200, objectFit: "cover" }}
                />
                <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {description || ""}
                    </Typography>
                    <Box sx={{ mt: 1.5, display: "flex", gap: 1, alignItems: "baseline" }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            ₪{Number(price || 0).toFixed(2)}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
