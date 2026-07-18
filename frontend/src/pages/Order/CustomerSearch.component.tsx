import { type RefObject } from "react";
import PersonFill from "bootstrap-icons/icons/person-fill.svg?react";
import EnvelopeFill from "bootstrap-icons/icons/envelope-fill.svg?react";
import TelephoneFill from "bootstrap-icons/icons/telephone-fill.svg?react";
import Hash from "bootstrap-icons/icons/hash.svg?react";
import type { UserSummary } from "@/types/orders.types";
import { getInitials } from "./orderForm.utils";

type Props = {
  selectedCustomer: UserSummary | null;
  query: string;
  results: UserSummary[];
  open: boolean;
  error?: string;
  inputRef: RefObject<HTMLDivElement | null>;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onSelect: (customer: UserSummary) => void;
};

const CustomerSearch = ({ selectedCustomer, query, results, open, error, inputRef, onQueryChange, onFocus, onSelect }: Props) => {
  return (
    <div className="order_page__customer">
      {selectedCustomer ? (
        <div className="order_page__customer-card">
          <div className="order_page__customer-avatar">{getInitials(selectedCustomer.name, selectedCustomer.surname)}</div>
          <div className="order_page__customer-details">
            <div className="order_page__customer-name">
              {selectedCustomer.name} {selectedCustomer.surname}
            </div>
            <div className="order_page__customer-meta">
              <span>
                <EnvelopeFill /> {selectedCustomer.email}
              </span>
              <span>
                <TelephoneFill /> {selectedCustomer.phoneNumber}
              </span>
              <span>
                <Hash /> ID {selectedCustomer.id}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="order_page__customer-empty">
          <PersonFill />
          <p>Search for a customer below by ID or email to assign them to this order</p>
        </div>
      )}
      <div className="order_page__form-grid order_page__form-grid--1col order_page__customer-id-field">
        <div className="order_page__field" ref={inputRef}>
          <label>
            Customer
            <span className="order_page__required">*</span>
          </label>
          <div className="order_page__customer-search">
            <input
              type="text"
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              onFocus={onFocus}
              placeholder="Search by user ID or email..."
              autoComplete="off"
              className={error ? "order_page__input--error" : ""}
            />
            {open && results.length > 0 && (
              <div className="order_page__customer-suggestions">
                {results.map(customer => (
                  <div key={customer.id} className="order_page__customer-suggestion" onClick={() => onSelect(customer)}>
                    <span className="order_page__customer-suggestion-name">
                      {customer.name} {customer.surname}
                    </span>
                    <span className="order_page__customer-suggestion-meta">
                      {customer.email} · ID {customer.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <span className="order_page__field-error">{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default CustomerSearch;
