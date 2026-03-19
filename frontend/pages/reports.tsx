import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

type ReportsPayload = {
  sql: {
    dailyRevenue: Array<{ day: string; revenue: string }>;
    topSpenders: Array<{ id: number; name: string; email: string; total_spent: string }>;
  };
  mongo: {
    productsByCategory: Array<{
      _id: string;
      totalProducts: number;
      averagePrice: number;
      totalStock: number;
    }>;
  };
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportsPayload | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    apiRequest<ReportsPayload>("/reports", { token })
      .then(setReports)
      .catch((error) => setMessage((error as Error).message));
  }, []);

  return (
    <section>
      <h2>Reports</h2>
      {message && <p>{message}</p>}
      {reports && (
        <>
          <div className="card">
            <h3>Daily Revenue (Last 7 Days)</h3>
            {reports.sql.dailyRevenue.map((row) => (
              <p key={row.day}>
                {new Date(row.day).toLocaleDateString()}: ${Number(row.revenue).toFixed(2)}
              </p>
            ))}
          </div>
          <div className="card">
            <h3>Top 3 Spenders</h3>
            {reports.sql.topSpenders.map((spender) => (
              <p key={spender.id}>
                {spender.name} ({spender.email}) - ${Number(spender.total_spent).toFixed(2)}
              </p>
            ))}
          </div>
          <div className="card">
            <h3>Products by Category (Mongo Aggregation)</h3>
            {reports.mongo.productsByCategory.map((bucket) => (
              <p key={bucket._id}>
                {bucket._id}: {bucket.totalProducts} products, avg ${bucket.averagePrice.toFixed(2)}
              </p>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
