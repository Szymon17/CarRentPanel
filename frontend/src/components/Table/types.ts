import type { ReactNode } from "react";

export type PrimitiveType = string | number | Date | null | boolean;

type HeaderEither =
  | { header: React.ReactNode | string; headerFn?: never }
  | { header?: never; headerFn: (header: HeaderDataOb) => React.ReactNode | string };

export type metaData = {
  searchable?: boolean;
  className?: string;
  aditionalButton?: ReactNode;
};

export type ColumnDef<T, K extends keyof T> = HeaderEither & {
  meta?: metaData;
  cell: (row: RowType<T, K>) => T[K] | ReactNode;
};

export type ColumnsDef<T> = {
  [K in keyof T]?: ColumnDef<T, K>;
};

export type RowType<T, K extends keyof T> = {
  getValue: () => T[K];
  rowData: T;
  header: ReactNode | string;
  meta?: metaData;
  id: K;
};

export type HeaderDataOb = { id: string };
