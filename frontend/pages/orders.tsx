import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

type Order = {
  id: number;
  total_amount: string;
  created_at: string;
  items: Array<{ productId: string; quantity: number; priceAtPurchase: string }>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    apiRequest<Order[]>("/orders", { token })
      .then(setOrders)
      .catch((error) => setMessage((error as Error).message));
  }, []);

  return (
    <section>
      <h2>Order History</h2>
      {message && <p>{message}</p>}
      {orders.map((order) => (
        <article className="card" key={order.id}>
          <p>Order #{order.id}</p>
          <p>Total: ${Number(order.total_amount).toFixed(2)}</p>
          <p>Date: {new Date(order.created_at).toLocaleString()}</p>
          <p>Items: {order.items.length}</p>
        </article>
      ))}
    </section>
  );
}
