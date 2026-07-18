import "./Orders.sass";
import Chevron from "bootstrap-icons/icons/chevron-right.svg?react";
import type { ColumnsDef } from "@/components/Table/types";
import type { OrderWithCarView, PaymentMethodEntity } from "@/types/orders.types";
import { getStatusVariant } from "@/utils/orderStatus";

export type OrderColumnsUnion = OrderWithCarView & { toOrder: string };

const getColumns = (paymentMethods: PaymentMethodEntity[]): ColumnsDef<OrderColumnsUnion> => {
  const paymentMethodNameById = new Map(paymentMethods.map(pm => [pm.id, pm.name]));

  return {
    id: {
      header: "ID",
      cell: row => row.getValue(),
      meta: { className: "orders__id" },
    },
    carImageUrl: {
      header: "Car Image",
      cell: row => <img src={row.getValue()}></img>,
      meta: { className: "orders__car-image" },
    },
    carModel: {
      header: "Car Model",
      cell: row => row.getValue(),
      meta: { className: "orders__car-model" },
    },
    user: {
      header: "Customer Data",
      cell: row => {
        const user = row.getValue();

        if (!user) return <span className="orders__customer-empty">#{row.rowData.userId}</span>;

        return (
          <div className="orders__customer">
            <span className="orders__customer-name">
              {user.name} {user.surname}
            </span>
            <span className="orders__customer-email">{user.email}</span>
            <span className="orders__customer-id">ID {user.id}</span>
          </div>
        );
      },
      meta: { className: "orders__user-id" },
    },
    dateOfReceipt: {
      header: "Date of Receipt",
      cell: row => row.getValue() ?? "—",
      meta: { className: "orders__date-receipt" },
    },
    dateOfReturn: {
      header: "Date of Return",
      cell: row => {
        const value = row.getValue();
        return value ? new Date(value).toLocaleDateString("pl-PL") : "—";
      },
      meta: { className: "orders__date-return" },
    },
    placeOfReceipt: {
      header: "Place of Receipt",
      cell: row => row.getValue(),
      meta: { className: "orders__place-receipt" },
    },
    placeOfReturn: {
      header: "Place of Return",
      cell: row => row.getValue(),
      meta: { className: "orders__place-return" },
    },
    paymentMethodId: {
      header: "Payment Method",
      cell: row => paymentMethodNameById.get(row.getValue()) ?? `#${row.getValue()}`,
      meta: { className: "orders__payment" },
    },
    statusName: {
      header: "Status",
      cell: row => {
        const statusName = row.getValue();
        const variant = getStatusVariant(statusName);
        return <span className={`orders__status-badge orders__status-badge--${variant}`}>{statusName}</span>;
      },
      meta: { className: "orders__status" },
    },
    addDate: {
      header: "Created At",
      cell: row => row.getValue(),
      meta: { className: "orders__add-date" },
    },
    toOrder: {
      header: "To the order",
      cell: row => (
        <a href={`/orders/order?id=${row.rowData.id}`}>
          <Chevron />
        </a>
      ),
      meta: { className: "orders__view" },
    },
  };
};

export default getColumns;
