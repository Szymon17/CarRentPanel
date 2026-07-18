export type StatusVariant = "success" | "warning" | "danger" | "info";

export const getStatusVariant = (statusName?: string, closed?: boolean): StatusVariant => {
  const name = (statusName ?? "").toLowerCase();
  if (name.includes("cancel") || name.includes("anulow") || name.includes("odrzuc")) return "danger";
  if (name.includes("pending") || name.includes("oczek") || name.includes("nowe")) return "warning";
  if (closed || name.includes("complet") || name.includes("zako") || name.includes("finish") || name.includes("zwróc")) return "success";
  return "info";
};
