import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import createTable from "@/components/Table/Table.component";
import getColumns from "./orderColumns";
import type { OrderEntity } from "@/types/orders.types";

const Orders = () => {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const httpGetOrders = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      setLoading(true);
      setError(null);
      const req = await fetch(`${serverUrl}/orders/list`, { credentials: "include" });
      const res = await req.json();

      if (Array.isArray(res)) {
        setOrders(res);
      } else {
        setError("Invalid response format");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load orders data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    httpGetOrders();
  }, []);

  const OrdersTable = useMemo(() => {
    const columns = getColumns();
    return createTable(orders, columns);
  }, [orders]);

  if (loading) {
    return (
      <div className="cars">
        <div className="cars__loading">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders">
        <div className="orders__error">
          <p>{error}</p>
          <button onClick={httpGetOrders} className="orders__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders__actions">
        <Link to="/orders/create" className="orders__create-btn">
          + Create New Order
        </Link>
      </div>

      <div className="orders__table-wrapper">
        <table className="orders__table">
          <thead>
            <tr>{OrdersTable.headers.map(header => header.Node)}</tr>
          </thead>
          <tbody>
            {OrdersTable.rows.length > 0 ? (
              OrdersTable.rows.map(row => row.rowNode)
            ) : (
              <tr>
                <td colSpan={OrdersTable.headers.length} className="orders__empty">
                  No order found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
