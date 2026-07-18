import "./Order.styles.sass";
import "react-datepicker/dist/react-datepicker.css";
import Button, { BUTTON_TYPES } from "@/components/Button/Button.component";
import Loader from "@/components/Loader/Loader.component";
import CarFrontFill from "bootstrap-icons/icons/car-front-fill.svg?react";
import GeoAltFill from "bootstrap-icons/icons/geo-alt-fill.svg?react";
import CheckCircle from "bootstrap-icons/icons/check-circle-fill.svg?react";
import XCircle from "bootstrap-icons/icons/x-circle-fill.svg?react";
import InfoCircle from "bootstrap-icons/icons/info-circle-fill.svg?react";
import FlagFill from "bootstrap-icons/icons/flag-fill.svg?react";
import CalendarEventFill from "bootstrap-icons/icons/calendar-event-fill.svg?react";
import PersonFill from "bootstrap-icons/icons/person-fill.svg?react";
import { getStatusVariant } from "@/utils/orderStatus";
import useOrderForm from "./useOrderForm";
import CustomerSearch from "./CustomerSearch.component";
import { OrderDateField, OrderSelectField } from "./OrderFormFields.component";

const Order = () => {
  const OrderForm = useOrderForm();

  if (OrderForm.loading || !OrderForm.form) {
    return (
      <div className="order_page">
        <Loader />
      </div>
    );
  }

  const { isCreateMode, order, form, statuses, localizations, paymentMethods, cars, errors } = OrderForm;

  const selectedCar = isCreateMode ? cars.find(car => car.id === form.carId) : null;
  const heroBrand = isCreateMode ? selectedCar?.brand : order?.carBrand;
  const heroModel = isCreateMode ? selectedCar?.model : order?.carModel;
  const heroImage = isCreateMode ? selectedCar?.imageUrl : order?.carImageUrl;

  const currentStatus = statuses.find(status => status.id === form.statusId);
  const statusVariant = getStatusVariant(order?.statusName ?? currentStatus?.name, currentStatus?.closed);

  const statusOptions = statuses.map(status => ({ value: String(status.id), label: status.name }));
  const carOptions = cars.map(car => ({ value: String(car.id), label: `${car.brand} ${car.model}` }));
  const paymentMethodOptions = paymentMethods.map(pm => ({ value: String(pm.id), label: pm.name }));
  const localizationOptions = localizations.map(loc => ({ value: loc.localization, label: loc.localization }));

  return (
    <div className="order_page">
      <div className="order_page__header">
        <div className="order_page__header-content">
          <div className="order_page__header-left">
            <div className="order_page__breadcrumb">
              <a href="/orders">Orders</a>
              <span className="order_page__breadcrumb-sep">/</span>
              <span>{isCreateMode ? "Create New Order" : `Order #${order?.id}`}</span>
            </div>
            <h1 className="order_page__page-title">{isCreateMode ? "Create New Order" : "Edit Order"}</h1>
          </div>
          <div className="order_page__header-actions">
            {!isCreateMode && order && (
              <div className={`order_page__status-badge order_page__status-badge--${statusVariant}`}>
                <span className="order_page__status-dot"></span>
                {order.statusName}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="order_page__container">
        <div className="order_page__hero-section">
          <div className={`order_page__hero-card order_page__hero-card--${statusVariant}`}>
            <div className="order_page__hero-image-wrapper">
              {heroImage ? (
                <div className="order_page__hero-image">
                  <img src={heroImage} alt={`${heroBrand} ${heroModel}`} />
                </div>
              ) : (
                <div className="order_page__hero-empty">
                  <CarFrontFill className="order_page__hero-empty-icon" />
                  <p>{isCreateMode ? "Select a vehicle to preview it here" : "No vehicle image"}</p>
                </div>
              )}
            </div>
            <div className="order_page__hero-info">
              <div className="order_page__hero-title-section">
                <h2 className="order_page__hero-title">{heroBrand && heroModel ? `${heroBrand} ${heroModel}` : "Select a vehicle"}</h2>
                {!isCreateMode && order && <p className="order_page__hero-subtitle">Order placed on {order.addDate}</p>}
              </div>
              <div className="order_page__hero-specs">
                <div className="order_page__hero-spec">
                  <span className="order_page__hero-spec-label">Place of Receipt</span>
                  <span className="order_page__hero-spec-value order_page__hero-spec-with-icon">
                    <GeoAltFill />
                    {form.placeOfReceipt || "—"}
                  </span>
                </div>
                <div className="order_page__hero-spec">
                  <span className="order_page__hero-spec-label">Place of Return</span>
                  <span className="order_page__hero-spec-value order_page__hero-spec-with-icon">
                    <GeoAltFill />
                    {form.placeOfReturn || "—"}
                  </span>
                </div>
                <div className="order_page__hero-spec">
                  <span className="order_page__hero-spec-label">Payment Method</span>
                  <span className="order_page__hero-spec-value">
                    {paymentMethodOptions.find(o => Number(o.value) === form.paymentMethodId)?.label ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order_page__form-container">
          {OrderForm.message && (
            <div
              className={`order_page__message ${OrderForm.message.includes("successfully") ? "order_page__message--success" : "order_page__message--error"}`}
            >
              {OrderForm.message.includes("successfully") ? (
                <CheckCircle className="order_page__message-icon" />
              ) : (
                <XCircle className="order_page__message-icon" />
              )}
              <span>{OrderForm.message}</span>
            </div>
          )}

          <div className="order_page__form-section">
            <div className="order_page__form-header">
              <PersonFill className="order_page__form-header-icon" />
              <div className="order_page__form-header-content">
                <h3>Customer</h3>
                <p>Person the order is placed for</p>
              </div>
            </div>
            <CustomerSearch
              selectedCustomer={OrderForm.selectedCustomer}
              query={OrderForm.customerQuery}
              results={OrderForm.customerResults}
              open={OrderForm.customerSearchOpen}
              error={errors.userId}
              inputRef={OrderForm.customerSearchRef}
              onQueryChange={value => {
                OrderForm.setCustomerQuery(value);
                OrderForm.setCustomerSearchOpen(true);
              }}
              onFocus={() => OrderForm.setCustomerSearchOpen(true)}
              onSelect={OrderForm.handleSelectCustomer}
            />
          </div>

          {isCreateMode && (
            <div className="order_page__form-section">
              <div className="order_page__form-header">
                <CarFrontFill className="order_page__form-header-icon" />
                <div className="order_page__form-header-content">
                  <h3>Vehicle</h3>
                  <p>Choose the vehicle for this order</p>
                </div>
              </div>
              <div className="order_page__form-grid order_page__form-grid--1col">
                <OrderSelectField
                  label="Vehicle"
                  value={form.carId}
                  options={carOptions}
                  required
                  error={errors.carId}
                  onChange={value => OrderForm.setField("carId", Number(value))}
                />
              </div>
            </div>
          )}

          <div className="order_page__form-section">
            <div className="order_page__form-header">
              <InfoCircle className="order_page__form-header-icon" />
              <div className="order_page__form-header-content">
                <h3>Order Details</h3>
                <p>Rental locations and order date</p>
              </div>
            </div>
            <div className="order_page__form-grid order_page__form-grid--2col">
              <OrderDateField
                label="Order Date"
                value={form.addDate}
                required
                error={errors.addDate}
                onChange={value => OrderForm.setField("addDate", value)}
              />
              <OrderSelectField
                label="Place of Receipt"
                value={form.placeOfReceipt}
                options={localizationOptions}
                required
                error={errors.placeOfReceipt}
                onChange={value => OrderForm.setField("placeOfReceipt", value)}
              />
              <OrderSelectField
                label="Place of Return"
                value={form.placeOfReturn}
                options={localizationOptions}
                required
                error={errors.placeOfReturn}
                onChange={value => OrderForm.setField("placeOfReturn", value)}
              />
            </div>
          </div>

          <div className="order_page__form-section">
            <div className="order_page__form-header">
              <CalendarEventFill className="order_page__form-header-icon" />
              <div className="order_page__form-header-content">
                <h3>Rental Period</h3>
                <p>Receipt and return dates</p>
              </div>
            </div>
            <div className="order_page__form-grid order_page__form-grid--2col">
              <OrderDateField
                label="Expected Return Date"
                value={form.expectedReturnDate}
                required
                error={errors.expectedReturnDate}
                onChange={value => OrderForm.setField("expectedReturnDate", value)}
              />
              <OrderDateField
                label="Date of Receipt"
                value={form.dateOfReceipt}
                withTime
                onChange={value => OrderForm.setField("dateOfReceipt", value)}
              />
              <OrderDateField
                label="Date of Return"
                value={form.dateOfReturn}
                withTime
                onChange={value => OrderForm.setField("dateOfReturn", value)}
              />
            </div>
          </div>

          <div className="order_page__form-section">
            <div className="order_page__form-header">
              <FlagFill className="order_page__form-header-icon" />
              <div className="order_page__form-header-content">
                <h3>Status & Payment</h3>
                <p>Order status and payment method</p>
              </div>
            </div>
            <div className="order_page__form-grid order_page__form-grid--2col">
              <OrderSelectField
                label="Status"
                value={form.statusId}
                options={statusOptions}
                required
                error={errors.statusId}
                onChange={value => OrderForm.setField("statusId", Number(value))}
              />
              <OrderSelectField
                label="Payment Method"
                value={form.paymentMethodId}
                options={paymentMethodOptions}
                required
                error={errors.paymentMethodId}
                onChange={value => OrderForm.setField("paymentMethodId", Number(value))}
              />
            </div>
          </div>

          <div className="order_page__actions-section">
            <div className="order_page__actions">
              <Button fn={OrderForm.handleSave} disabled={OrderForm.saving} className="order_page__btn-primary">
                {OrderForm.saving ? (isCreateMode ? "Creating..." : "Saving...") : isCreateMode ? "Create Order" : "Save Changes"}
              </Button>
              <Button fn={OrderForm.resetForm} buttonType={BUTTON_TYPES.SECONDARY}>
                {isCreateMode ? "Reset Form" : "Reset Changes"}
              </Button>
              {isCreateMode && (
                <Button fn={async () => OrderForm.navigate("/orders")} buttonType={BUTTON_TYPES.CANCEL}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
