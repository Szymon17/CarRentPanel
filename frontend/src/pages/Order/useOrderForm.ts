import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { LocalizationEntity, OrderFormEntity, OrderWithCarView, PaymentMethodEntity, StatusEntity, UserSummary } from "@/types/orders.types";
import type { CarEntity } from "@/types/cars.types";
import { toDateInputValue, toDateTimeInputValue } from "./orderForm.utils";

const useOrderForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithCarView | null>(null);
  const [form, setForm] = useState<Partial<OrderFormEntity> | null>(null);
  const [statuses, setStatuses] = useState<StatusEntity[]>([]);
  const [localizations, setLocalizations] = useState<LocalizationEntity[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodEntity[]>([]);
  const [cars, setCars] = useState<CarEntity[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCustomer, setSelectedCustomer] = useState<UserSummary | null>(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerResults, setCustomerResults] = useState<UserSummary[]>([]);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const customerSearchRef = useRef<HTMLDivElement>(null);

  const orderId = useMemo(() => Number(searchParams.get("id")), [searchParams]);
  const isCreateMode = !orderId;

  const initializeForm = () => {
    setForm({
      id: 0,
      carId: undefined,
      userId: undefined,
      dateOfReceipt: "",
      dateOfReturn: "",
      placeOfReceipt: "",
      placeOfReturn: "",
      paymentMethodId: undefined,
      statusId: undefined,
      addDate: new Date().toISOString().slice(0, 10),
      expectedReturnDate: "",
    });
    setSelectedCustomer(null);
    setCustomerQuery("");
  };

  const httpGetOrderInfo = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;
    if (!orderId) return;

    try {
      const req = await fetch(`${serverUrl}/orders/order?id=${orderId}`, { credentials: "include" });
      const res = await req.json();

      if (req.ok) {
        setOrder(res);
        setForm({
          id: res.id,
          carId: undefined,
          userId: res.userId,
          dateOfReceipt: toDateTimeInputValue(res.dateOfReceipt),
          dateOfReturn: toDateTimeInputValue(res.dateOfReturn),
          placeOfReceipt: res.placeOfReceipt,
          placeOfReturn: res.placeOfReturn,
          paymentMethodId: res.paymentMethodId,
          statusId: res.statusId,
          addDate: toDateInputValue(res.addDate),
          expectedReturnDate: toDateInputValue(res.expectedReturnDate),
        });
        setSelectedCustomer(res.user ?? null);
        setCustomerQuery(res.user ? `${res.user.name} ${res.user.surname}` : "");
      } else {
        setMessage(res?.message ?? "Failed to load order data");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load order data");
    }
  };

  const httpGetStatuses = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      const req = await fetch(`${serverUrl}/orders/statuses`, { credentials: "include" });
      const res = await req.json();

      if (req.ok && Array.isArray(res)) {
        setStatuses(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const httpGetLocalizations = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      const req = await fetch(`${serverUrl}/localizations/list`, { credentials: "include" });
      const res = await req.json();

      if (req.ok && Array.isArray(res)) setLocalizations(res);
    } catch (error) {
      console.error(error);
    }
  };

  const httpGetPaymentMethods = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      const req = await fetch(`${serverUrl}/payment-methods/list`, { credentials: "include" });
      const res = await req.json();

      if (req.ok && Array.isArray(res)) setPaymentMethods(res);
    } catch (error) {
      console.error(error);
    }
  };

  const httpGetCars = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      const req = await fetch(`${serverUrl}/cars/list`, { credentials: "include" });
      const res = await req.json();

      if (req.ok && Array.isArray(res.cars)) setCars(res.cars);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const tasks: Promise<unknown>[] = [httpGetStatuses(), httpGetLocalizations(), httpGetPaymentMethods()];

      if (isCreateMode) {
        initializeForm();
        tasks.push(httpGetCars());
      } else {
        tasks.push(httpGetOrderInfo());
      }

      await Promise.all(tasks);
      setLoading(false);
    };

    load();
  }, [orderId, isCreateMode]);

  useEffect(() => {
    if (!customerSearchOpen || !customerQuery.trim()) {
      setCustomerResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const serverUrl = import.meta.env.VITE_API_URL;

      try {
        const req = await fetch(`${serverUrl}/customers/search?query=${encodeURIComponent(customerQuery.trim())}`, { credentials: "include" });
        const res = await req.json();

        if (req.ok && Array.isArray(res)) setCustomerResults(res);
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [customerQuery, customerSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerSearchRef.current && !customerSearchRef.current.contains(event.target as Node)) {
        setCustomerSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setField = <K extends keyof OrderFormEntity>(key: K, value: OrderFormEntity[K]) => {
    setForm(prev => (prev ? { ...prev, [key]: value } : prev));

    if (errors[key as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };

        delete newErrors[key as string];
        return newErrors;
      });
    }
  };

  const handleSelectCustomer = (customer: UserSummary) => {
    setField("userId", customer.id);
    setSelectedCustomer(customer);
    setCustomerQuery(`${customer.name} ${customer.surname}`);
    setCustomerResults([]);
    setCustomerSearchOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isCreateMode && !form?.carId) newErrors.carId = "Vehicle is required";
    if (!form?.userId || form.userId <= 0) newErrors.userId = "Valid user ID is required";
    if (!form?.placeOfReceipt?.trim()) newErrors.placeOfReceipt = "Place of receipt is required";
    if (!form?.placeOfReturn?.trim()) newErrors.placeOfReturn = "Place of return is required";
    if (!form?.statusId) newErrors.statusId = "Status is required";
    if (!form?.paymentMethodId) newErrors.paymentMethodId = "Payment method is required";
    if (!form?.addDate) newErrors.addDate = "Order date is required";
    if (!form?.expectedReturnDate) newErrors.expectedReturnDate = "Expected return date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!form) return;

    if (!validateForm()) {
      setMessage("Please fix all errors before saving");
      return;
    }

    setSaving(true);
    setMessage(null);

    const serverUrl = import.meta.env.VITE_API_URL;
    const method = isCreateMode ? "POST" : "PUT";
    const url = isCreateMode ? `${serverUrl}/orders/create` : `${serverUrl}/orders/order`;

    const body = isCreateMode
      ? {
          carId: form.carId,
          userId: form.userId,
          dateOfReceipt: form.dateOfReceipt || null,
          dateOfReturn: form.dateOfReturn || null,
          placeOfReceipt: form.placeOfReceipt,
          placeOfReturn: form.placeOfReturn,
          paymentMethodId: form.paymentMethodId,
          statusId: form.statusId,
          addDate: form.addDate,
          expectedReturnDate: form.expectedReturnDate,
        }
      : {
          id: orderId,
          userId: form.userId,
          dateOfReceipt: form.dateOfReceipt || null,
          dateOfReturn: form.dateOfReturn || null,
          placeOfReceipt: form.placeOfReceipt,
          placeOfReturn: form.placeOfReturn,
          paymentMethodId: form.paymentMethodId,
          statusId: form.statusId,
          addDate: form.addDate,
          expectedReturnDate: form.expectedReturnDate,
        };

    try {
      const req = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await req.json();

      if (req.ok) {
        if (isCreateMode) {
          setMessage("Order created successfully");
          setTimeout(() => navigate("/orders"), 1500);
        } else {
          setMessage("Saved successfully");
          await httpGetOrderInfo();
        }
      } else setMessage(res?.message ?? `Failed to ${isCreateMode ? "create" : "save"} order`);
    } catch (error) {
      console.error(error);
      setMessage(`Failed to ${isCreateMode ? "create" : "save"} order`);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = async () => {
    if (isCreateMode) initializeForm();
    else if (order) {
      setForm({
        id: order.id,
        carId: undefined,
        userId: order.userId,
        dateOfReceipt: toDateTimeInputValue(order.dateOfReceipt),
        dateOfReturn: toDateTimeInputValue(order.dateOfReturn),
        placeOfReceipt: order.placeOfReceipt,
        placeOfReturn: order.placeOfReturn,
        paymentMethodId: order.paymentMethodId,
        statusId: order.statusId,
        addDate: toDateInputValue(order.addDate),
        expectedReturnDate: toDateInputValue(order.expectedReturnDate),
      });

      setSelectedCustomer(order.user ?? null);
      setCustomerQuery(order.user ? `${order.user.name} ${order.user.surname}` : "");
    }

    setErrors({});
    setMessage(null);
  };

  return {
    navigate,
    orderId,
    isCreateMode,
    order,
    form,
    statuses,
    localizations,
    paymentMethods,
    cars,
    message,
    saving,
    loading,
    errors,
    selectedCustomer,
    customerQuery,
    customerResults,
    customerSearchOpen,
    customerSearchRef,
    setCustomerQuery,
    setCustomerSearchOpen,
    setField,
    handleSelectCustomer,
    handleSave,
    resetForm,
  };
};

export default useOrderForm;
