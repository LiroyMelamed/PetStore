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
        <Card
            sx={{
                borderRadius: 4,
                boxShadow: 3,
                height: "100%",
                maxWidth: "13rem",
                display: "flex",
                flexDirection: "column",
            }}
            onClick={onClick}
        >
            <CardActionArea
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                {/* Fixed image aspect ratio */}
                <Box sx={{ position: "relative", width: "100%", aspectRatio: "4 / 3", bgcolor: "#fff" }}>
                    <CardMedia
                        component="img"
                        image={image_url || "https://placehold.co/800x600?text=PetShop"}
                        alt={name}
                        sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </Box>

                {/* Content */}
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        flexGrow: 1,                     // take remaining height
                    }}
                >
                    {/* Title – clamp to 2 lines */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.6em",            // reserve height for 2 lines
                        }}
                    >
                        {name}
                    </Typography>

                    {/* Description – clamp to 2 lines */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.4em",
                        }}
                    >
                        {description || ""}
                    </Typography>

                    {/* Price pinned to bottom */}
                    <Box sx={{ mt: "auto", pt: 1, display: "flex", gap: 1, alignItems: "baseline" }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            ₪{Number(price || 0).toFixed(2)}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
