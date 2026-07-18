import DatePicker from "react-datepicker";
import Select from "@/components/Select/Select.component";
import { parseFormDate, toDateOnlyString, toDateTimeString } from "./orderForm.utils";

type OrderDateFieldProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  withTime?: boolean;
  required?: boolean;
  error?: string;
};

export const OrderDateField = ({ label, value, onChange, withTime = false, required = false, error }: OrderDateFieldProps) => (
  <div className="order_page__field">
    <label>
      {label}
      {required && <span className="order_page__required">*</span>}
    </label>
    <DatePicker
      selected={parseFormDate(value)}
      onChange={(date: Date | null) => onChange(date ? (withTime ? toDateTimeString(date) : toDateOnlyString(date)) : "")}
      showTimeSelect={withTime}
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat={withTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy"}
      placeholderText={withTime ? "Select date & time" : "Select date"}
      isClearable={!required}
      wrapperClassName="order_page__date-wrapper"
      className={error ? "order_page__input--error" : ""}
    />
    {error && <span className="order_page__field-error">{error}</span>}
  </div>
);

type OrderSelectFieldProps = {
  label: string;
  value?: number | string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
};

export const OrderSelectField = ({ label, value, onChange, options, required = false, error }: OrderSelectFieldProps) => (
  <div className="order_page__field">
    <label>
      {label}
      {required && <span className="order_page__required">*</span>}
    </label>
    <div className={error ? "order_page__select--error" : ""}>
      <Select
        options={options}
        value={value !== undefined ? String(value) : undefined}
        onChange={onChange}
        placeholder={`Select ${label.toLowerCase()}`}
      />
    </div>
    {error && <span className="order_page__field-error">{error}</span>}
  </div>
);
