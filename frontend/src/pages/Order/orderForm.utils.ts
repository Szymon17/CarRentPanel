export const toDateInputValue = (value: string | null) => (value ? value.slice(0, 10) : "");
export const toDateTimeInputValue = (value: string | null) => (value ? value.slice(0, 16) : "");

const pad = (value: number) => String(value).padStart(2, "0");

export const toDateOnlyString = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const toDateTimeString = (date: Date) => `${toDateOnlyString(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
export const parseFormDate = (value?: string) => (value ? new Date(value) : null);
export const getInitials = (name?: string, surname?: string) => `${name?.[0] ?? ""}${surname?.[0] ?? ""}`.toUpperCase() || "?";
