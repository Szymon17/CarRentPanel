import { useEffect, useMemo, useState } from "react";
import createTable from "@/components/Table/Table.component";
import getColumns, { type CarColumnsUnion } from "./carColumns";
import { Link } from "react-router-dom";

const Cars = () => {
  const [cars, setCars] = useState<CarColumnsUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const httpGetCarsList = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      setLoading(true);
      setError(null);
      const req = await fetch(`${serverUrl}/cars/list`, { credentials: "include" });
      const res = await req.json();

      if (Array.isArray(res.cars)) {
        setCars(res.cars);
      } else {
        setError("Invalid response format");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load cars data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    httpGetCarsList();
  }, []);

  const CarsTable = useMemo(() => {
    const columns = getColumns();
    return createTable(cars, columns);
  }, [cars]);

  if (loading) {
    return (
      <div className="cars">
        <div className="cars__loading">
          <p>Loading cars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cars">
        <div className="cars__error">
          <p>{error}</p>
          <button onClick={httpGetCarsList} className="cars__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cars">
      <div className="cars__actions">
        <Link to="/cars/create" className="cars__create-btn">
          + Create New Car
        </Link>
      </div>

      <div className="cars__table-wrapper">
        <table className="cars__table">
          <thead>
            <tr>{CarsTable.headers.map(header => header.Node)}</tr>
          </thead>
          <tbody>
            {CarsTable.rows.length > 0 ? (
              CarsTable.rows.map(row => row.rowNode)
            ) : (
              <tr>
                <td colSpan={CarsTable.headers.length} className="cars__empty">
                  No cars found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cars;
