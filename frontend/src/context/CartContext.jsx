// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart.v1";

function normalizeProduct(p = {}) {
    return {
        id: String(p.id ?? p._id ?? ""),
        name: p.name ?? "",
        price: Number(p.price ?? 0),
        image_url: p.image_url ?? p.imageURL ?? p.image ?? "",
    };
}

function reducer(state, action) {
    switch (action.type) {
        case "INIT":
            return action.payload;
        case "ADD": {
            const { product, qty } = action.payload;
            if (!product.id) return state;
            const items = [...state.items];
            const idx = items.findIndex((i) => i.id === product.id);
            if (idx >= 0) {
                items[idx] = { ...items[idx], qty: Math.min(999, Number(items[idx].qty || 0) + Number(qty || 1)) };
            } else {
                items.push({ ...product, qty: Math.max(1, Number(qty) || 1) });
            }
            return { items };
        }
        case "REMOVE":
            return { items: state.items.filter((i) => i.id === undefined ? true : i.id !== String(action.payload)) };
        case "UPDATE_QTY": {
            const { id, qty } = action.payload;
            const q = Math.max(1, Math.min(999, Number(qty) || 1));
            return { items: state.items.map((i) => (String(i.id) === String(id) ? { ...i, qty: q } : i)) };
        }
        case "CLEAR":
            return { items: [] };
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, { items: [] });

    // טעינה מ-localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.items)) {
                    const items = parsed.items.map((i) => ({
                        ...i,
                        id: String(i.id ?? i._id ?? ""),
                        price: Number(i.price || 0),
                        qty: Number(i.qty || 1),
                    }));
                    dispatch({ type: "INIT", payload: { items } });
                }
            }
        } catch { }
    }, []);

    // שמירה ל-localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch { }
    }, [state]);

    const api = useMemo(() => {
        const addToCart = (p, qty = 1) => {
            const product = normalizeProduct(p);
            const q = Math.max(1, Number(qty) || 1);
            dispatch({ type: "ADD", payload: { product, qty: q } });
        };
        const removeFromCart = (id) => dispatch({ type: "REMOVE", payload: String(id) });
        const updateQty = (id, qty) => dispatch({ type: "UPDATE_QTY", payload: { id: String(id), qty } });
        const clearCart = () => dispatch({ type: "CLEAR" });

        const count = state.items.reduce((acc, i) => acc + Number(i.qty || 0), 0);
        const subtotal = state.items.reduce((acc, i) => acc + Number(i.price || 0) * Number(i.qty || 0), 0);
        const total = subtotal; // אם תוסיף משלוח/קופונים – לחשב כאן

        return { items: state.items, addToCart, removeFromCart, updateQty, clearCart, count, subtotal, total };
    }, [state]);

    return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
