import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Grid,
    Card,
    CardMedia,
    CardContent,
    TextField,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import {
    fetchProductById,
    fetchProductsByCategory,
    fetchReviewsForProduct,
    addReview,
} from "../api";

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newReview, setNewReview] = useState("");
    const [reviewer, setReviewer] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);

                if (data?.category_id) {
                    const relatedProducts = await fetchProductsByCategory(data.category_id);
                    setRelated(relatedProducts.filter((p) => p.id !== data.id));
                }

                const productReviews = await fetchReviewsForProduct(id);
                setReviews(productReviews);
            } catch (err) {
                console.error("Error loading product:", err);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleAddReview = async () => {
        if (!newReview.trim() || !reviewer.trim()) return;

        try {
            const reviewData = { product_id: id, reviewer, comment: newReview };
            const added = await addReview(reviewData);
            setReviews((prev) => [...prev, added]);
            setNewReview("");
            setReviewer("");
        } catch (err) {
            console.error("Error adding review:", err);
        }
    };

    if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
    if (!product) return <Typography variant="h6">המוצר לא נמצא</Typography>;

    return (
        <Box sx={{ mt: 4 }}>
            {/* פרטי מוצר */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            image={product.image_url || "/placeholder.png"}
                            alt={product.name}
                            sx={{ objectFit: "contain", height: 400 }}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>{product.name}</Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        ₪{product.price}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>{product.description}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addToCart(product)}
                    >
                        הוסף לסל
                    </Button>
                </Grid>
            </Grid>

            {/* חוות דעת */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom>חוות דעת</Typography>
                {reviews.length === 0 ? (
                    <Typography color="text.secondary">אין חוות דעת עדיין</Typography>
                ) : (
                    reviews.map((rev, i) => (
                        <Box key={i} sx={{ borderBottom: "1px solid #eee", py: 1 }}>
                            <Typography variant="subtitle2">{rev.reviewer}</Typography>
                            <Typography>{rev.comment}</Typography>
                        </Box>
                    ))
                )}

                {/* הוספת חוות דעת */}
                <Box sx={{ mt: 3 }}>
                    <TextField
                        label="השם שלך"
                        fullWidth
                        size="small"
                        value={reviewer}
                        onChange={(e) => setReviewer(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="כתוב חוות דעת"
                        fullWidth
                        multiline
                        rows={3}
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                    />
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={handleAddReview}
                    >
                        שלח חוות דעת
                    </Button>
                </Box>
            </Box>

            {/* מוצרים קשורים */}
            {related.length > 0 && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" gutterBottom>מוצרים קשורים</Typography>
                    <Grid container spacing={2}>
                        {related.map((rel) => (
                            <Grid item key={rel.id} xs={12} sm={6} md={3}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={rel.image_url || "/placeholder.png"}
                                        alt={rel.name}
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1">{rel.name}</Typography>
                                        <Typography color="text.secondary">₪{rel.price}</Typography>
                                        <Button
                                            variant="text"
                                            onClick={() => addToCart(rel)}
                                        >
                                            הוסף לסל
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}
