import React from "react";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartBadgeButton() {
    const { count } = useCart();
    const nav = useNavigate();
    return (
        <IconButton onClick={() => nav("/cart")} size="large" aria-label="cart">
            <Badge badgeContent={count} color="primary">
                <ShoppingCartIcon />
            </Badge>
        </IconButton>
    );
}
