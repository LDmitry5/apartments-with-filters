import React, { useState, useEffect, useCallback } from "react";

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
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  // Синхронизация с пропсами только когда пользователь не тянет
  useEffect(() => {
    if (!isDragging) setLocalValue(value);
  }, [value, isDragging]);

  // Мгновенное обновление UI при движении
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), localValue[1] - step);
    setLocalValue([val, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), localValue[0] + step);
    setLocalValue([localValue[0], val]);
  };

  // Запрос к API только при отпускании мыши/пальца
  const handleRelease = useCallback(() => {
    setIsDragging(false);
    onChange(localValue);
  }, [localValue, onChange]);

  const handleDragStart = () => setIsDragging(true);

  // Глобальный слушатель на случай, если курсор ушёл за пределы трека
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

  // Проценты для позиционирования прогресс-бара
  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="filter-range">
      <h3 className="filter-range__title">{title}</h3>

      <div className="filter-range__track">
        <div className="filter-range__bg" />
        <div className="filter-range__progress" style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="filter-range__thumb filter-range__thumb--min"
          aria-label={`Минимум ${title}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="filter-range__thumb filter-range__thumb--max"
          aria-label={`Максимум ${title}`}
        />
      </div>

      <div className="filter-range__values">
        <span className="tabular-nums">
          {localValue[0]}
          {unit}
        </span>
        <span className="text-gray-300">—</span>
        <span className="tabular-nums">
          {localValue[1]}
          {unit}
        </span>
      </div>
    </div>
  );
};
