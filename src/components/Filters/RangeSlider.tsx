import React, { useState, useCallback, useEffect } from "react";

interface RangeSliderProps {
  title: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  unit: string;
  onChange: (value: [number, number]) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ title, min, max, step, value, unit, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Derived state: вычисляем отображаемое значение прямо в рендере
  const displayValue = isDragging ? localValue : value;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), displayValue[1] - step);
    setLocalValue([val, displayValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), displayValue[0] + step);
    setLocalValue([displayValue[0], val]);
  };

  const handleRelease = useCallback(() => {
    setIsDragging(false);
    onChange(localValue);
  }, [localValue, onChange]);

  useEffect(() => {
    const handleGlobalUp = () => {
      if (isDragging) handleRelease();
    };
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchend", handleGlobalUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchend", handleGlobalUp);
    };
  }, [isDragging, handleRelease]);

  const minPercent = ((displayValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((displayValue[1] - min) / (max - min)) * 100;

  return (
    <div className="filter-range">
      <h3 className="filter-range__title">{title}</h3>
      <div className={`filter-range__track ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
        <div className="filter-range__bg" />
        <div className="filter-range__progress" style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue[0]}
          onChange={handleMinChange}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="filter-range__thumb filter-range__thumb--min"
          aria-label={`Минимум ${title}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue[1]}
          onChange={handleMaxChange}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="filter-range__thumb filter-range__thumb--max"
          aria-label={`Максимум ${title}`}
        />
      </div>
      <div className="filter-range__values">
        <span className="tabular-nums">
          {displayValue[0]}
          {unit}
        </span>
        <span className="text-gray-300">—</span>
        <span className="tabular-nums">
          {displayValue[1]}
          {unit}
        </span>
      </div>
    </div>
  );
};
