import React from "react";

interface SelectFilterProps {
  title: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({ title, value, options, onChange }) => {
  return (
    <div className="filter-select">
      <h3 className="filter-select__title">{title}</h3>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="filter-select__control">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
