import React from "react";

interface CheckboxGroupProps {
  title: string;
  options: { value: string | number; label: string }[];
  selected: (string | number)[];
  onChange: (values: (string | number)[]) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, options, selected, onChange }) => {
  const toggle = (value: string | number) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="filter-checkbox">
      <h3 className="filter-checkbox__title">{title}</h3>
      <div className="filter-checkbox__list">
        {options.map((opt) => (
          <label key={opt.value} className="filter-checkbox__item">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="filter-checkbox__input"
            />
            <span
              className={`filter-checkbox__box ${selected.includes(opt.value) ? "filter-checkbox__box--checked" : ""}`}>
              {selected.includes(opt.value) && (
                <svg
                  className="filter-checkbox__check"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="filter-checkbox__label">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
