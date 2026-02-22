import { useEffect, useMemo, useState } from "react";
import createTable from "@/components/Table/Table.component";
import getColumns, { type CarColumnsUnion } from "./carColumns";

const Cars = () => {
  const [cars, setCars] = useState<CarColumnsUnion[]>([]);

  const getCarsList = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      const req = await fetch(`${serverUrl}/cars/list`, { credentials: "include" });
      const res = await req.json();

      if (Array.isArray(res.cars)) setCars(res.cars);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCarsList();
  }, []);

  const CarsTable = useMemo(() => {
    const columns = getColumns();

    return createTable(cars, columns);
  }, [cars]);

  return (
    <div className="cars">
      <table className="cars__table">
        <thead>
          <tr>{CarsTable.headers.map(header => header.Node)}</tr>
        </thead>
        <tbody>{CarsTable.rows.map(row => row.rowNode)}</tbody>
      </table>
    </div>
  );
};

export default Cars;
