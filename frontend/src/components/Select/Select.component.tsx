import "./Select.styles.sass";
import { useState, useRef, useEffect } from "react";
import ChevronDown from "bootstrap-icons/icons/chevron-down.svg?react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Select = ({ options, value, placeholder = "Select...", onChange, disabled = false }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`select ${disabled ? "select--disabled" : ""}`} ref={selectRef}>
      <div className={`select__trigger ${isOpen ? "select__trigger--open" : ""}`} onClick={() => !disabled && setIsOpen(!isOpen)}>
        <span className={selectedOption ? "select__value" : "select__placeholder"}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`select__arrow ${isOpen ? "select__arrow--rotated" : ""}`} />
      </div>

      {isOpen && (
        <div className="select__dropdown">
          {options.map(option => (
            <div
              key={option.value}
              className={`select__option ${value === option.value ? "select__option--selected" : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
