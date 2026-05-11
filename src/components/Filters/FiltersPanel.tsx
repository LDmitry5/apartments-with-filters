import React from "react";
import type { FilterState, LayoutType } from "../../types/apartment";
import { CheckboxGroup } from "./CheckboxGroup";
import { RangeSlider } from "./RangeSlider";
import { SelectFilter } from "./SelectFilter";

interface FiltersPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const ROOM_OPTIONS = [
  { value: 0, label: "Студия" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4+" },
];

const LAYOUT_OPTIONS: { value: LayoutType | ""; label: string }[] = [
  { value: "", label: "Все типы" },
  { value: "studio", label: "Студия" },
  { value: "1-room", label: "1-комнатная" },
  { value: "2-room", label: "2-комнатная" },
  { value: "3-room", label: "3-комнатная" },
  { value: "penthouse", label: "Пентхаус" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Все" },
  { value: "ready", label: "Сдан" },
  { value: "under-construction", label: "Строится" },
];

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, onFilterChange }) => {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFilterChange({
      rooms: [],
      area: [15, 200],
      floor: [1, 30],
      layoutType: "",
      status: "",
    });
  };

  const hasActiveFilters =
    filters.rooms.length > 0 ||
    filters.layoutType !== "" ||
    filters.status !== "" ||
    filters.area[0] > 15 ||
    filters.area[1] < 200 ||
    filters.floor[0] > 1 ||
    filters.floor[1] < 30;

  return (
    <aside className="filters">
      <div className="filters__header">
        <h2 className="filters__title">Фильтры</h2>
        {hasActiveFilters && (
          <button className="filters__clear" onClick={clearAll}>
            Сбросить
          </button>
        )}
      </div>

      <div className="filters__content">
        <CheckboxGroup
          title="Комнаты"
          options={ROOM_OPTIONS}
          selected={filters.rooms}
          onChange={(v) => update("rooms", v as number[])}
        />

        <RangeSlider
          title="Площадь"
          min={15}
          max={200}
          step={5}
          value={filters.area}
          unit=" м²"
          onChange={(v) => update("area", v)}
        />

        <RangeSlider
          title="Этаж"
          min={1}
          max={30}
          step={1}
          value={filters.floor}
          unit=""
          onChange={(v) => update("floor", v)}
        />

        <SelectFilter
          title="Тип планировки"
          value={filters.layoutType}
          options={LAYOUT_OPTIONS as { value: string; label: string }[]}
          onChange={(v) => update("layoutType", v as LayoutType | "")}
        />

        <SelectFilter
          title="Сдача"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(v) => update("status", v as "ready" | "under-construction" | "")}
        />
      </div>
    </aside>
  );
};
