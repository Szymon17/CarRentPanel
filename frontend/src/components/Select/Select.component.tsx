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

const DROPDOWN_HEIGHT = 240;

const Select = ({ options, value, placeholder = "Select...", onChange, disabled = false }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
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

  const toggleOpen = () => {
    if (disabled) return;

    if (!isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < DROPDOWN_HEIGHT && spaceAbove > spaceBelow);
    }

    setIsOpen(prev => !prev);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`select ${disabled ? "select--disabled" : ""}`} ref={selectRef}>
      <div className={`select__trigger ${isOpen ? "select__trigger--open" : ""}`} onClick={toggleOpen}>
        <span className={selectedOption ? "select__value" : "select__placeholder"}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`select__arrow ${isOpen ? "select__arrow--rotated" : ""}`} />
      </div>

      {isOpen && (
        <div className={`select__dropdown ${openUpward ? "select__dropdown--up" : ""}`}>
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
