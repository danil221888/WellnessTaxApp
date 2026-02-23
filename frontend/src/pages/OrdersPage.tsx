import { useEffect, useState } from "react";
import { getOrders, importOrders } from "../api/api";
import type { Order } from "../types";
import { OrderTable } from "../components/OrderTable";

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrders = async () => {
    try {
      setError("");
      const data = await getOrders();
      setOrders(data);
    } catch (err: any) {
      setError("Failed to fetch orders: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleImport = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await importOrders(file);
      setSuccess(`✓ Imported ${result.created} orders successfully!`);
      setTimeout(() => setSuccess(""), 3000);
      await fetchOrders();
      e.target.value = "";
    } catch (err: any) {
      setError("Import failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Orders</h1>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>✗ {error}</p>}

      <input 
        type="file" 
        accept=".csv" 
        onChange={handleImport} 
        disabled={loading}
      />
      {loading && <p>Importing...</p>}

      <OrderTable orders={orders} />
    </div>
  );
};