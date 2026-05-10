import "./Car.styles.sass";
import Button from "@/components/Button/Button.component";
import Loader from "@/components/Loader/Loader.component";
import Popup from "@/components/Popup/Popup.component";
import Select from "@/components/Select/Select.component";
import type { CarEntity } from "@/types/cars.types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CarFrontFill from "bootstrap-icons/icons/car-front-fill.svg?react";
import GeoAltFill from "bootstrap-icons/icons/geo-alt-fill.svg?react";
import CheckCircle from "bootstrap-icons/icons/check-circle-fill.svg?react";
import XCircle from "bootstrap-icons/icons/x-circle-fill.svg?react";
import InfoCircle from "bootstrap-icons/icons/info-circle-fill.svg?react";
import Gear from "bootstrap-icons/icons/gear-fill.svg?react";
import FuelPumpFill from "bootstrap-icons/icons/fuel-pump-fill.svg?react";
import CurrencyDollar from "bootstrap-icons/icons/currency-dollar.svg?react";

const Car = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarEntity | null>(null);
  const [form, setForm] = useState<Partial<CarEntity> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [debouncedImageUrl, setDebouncedImageUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const carId = useMemo(() => Number(searchParams.get("id")), [searchParams]);
  const isCreateMode = !carId;

  const initializeForm = () => {
    setForm({
      id: 0,
      year: new Date().getFullYear(),
      numberOfSeats: 1,
      driveType: "",
      fuelType: "",
      dailyPrice: undefined,
      power: undefined,
      brand: "",
      model: "",
      engineCapacity: "",
      color: "",
      transmission: "",
      fuelUsageCity: "",
      fuelUsageOutcity: "",
      imageUrl: "",
      index: 0,
      localisation: "",
    });
  };

  const httpGetCarInfo = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;
    if (!carId) return;

    try {
      const req = await fetch(`${serverUrl}/cars/car?id=${carId}`, { credentials: "include" });
      const res = await req.json();

      if (req.ok) {
        setCar(res);
        setForm(res);
      } else {
        setMessage(res?.message ?? "Failed to load car data");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load car data");
    }
  };

  useEffect(() => {
    if (isCreateMode) {
      initializeForm();
    } else {
      httpGetCarInfo();
    }
  }, [carId, isCreateMode]);

  // Debounce image URL changes (only in create mode)
  useEffect(() => {
    if (!isCreateMode || !form?.imageUrl) {
      if (!isCreateMode) {
        setDebouncedImageUrl(form?.imageUrl || "");
      } else {
        setDebouncedImageUrl("");
      }
      setImageError(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setImageLoading(true);
      setImageError(false);

      try {
        const url = form.imageUrl || "";

        // Simple URL validation
        const isValidUrl = url.startsWith("http://") || url.startsWith("https://");

        if (isValidUrl) {
          setDebouncedImageUrl(url);
          setImageLoading(false);
        } else {
          setImageError(true);
          setImageLoading(false);
        }
      } catch (error) {
        setImageError(true);
        setImageLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [form?.imageUrl, isCreateMode]);

  const setField = <K extends keyof CarEntity>(key: K, value: CarEntity[K]) => {
    setForm(prev => (prev ? { ...prev, [key]: value } : prev));
    // Clear error for this field when user starts typing
    if (errors[key as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key as string];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form?.brand?.trim()) newErrors.brand = "Brand is required";
    if (!form?.model?.trim()) newErrors.model = "Model is required";
    if (!form?.year || form.year < 1900) newErrors.year = "Valid year is required";
    if (!form?.color?.trim()) newErrors.color = "Color is required";
    if (!form?.localisation?.trim()) newErrors.localisation = "Location is required";
    if (!form?.transmission?.trim()) newErrors.transmission = "Transmission is required";
    if (!form?.driveType?.trim()) newErrors.driveType = "Drive type is required";
    if (!form?.fuelType?.trim()) newErrors.fuelType = "Fuel type is required";
    if (!form?.engineCapacity?.trim()) newErrors.engineCapacity = "Engine capacity is required";
    if (!form?.power || form.power <= 0) newErrors.power = "Power must be greater than 0";
    if (!form?.numberOfSeats || form.numberOfSeats <= 0) newErrors.numberOfSeats = "Number of seats must be greater than 0";
    if (!form?.dailyPrice || form.dailyPrice < 0) newErrors.dailyPrice = "Daily price is required and must be non-negative";
    if (!form?.fuelUsageCity?.trim()) newErrors.fuelUsageCity = "City fuel usage is required";
    if (!form?.fuelUsageOutcity?.trim()) newErrors.fuelUsageOutcity = "Highway fuel usage is required";
    if (isCreateMode && !form?.imageUrl?.trim()) newErrors.imageUrl = "Image URL is required for new vehicles";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!form) return;

    // Validate form before saving
    if (!validateForm()) {
      setMessage("Please fix all errors before saving");
      return;
    }

    setSaving(true);
    setMessage(null);

    const serverUrl = import.meta.env.VITE_API_URL;
    const method = isCreateMode ? "POST" : "PUT";
    const url = isCreateMode ? `${serverUrl}/cars/create` : `${serverUrl}/cars/car`;

    try {
      // Convert undefined numeric values to 0 for API
      const cleanedForm = {
        ...form,
        dailyPrice: form.dailyPrice ?? 0,
        power: form.power ?? 0,
        numberOfSeats: form.numberOfSeats ?? 1,
        year: form.year ?? new Date().getFullYear(),
      };
      const body = isCreateMode ? cleanedForm : { ...cleanedForm, id: carId };
      const req = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await req.json();

      if (req.ok) {
        if (isCreateMode) {
          setMessage("Car created successfully");
          setTimeout(() => {
            navigate("/cars");
          }, 1500);
        } else {
          setCar(res);
          setForm(res);
          setMessage("Saved successfully");
        }
      } else {
        setMessage(res?.message ?? `Failed to ${isCreateMode ? "create" : "save"} car`);
      }
    } catch (error) {
      console.error(error);
      setMessage(`Failed to ${isCreateMode ? "create" : "save"} car`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!carId) return;

    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    setShowDeletePopup(false);

    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      const req = await fetch(`${serverUrl}/cars/car?id=${carId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (req.ok) {
        navigate("/cars");
      } else {
        const res = await req.json();
        setMessage(res?.message ?? "Failed to delete car");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete car");
    }
  };

  if (!form) {
    return (
      <div className="car_page">
        <Loader />
      </div>
    );
  }

  const numericField = (key: keyof CarEntity, label: string, required = false) => (
    <div className="car_page__field" key={key}>
      <label>
        {label}
        {required && <span className="car_page__required">*</span>}
      </label>
      <input
        type="number"
        value={form[key] ?? ""}
        onChange={e => {
          const value = e.target.value;
          setField(key, value === "" ? undefined : (Number(value) as any));
        }}
        required={required}
        className={errors[key as string] ? "car_page__input--error" : ""}
      />
      {errors[key as string] && <span className="car_page__field-error">{errors[key as string]}</span>}
    </div>
  );

  const textField = (key: keyof CarEntity, label: string, type: "text" | "url" = "text", required = false) => (
    <div className="car_page__field" key={key}>
      <label>
        {label}
        {required && <span className="car_page__required">*</span>}
      </label>
      <input
        type={type}
        value={form[key] ?? ""}
        onChange={e => setField(key, e.target.value as any)}
        required={required}
        className={errors[key as string] ? "car_page__input--error" : ""}
      />
      {errors[key as string] && <span className="car_page__field-error">{errors[key as string]}</span>}
    </div>
  );

  const selectField = (key: keyof CarEntity, label: string, options: { value: string; label: string }[], required = false) => (
    <div className="car_page__field" key={key}>
      <label>
        {label}
        {required && <span className="car_page__required">*</span>}
      </label>
      <div className={errors[key as string] ? "car_page__select--error" : ""}>
        <Select
          options={options}
          value={form[key] as string}
          onChange={value => setField(key, value as any)}
          placeholder={`Select ${label.toLowerCase()}`}
        />
      </div>
      {errors[key as string] && <span className="car_page__field-error">{errors[key as string]}</span>}
    </div>
  );

  const resetForm = async () => {
    if (isCreateMode) {
      initializeForm();
    } else if (car) {
      setForm(car);
    }
    setDebouncedImageUrl("");
    setImageError(false);
    setImageLoading(false);
    setImageLoading(false);
    setMessage(null);
  };

  return (
    <div className="car_page">
      {/* Header Section */}
      <div className="car_page__header">
        <div className="car_page__header-content">
          <div className="car_page__header-left">
            <div className="car_page__breadcrumb">
              <a href="/cars">Vehicles</a>
              <span className="car_page__breadcrumb-sep">/</span>
              <span>{isCreateMode ? "Add New Vehicle" : `${form.brand} ${form.model}`}</span>
            </div>
            <h1 className="car_page__page-title">{isCreateMode ? "Create New Vehicle" : "Edit Vehicle"}</h1>
          </div>
          <div className="car_page__header-actions">
            {!isCreateMode && (
              <div className="car_page__status-badge car_page__status-badge--active">
                <span className="car_page__status-dot"></span>
                Active
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="car_page__container">
        {/* Hero Card with Image */}
        <div className="car_page__hero-section">
          <div className="car_page__hero-card">
            <div className="car_page__hero-image-wrapper">
              {isCreateMode ? (
                debouncedImageUrl && !imageError ? (
                  <div className="car_page__hero-image">
                    {imageLoading && <div className="car_page__image-loading">Loading...</div>}
                    <img src={debouncedImageUrl} alt="Vehicle preview" onError={() => setImageError(true)} />
                  </div>
                ) : (
                  <div className="car_page__hero-empty">
                    <CarFrontFill className="car_page__hero-empty-icon" />
                    <p>{imageError ? "Invalid image URL" : "Vehicle preview will appear here"}</p>
                  </div>
                )
              ) : (
                <div className="car_page__hero-image">
                  <img src={form.imageUrl} alt={`${form.brand} ${form.model}`} />
                </div>
              )}
            </div>
            <div className="car_page__hero-info">
              <div className="car_page__hero-title-section">
                <h2 className="car_page__hero-title">
                  {isCreateMode ? (form.brand && form.model ? `${form.brand} ${form.model}` : "New Vehicle") : `${form.brand} ${form.model}`}
                </h2>
                {!isCreateMode && <p className="car_page__hero-subtitle">Year {form.year}</p>}
              </div>
              {(isCreateMode ? form.brand && form.model : true) && (
                <div className="car_page__hero-specs">
                  <div className="car_page__hero-spec">
                    <span className="car_page__hero-spec-label">Transmission</span>
                    <span className="car_page__hero-spec-value">{form.transmission || "—"}</span>
                  </div>
                  <div className="car_page__hero-spec">
                    <span className="car_page__hero-spec-label">Drive Type</span>
                    <span className="car_page__hero-spec-value">{form.driveType || "—"}</span>
                  </div>
                  <div className="car_page__hero-spec">
                    <span className="car_page__hero-spec-label">Fuel Type</span>
                    <span className="car_page__hero-spec-value">{form.fuelType || "—"}</span>
                  </div>
                  {!isCreateMode && (
                    <div className="car_page__hero-spec">
                      <span className="car_page__hero-spec-label">Location</span>
                      <span className="car_page__hero-spec-value car_page__hero-spec-with-icon">
                        <GeoAltFill />
                        {form.localisation}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {(!isCreateMode || (form.dailyPrice && form.dailyPrice > 0)) && (
                <div className="car_page__hero-pricing">
                  <div className="car_page__hero-price-amount">{form.dailyPrice} PLN</div>
                  <div className="car_page__hero-price-label">Daily Rate</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="car_page__form-container">
          {message && (
            <div className={`car_page__message ${message.includes("successfully") ? "car_page__message--success" : "car_page__message--error"}`}>
              {message.includes("successfully") ? <CheckCircle className="car_page__message-icon" /> : <XCircle className="car_page__message-icon" />}
              <span>{message}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="car_page__form-section">
            <div className="car_page__form-header">
              <InfoCircle className="car_page__form-header-icon" />
              <div className="car_page__form-header-content">
                <h3>{isCreateMode ? "Create New Vehicle" : "Basic Information"}</h3>
                <p>{isCreateMode ? "Enter the core details of the new vehicle" : "Update the core details of this vehicle"}</p>
              </div>
            </div>
            <div className="car_page__form-grid car_page__form-grid--2col">
              {textField("brand", "Brand", "text", true)}
              {textField("model", "Model", "text", true)}
              {numericField("year", "Year", true)}
              {textField("color", "Color", "text", true)}
              {textField("localisation", "Location", "text", true)}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="car_page__form-section">
            <div className="car_page__form-header">
              <Gear className="car_page__form-header-icon" />
              <div className="car_page__form-header-content">
                <h3>Technical Specifications</h3>
                <p>Engine and performance details</p>
              </div>
            </div>
            <div className="car_page__form-grid car_page__form-grid--3col">
              {selectField(
                "transmission",
                "Transmission",
                [
                  { value: "Manual", label: "Manual" },
                  { value: "Automatic", label: "Automatic" },
                  { value: "CVT", label: "CVT" },
                  { value: "Semi-automatic", label: "Semi-automatic" },
                ],
                true,
              )}
              {selectField(
                "driveType",
                "Drive Type",
                [
                  { value: "FWD", label: "Front Wheel Drive (FWD)" },
                  { value: "RWD", label: "Rear Wheel Drive (RWD)" },
                  { value: "AWD", label: "All Wheel Drive (AWD)" },
                  { value: "4WD", label: "4 Wheel Drive (4WD)" },
                ],
                true,
              )}
              {textField("fuelType", "Fuel Type", "text", true)}
              {textField("engineCapacity", "Engine Capacity", "text", true)}
              {numericField("power", "Power (HP)", true)}
              {numericField("numberOfSeats", "Number of Seats", true)}
            </div>
          </div>

          {/* Fuel & Media */}
          <div className="car_page__form-section">
            <div className="car_page__form-header">
              <FuelPumpFill className="car_page__form-header-icon" />
              <div className="car_page__form-header-content">
                <h3>Fuel Efficiency & Media</h3>
                <p>Consumption data and vehicle images</p>
              </div>
            </div>
            <div className="car_page__form-grid car_page__form-grid--2col">
              {textField("fuelUsageCity", "City Fuel Usage", "text", true)}
              {textField("fuelUsageOutcity", "Highway Fuel Usage", "text", true)}
              {textField("imageUrl", "Image URL", "url", isCreateMode)}
            </div>
          </div>

          {/* Pricing */}
          <div className="car_page__form-section">
            <div className="car_page__form-header">
              <CurrencyDollar className="car_page__form-header-icon" />
              <div className="car_page__form-header-content">
                <h3>Pricing</h3>
                <p>Set the daily rental rate</p>
              </div>
            </div>
            <div className="car_page__form-grid car_page__form-grid--1col">{numericField("dailyPrice", "Daily Price (PLN)", true)}</div>
          </div>

          {/* Actions */}
          <div className="car_page__actions-section">
            <div className="car_page__actions">
              <Button fn={handleSave} disabled={saving} className="car_page__btn-primary">
                {saving ? (isCreateMode ? "Creating..." : "Saving...") : isCreateMode ? "Create Vehicle" : "Save Changes"}
              </Button>
              <Button fn={resetForm} className="car_page__btn-secondary">
                {isCreateMode ? "Reset Form" : "Reset Changes"}
              </Button>
              {!isCreateMode && (
                <Button fn={handleDelete} className="car_page__btn-danger">
                  Delete Vehicle
                </Button>
              )}
              {isCreateMode && (
                <Button fn={async () => navigate("/cars")} className="car_page__btn-cancel">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Popup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Car;
