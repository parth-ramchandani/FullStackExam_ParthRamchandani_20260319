import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

type CartResponse = {
  items: Array<{ productId: string; quantity: number }>;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse>({ items: [] });
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadCart = async () => {
    if (!token) return;
    try {
      const data = await apiRequest<CartResponse>("/cart", { token });
      setCart(data);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const checkout = async () => {
    if (!token) return;
    try {
      const data = await apiRequest<{ orderId: number }>("/orders/checkout", {
        method: "POST",
        token
      });
      setMessage(`Checkout complete. Order #${data.orderId}.`);
      loadCart();
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items.length === 0 && <p>Cart is empty.</p>}
      {cart.items.map((item) => (
        <div className="card" key={item.productId}>
          <p>Product: {item.productId}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
      {cart.items.length > 0 && (
        <button className="btn" onClick={checkout}>
          Checkout
        </button>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
