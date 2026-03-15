import "./Car.styles.sass";
import Button from "@/components/Button/Button.component";
import Loader from "@/components/Loader/Loader.component";
import Popup from "@/components/Popup/Popup.component";
import Select from "@/components/Select/Select.component";
import type { CarEntity } from "@/types/cars.types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  };

  const handleSave = async () => {
    if (!form) return;

    // Validation for create mode
    if (isCreateMode && (!form.brand || !form.model)) {
      setMessage("Brand and model are required");
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
      />
    </div>
  );

  const textField = (key: keyof CarEntity, label: string, type: "text" | "url" = "text", required = false) => (
    <div className="car_page__field" key={key}>
      <label>
        {label}
        {required && <span className="car_page__required">*</span>}
      </label>
      <input type={type} value={form[key] ?? ""} onChange={e => setField(key, e.target.value as any)} required={required} />
    </div>
  );

  const selectField = (key: keyof CarEntity, label: string, options: { value: string; label: string }[], required = false) => (
    <div className="car_page__field" key={key}>
      <label>
        {label}
        {required && <span className="car_page__required">*</span>}
      </label>
      <Select
        options={options}
        value={form[key] as string}
        onChange={value => setField(key, value as any)}
        placeholder={`Select ${label.toLowerCase()}`}
      />
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
      <div className="car_page__container">
        <div className="car_page__content">
          <aside className="car_page__sidebar">
            <div className="car_page__card">
              <div className={`car_page__card-header ${isCreateMode ? "car_page__card-header--create" : ""}`}>
                <h3>{isCreateMode ? "New Vehicle" : "Vehicle Overview"}</h3>
              </div>
              {isCreateMode ? (
                debouncedImageUrl && !imageError ? (
                  <div className="car_page__image">
                    {imageLoading && <div className="car_page__image-loading">Loading...</div>}
                    <img src={debouncedImageUrl} alt="Vehicle preview" onError={() => setImageError(true)} />
                  </div>
                ) : (
                  <div className="car_page__preview">
                    <div className="car_page__preview-placeholder">
                      <div className="car_page__preview-icon">🚗</div>
                      <p>Vehicle Preview</p>
                      <small>{imageError ? "Invalid image URL" : "Fill in the details to see preview"}</small>
                    </div>
                  </div>
                )
              ) : (
                <div className="car_page__image">
                  <img src={form.imageUrl} alt={`${form.brand} ${form.model}`} />
                  <div className="car_page__image-overlay">
                    <span className="car_page__status">Active</span>
                  </div>
                </div>
              )}
              <div className="car_page__meta">
                <h2 className="car_page__title">
                  {isCreateMode ? (form.brand && form.model ? `${form.brand} ${form.model}` : "New Car") : `${form.brand} ${form.model}`}
                </h2>
                {(isCreateMode ? form.brand && form.model : true) && (
                  <div className="car_page__specs">
                    <div className="car_page__spec-item">
                      <span className="car_page__spec-label">Year</span>
                      <span className="car_page__spec-value">{form.year}</span>
                    </div>
                    {(form.transmission || isCreateMode) && (
                      <div className="car_page__spec-item">
                        <span className="car_page__spec-label">Transmission</span>
                        <span className="car_page__spec-value">{form.transmission || "Not set"}</span>
                      </div>
                    )}
                    {(form.driveType || isCreateMode) && (
                      <div className="car_page__spec-item">
                        <span className="car_page__spec-label">Drive Type</span>
                        <span className="car_page__spec-value">{form.driveType || "Not set"}</span>
                      </div>
                    )}
                    {(form.fuelType || isCreateMode) && (
                      <div className="car_page__spec-item">
                        <span className="car_page__spec-label">Fuel Type</span>
                        <span className="car_page__spec-value">{form.fuelType || "Not set"}</span>
                      </div>
                    )}
                  </div>
                )}
                {(!isCreateMode || (form.dailyPrice && form.dailyPrice > 0)) && (
                  <div className="car_page__pricing">
                    <div className="car_page__price">
                      <span className="car_page__price-amount">{form.dailyPrice}</span>
                      <span className="car_page__price-unit">PLN/day</span>
                    </div>
                    {!isCreateMode && <div className="car_page__location">📍 {form.localisation}</div>}
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className="car_page__main">
            <div className="car_page__form-section">
              <div className="car_page__form-header">
                <h3>{isCreateMode ? "Create New Vehicle" : "Basic Information"}</h3>
                <p>{isCreateMode ? "Enter the core details of the new vehicle" : "Update the core details of this vehicle"}</p>
              </div>
              <div className="car_page__form-grid">
                {textField("brand", "Brand", "text", isCreateMode)}
                {textField("model", "Model", "text", isCreateMode)}
                {numericField("year", "Year")}
                {textField("color", "Color")}
                {textField("localisation", "Location")}
              </div>
            </div>

            <div className="car_page__form-section">
              <div className="car_page__form-header">
                <h3>Technical Specifications</h3>
                <p>Engine and performance details</p>
              </div>
              <div className="car_page__form-grid">
                {selectField("transmission", "Transmission", [
                  { value: "Manual", label: "Manual" },
                  { value: "Automatic", label: "Automatic" },
                  { value: "CVT", label: "CVT" },
                  { value: "Semi-automatic", label: "Semi-automatic" },
                ])}
                {selectField("driveType", "Drive Type", [
                  { value: "FWD", label: "Front Wheel Drive (FWD)" },
                  { value: "RWD", label: "Rear Wheel Drive (RWD)" },
                  { value: "AWD", label: "All Wheel Drive (AWD)" },
                  { value: "4WD", label: "4 Wheel Drive (4WD)" },
                ])}
                {textField("fuelType", "Fuel Type")}
                {textField("engineCapacity", "Engine Capacity")}
                {numericField("power", "Power (HP)")}
                {numericField("numberOfSeats", "Number of Seats")}
              </div>
            </div>

            <div className="car_page__form-section">
              <div className="car_page__form-header">
                <h3>Fuel Efficiency & Media</h3>
                <p>Consumption data and vehicle images</p>
              </div>
              <div className="car_page__form-grid">
                {textField("fuelUsageCity", "City Fuel Usage")}
                {textField("fuelUsageOutcity", "Highway Fuel Usage")}
                {textField("imageUrl", "Image URL", "url")}
              </div>
            </div>

            <div className="car_page__form-section">
              <div className="car_page__form-header">
                <h3>Pricing</h3>
                <p>Set the daily rental rate</p>
              </div>
              <div className="car_page__form-grid car_page__form-grid--pricing">{numericField("dailyPrice", "Daily Price (PLN)", isCreateMode)}</div>
            </div>

            {message && (
              <div className={`car_page__message ${message.includes("successfully") ? "car_page__message--success" : "car_page__message--error"}`}>
                {message}
              </div>
            )}

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
          </main>
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
