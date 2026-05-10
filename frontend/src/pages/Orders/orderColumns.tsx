import "./Orders.sass";
import type { ColumnsDef } from "@/components/Table/types";
import type { OrderEntity } from "@/types/orders.types";

const getColumns = (): ColumnsDef<OrderEntity> => {
  return {
    id: {
      header: "ID",
      cell: row => row.getValue(),
      meta: { className: "orders__id" },
    },
    carId: {
      header: "Car ID",
      cell: row => row.getValue(),
    },
    userId: {
      header: "User ID",
      cell: row => row.getValue(),
    },
    dateOfReceipt: {
      header: "Date of Receipt",
      cell: row => row.getValue() ?? "—",
    },
    dateOfReturn: {
      header: "Date of Return",
      cell: row => new Date(row.getValue()).toLocaleDateString("pl-PL"),
    },
    placeOfReceipt: {
      header: "Place of Receipt",
      cell: row => row.getValue(),
    },
    placeOfReturn: {
      header: "Place of Return",
      cell: row => row.getValue(),
    },
    paymentMethodId: {
      header: "Payment Method",
      cell: row => row.getValue(),
    },
    statusId: {
      header: "Status",
      cell: row => row.getValue(),
    },
    addDate: {
      header: "Created At",
      cell: row => row.getValue(),
    },
  };
};

export default getColumns;
