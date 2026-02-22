import "./Cars.sass";
import type { ColumnsDef } from "@/components/Table/types";
import type { CarEntity } from "@/types/cars.types";
import Chevron from "bootstrap-icons/icons/chevron-right.svg?react";

export type CarColumnsUnion = CarEntity & {
  view: string;
};

const getColumns = (): ColumnsDef<CarColumnsUnion> => {
  return {
    id: {
      header: "ID",
      cell: row => row.getValue(),
      meta: { className: "cars__id" },
    },
    imageUrl: {
      header: "Image",
      cell: row => (
        <a href={`/cars/car?id=${row.rowData.id}`}>
          <img src={row.getValue()} alt={row.rowData.brand + " " + row.rowData.model} />
        </a>
      ),
      meta: {
        className: "cars__img",
      },
    },
    brand: {
      header: "Brand",
      cell: row => row.getValue(),
    },
    model: {
      header: "Model",
      cell: row => row.getValue(),
    },
    year: {
      header: "Year",
      cell: row => row.getValue(),
    },
    power: {
      header: "Power",
      cell: row => row.getValue() + "hp",
    },
    fuelType: {
      header: "Fuel type",
      cell: row => row.getValue(),
    },
    dailyPrice: {
      header: "Daily price",
      cell: row => row.getValue() + "PLN",
    },
    view: {
      header: "View",
      cell: row => (
        <a href={`/cars/car?id=${row.rowData.id}`}>
          <Chevron />
        </a>
      ),
    },
  };
};

export default getColumns;
