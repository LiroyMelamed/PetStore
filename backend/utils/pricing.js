// utils/pricing.js

/**
 * items: [{ product_id, qty, unit_price }]
 * currency: "ILS" | "USD" | "EUR" (ברירת מחדל ILS)
 * discount_code: למשל "DOG10", "CAT15", "FREESHIP"
 * shipping_method: "pickup" | "standard" | "express" (ברירת מחדל standard)
 */
function calcPricing({ items = [], currency = "ILS", discount_code = "", shipping_method = "standard" }) {
  const cleanNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  const subtotal = items.reduce((sum, it) => {
    const q = cleanNum(it.qty ?? it.quantity ?? 1);
    const p = cleanNum(it.unit_price ?? it.price ?? it.unitPrice ?? 0);
    return sum + q * p;
  }, 0);

  // כללי משלוח
  // standard = 20, express = 40, pickup = 0
  // מעל 300 ב-ILS -> standard חינם
  const shippingBase = (() => {
    if (shipping_method === "pickup") return 0;
    if (shipping_method === "express") return 40;
    return 20; // standard
  })();

  let shipping_fee = shippingBase;
  if (currency === "ILS" && shipping_method === "standard" && subtotal >= 300) {
    shipping_fee = 0;
  }

  // כללי קופונים
  // DOG10 => 10% הנחה, CAT15 => 15% הנחה, FREESHIP => משלוח חינם ב-standard
  const code = String(discount_code || "").trim().toUpperCase();
  let discount_amount = 0;
  let applied_discount = null;

  if (code === "DOG10") {
    discount_amount = subtotal * 0.10;
    applied_discount = { code, type: "percent", value: 10 };
  } else if (code === "CAT15") {
    discount_amount = subtotal * 0.15;
    applied_discount = { code, type: "percent", value: 15 };
  } else if (code === "FREESHIP") {
    if (shipping_method === "standard") shipping_fee = 0;
    applied_discount = { code, type: "freeship", value: 0 };
  }

  const grand_total = Math.max(0, subtotal - discount_amount + shipping_fee);

  return {
    currency,
    subtotal: Number(subtotal.toFixed(2)),
    discount_amount: Number(discount_amount.toFixed(2)),
    shipping_method,
    shipping_fee: Number(shipping_fee.toFixed(2)),
    grand_total: Number(grand_total.toFixed(2)),
    applied_discount, // null או אובייקט עם פרטים
  };
}

module.exports = { calcPricing };
