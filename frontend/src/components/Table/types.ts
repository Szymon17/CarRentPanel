import { ReactNode } from "react";

export type PrimitiveType = string | number | Date | null | boolean;

type HeaderEither<T> =
  | { header: React.ReactNode | string; headerFn?: never }
  | { header?: never; headerFn: (header: HeaderDataOb) => React.ReactNode | string };

export type metaData = {
  searchable?: boolean;
  className?: string;
  aditionalButton?: JSX.Element;
};

export type ColumnDef<T, K extends keyof T> = HeaderEither<T> & {
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
