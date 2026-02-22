import "./Table.styles.sass";
import { type ReactNode, type RefObject } from "react";
import { type ColumnsDef, type ColumnDef, type RowType, type metaData } from "./types";

type HeaderOb = { id: string; Node: string | ReactNode; meta?: metaData };

type TableReturnType<D> = {
  headers: HeaderOb[];
  rows: { rowNode: ReactNode; columnsOb: RowType<D, keyof D>[] }[];
};

const createRowObject = <D,>(column: ColumnDef<D, keyof D>, rowData: D, key: keyof D, value: D[keyof D]): RowType<D, keyof D> => {
  const rowOb: RowType<D, keyof D> = {
    id: key,
    header: column.header,
    getValue: () => value,
    rowData,
  };

  if (column.meta) rowOb.meta = column.meta;

  return rowOb;
};

const createRow = <D,>(
  column: ColumnDef<D, keyof D>,
  rowData: D,
  key: keyof D,
  value: D[keyof D],
): { Node: ReactNode; rowOb: RowType<D, keyof D> } => {
  const rowOb = createRowObject(column, rowData, key, value);
  const row = column.cell(rowOb) as ReactNode;

  const props: { className?: string } = {};

  if (column.meta?.className) props.className = column.meta?.className;

  return {
    Node: (
      <td {...props} key={rowOb.id.toString()}>
        {row}
      </td>
    ),
    rowOb,
  };
};

const createTable = <D,>(data: D[], columnsStruct: ColumnsDef<D>): TableReturnType<D> => {
  const rows = data.map((row, index) => {
    const columnNodes: ReactNode[] = [];
    const columnsOb: RowType<D, keyof D>[] = [];

    (Object.keys(columnsStruct as object) as (keyof D)[]).forEach(key => {
      const tdValue = row[key];
      const column = columnsStruct[key];

      if (column) {
        const { Node, rowOb } = createRow(column, row, key, tdValue);

        columnsOb.push(rowOb);
        columnNodes.push(Node);
      }
    });

    return { rowNode: <tr key={index}>{columnNodes.map(column => column)}</tr>, columnsOb };
  });

  const headers = (Object.entries(columnsStruct) as [string, ColumnDef<D, keyof D>][]).map(([key, headerDef]) => {
    const headerOb: HeaderOb = { Node: <th>{headerDef.header}</th>, id: key };

    const headerDataOb = { id: key };

    if (headerDef.headerFn) headerOb.Node = headerDef.headerFn(headerDataOb);
    if (headerDef.meta) headerOb.meta = headerDef.meta;

    return headerOb;
  });

  return { headers, rows };
};

export const setSameHeightForRows = (tableRef: RefObject<HTMLTableElement>) => {
  if (!tableRef.current) return;

  let maxHeight = 0;

  const rows = tableRef.current.querySelectorAll("td");

  rows.forEach(td => {
    if (maxHeight < +td.style.height) maxHeight = +td.style.height;
  });

  rows.forEach(td => {
    td.style.height = maxHeight + "px";
  });
};

export default createTable;
